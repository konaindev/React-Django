import datetime
import decimal
import os
from unittest import mock

from django.test import TestCase
from googleapiclient.discovery import build
from googleapiclient.http import HttpMockSequence
from graphkit import operation

from remark.factories.analytics import create_google_provider
from remark.factories.benchmarks import generate_benchmarks
from remark.factories.periods import create_periods, generate_weekly_periods
from remark.factories.projects import create_project, create_project_property
from remark.projects.constants import HEALTH_STATUS
from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.projects.insights import (
    retention_rate_health,
    top_usv_referral,
    low_performing,
    kpi_below_average,
    kpi_high_performing,
    kpi_above_average,
    kpi_off_track_mitigated,
    kpi_at_risk_mitigated,
    kpi_off_track_not_mitigated,
    kpi_at_risk_not_mitigated,
    kpi_trend_change_health,
    usvs_on_track,
    change_health_status,
    lease_rate_against_target,
)
from remark_airflow.insights.impl.stub_data.benchmark import stub_benchmark_kpis

from .projects import get_project_facts, get_project_insights


class GetProjectFactsTestCase(TestCase):
    def setUp(self):
        def test_operation_1(project, start, end):
            start_str = start.strftime("%Y-%m-%d")
            end_str = end.strftime("%Y-%m-%d")
            return f"{project.public_id}, {start_str}, {end_str}"

        def test_operation_2(_):
            return "test_operation_result"

        self.project_insights = [
            Insight(
                name="test_insight",
                template="test insight",
                triggers=["test_result"],
                graph=[
                    operation(
                        name="test_1",
                        needs=["project", "start", "end"],
                        provides=["test_result_1"],
                    )(test_operation_1),
                    operation(
                        name="test_2", needs=["project"], provides=["test_result_2"]
                    )(test_operation_2),
                ],
            )
        ]
        self.project_id = create_project().public_id

    def test_get_project_facts(self):
        start = datetime.date(year=2019, month=6, day=7)
        end = datetime.date(year=2019, month=6, day=14)
        result = get_project_facts(self.project_insights, self.project_id, start, end)
        expected = {
            "test_result_1": f"{self.project_id}, 2019-06-07, 2019-06-14",
            "test_result_2": f"test_operation_result",
        }
        self.assertDictEqual(result, expected)


class GetProjectInsightsTestCase(TestCase):
    def setUp(self):
        self.project_facts = {
            "trigger_is_active_campaign": True,
            "trigger_campaign_health_status_off_track": True,
            "trigger_health_status_is_changed": True,
            "var_current_period_leased_rate": 0.89,
            "var_target_leased_rate": 0.94,
            "var_campaign_health_status": 2,
            "var_prev_health_status": 0,
        }
        self.project_insights = [
            Insight(
                name="lease_rate_against_target",
                template="Property is {{ var_current_period_leased_rate }}%"
                " Leased against period target of {{ var_target_leased_rate }}%,"
                " assessed as {{ var_campaign_health_status | health_status_to_str }}.",
                triggers=["trigger_is_active_campaign"],
            ),
            Insight(
                name="change_health_status",
                template="Campaign health has changed from {{var_prev_health_status | health_status_to_str}}"
                " to {{var_campaign_health_status | health_status_to_str }} during this period.",
                triggers=["trigger_health_status_is_changed"],
            ),
        ]

    def test_get_project_insights(self):
        result = get_project_insights(self.project_facts, self.project_insights)
        expected = {
            "lease_rate_against_target": "Property is 0.89% Leased against period target of 0.94%, assessed as On Track.",
            "change_health_status": "Campaign health has changed from Off Track to On Track during this period.",
        }
        self.assertEqual(result, expected)

    def test_get_project_insights_not_trigger(self):
        project_facts = self.project_facts.copy()
        project_facts["trigger_is_active_campaign"] = False
        project_facts["trigger_health_status_is_changed"] = False
        result = get_project_insights(project_facts, self.project_insights)
        expected = {}
        self.assertEqual(result, expected)


class LeaseRateAgainstTarget(TestCase):
    def setUp(self) -> None:
        project_property = create_project_property(total_units=195)
        self.project = create_project(project_property=project_property)
        self.start = datetime.date(year=2020, month=2, day=3)
        self.end = datetime.date(year=2020, month=2, day=10)
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"leased_units_end": 156},
            target_period_params={"target_leased_rate": decimal.Decimal("0.83")},
        )

    def test_triggered(self):
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = lease_rate_against_target.graph(args)
        self.assertEqual(project_facts["var_campaign_health_status"], 2)
        self.assertEqual(project_facts["var_current_period_leased_rate"], 0.8)
        self.assertEqual(
            project_facts["var_target_leased_rate"], decimal.Decimal("0.83")
        )
        self.assertTrue(project_facts["trigger_is_active_campaign"])

        result = lease_rate_against_target.evaluate(project_facts)
        expected_text = (
            "Property is 80% Leased against period target of 83%, assessed as On Track."
        )
        self.assertEqual(result[0], "lease_rate_against_target")
        self.assertEqual(result[1], expected_text)

    def test_not_triggered(self):
        args = {
            "start": self.start - datetime.timedelta(weeks=1),
            "end": self.end - datetime.timedelta(weeks=1),
            "project": self.project,
        }
        project_facts = lease_rate_against_target.graph(args)
        self.assertFalse(project_facts["trigger_is_active_campaign"])

        result = lease_rate_against_target.evaluate(project_facts)
        self.assertIsNone(result)


class ChangeHealthStatusTestCase(TestCase):
    def setUp(self) -> None:
        project_property = create_project_property(total_units=196)
        self.project = create_project(
            baseline_start=datetime.date(year=2019, month=8, day=1),
            baseline_end=datetime.date(year=2019, month=10, day=14),
            project_property=project_property,
        )
        start = datetime.date(year=2020, month=2, day=3)
        end = datetime.date(year=2020, month=2, day=10)
        self.args = {"start": start, "end": end, "project": self.project}

    def test_not_triggered(self):
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=2, day=3),
            end=datetime.date(year=2020, month=2, day=10),
            period_params={
                "lease_stage_id": 2,
                "start": datetime.date(2020, 2, 3),
                "end": datetime.date(2020, 2, 10),
                "includes_remarkably_effect": True,
                "leased_units_start": 188,
                "leased_units_end": 191,
                "leases_ended": 0,
                "lease_applications": 3,
                "leases_executed": 3,
                "lease_cds": 0,
                "lease_renewal_notices": 1,
                "lease_renewals": 1,
                "lease_vacation_notices": 0,
                "occupiable_units_start": 252,
                "occupied_units_start": 166,
                "occupied_units_end": 167,
                "move_ins": 1,
                "move_outs": 0,
                "acq_reputation_building": decimal.Decimal("0.00"),
                "acq_demand_creation": decimal.Decimal("2075.55"),
                "acq_leasing_enablement": decimal.Decimal("74.75"),
                "acq_market_intelligence": decimal.Decimal("0.00"),
                "ret_reputation_building": decimal.Decimal("0.00"),
                "ret_demand_creation": decimal.Decimal("0.00"),
                "ret_leasing_enablement": decimal.Decimal("94.50"),
                "ret_market_intelligence": decimal.Decimal("0.00"),
                "usvs": 932,
                "inquiries": 36,
                "tours": 14,
            },
            target_period_params={
                "start": datetime.date(2020, 2, 3),
                "end": datetime.date(2020, 2, 10),
                "target_leased_rate": decimal.Decimal("0.995"),
                "target_lease_applications": 2,
                "target_leases_executed": 2,
                "target_lease_renewal_notices": 3,
                "target_lease_renewals": 1,
                "target_lease_vacation_notices": 2,
                "target_lease_cds": 0,
                "target_delta_leases": 2,
                "target_move_ins": 1,
                "target_move_outs": 0,
                "target_occupied_units": 179,
                "target_acq_investment": decimal.Decimal("4345.15"),
                "target_ret_investment": decimal.Decimal("341.53"),
                "target_usvs": 310,
                "target_inquiries": 17,
                "target_tours": 7,
            },
        )
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=1, day=27),
            end=datetime.date(year=2020, month=2, day=3),
            period_params={
                "lease_stage_id": 2,
                "start": datetime.date(2020, 1, 27),
                "end": datetime.date(2020, 2, 3),
                "includes_remarkably_effect": True,
                "leased_units_start": 185,
                "leased_units_end": 188,
                "leases_ended": 0,
                "lease_applications": 3,
                "leases_executed": 3,
                "lease_cds": 0,
                "lease_renewal_notices": 1,
                "lease_renewals": 1,
                "lease_vacation_notices": 0,
                "occupiable_units_start": 252,
                "occupied_units_start": 165,
                "occupied_units_end": 166,
                "move_ins": 1,
                "move_outs": 0,
                "acq_reputation_building": decimal.Decimal("0.00"),
                "acq_demand_creation": decimal.Decimal("2075.55"),
                "acq_leasing_enablement": decimal.Decimal("74.75"),
                "acq_market_intelligence": decimal.Decimal("0.00"),
                "ret_reputation_building": decimal.Decimal("0.00"),
                "ret_demand_creation": decimal.Decimal("0.00"),
                "ret_leasing_enablement": decimal.Decimal("94.50"),
                "ret_market_intelligence": decimal.Decimal("0.00"),
                "usvs": 932,
                "inquiries": 36,
                "tours": 14,
            },
            target_period_params={
                "start": datetime.date(2020, 1, 27),
                "end": datetime.date(2020, 2, 3),
                "target_leased_rate": decimal.Decimal("0.985"),
                "target_lease_applications": 2,
                "target_leases_executed": 1,
                "target_lease_renewal_notices": 2,
                "target_lease_renewals": 1,
                "target_lease_vacation_notices": 2,
                "target_lease_cds": 1,
                "target_delta_leases": -1,
                "target_move_ins": 2,
                "target_move_outs": 2,
                "target_occupied_units": 178,
                "target_acq_investment": decimal.Decimal("4345.15"),
                "target_ret_investment": decimal.Decimal("341.53"),
                "target_usvs": 365,
                "target_inquiries": 20,
                "target_tours": 8,
            },
        )
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=1, day=20),
            end=datetime.date(year=2020, month=1, day=27),
            period_params={
                "lease_stage_id": 2,
                "start": datetime.date(2020, 1, 20),
                "end": datetime.date(2020, 1, 27),
                "includes_remarkably_effect": True,
                "leased_units_start": 181,
                "leased_units_end": 185,
                "leases_ended": 0,
                "lease_applications": 5,
                "leases_executed": 4,
                "lease_cds": 1,
                "lease_renewal_notices": 0,
                "lease_renewals": 0,
                "lease_vacation_notices": 0,
                "occupiable_units_start": 252,
                "occupied_units_start": 163,
                "occupied_units_end": 165,
                "move_ins": 2,
                "move_outs": 0,
                "acq_reputation_building": decimal.Decimal("0.00"),
                "acq_demand_creation": decimal.Decimal("2075.55"),
                "acq_leasing_enablement": decimal.Decimal("74.75"),
                "acq_market_intelligence": decimal.Decimal("0.00"),
                "ret_reputation_building": decimal.Decimal("0.00"),
                "ret_demand_creation": decimal.Decimal("0.00"),
                "ret_leasing_enablement": decimal.Decimal("94.50"),
                "ret_market_intelligence": decimal.Decimal("0.00"),
                "usvs": 999,
                "inquiries": 37,
                "tours": 12,
            },
            target_period_params={
                "start": datetime.date(2020, 1, 20),
                "end": datetime.date(2020, 1, 27),
                "target_leased_rate": decimal.Decimal("0.990"),
                "target_lease_applications": 1,
                "target_leases_executed": 1,
                "target_lease_renewal_notices": 0,
                "target_lease_renewals": 1,
                "target_lease_vacation_notices": 1,
                "target_lease_cds": 0,
                "target_delta_leases": 0,
                "target_move_ins": 1,
                "target_move_outs": 1,
                "target_occupied_units": 178,
                "target_acq_investment": decimal.Decimal("4345.15"),
                "target_ret_investment": decimal.Decimal("341.53"),
                "target_usvs": 183,
                "target_inquiries": 10,
                "target_tours": 4,
            },
        )

        project_facts = change_health_status.graph(self.args)
        self.assertFalse(project_facts["trigger_health_status_is_changed"])
        result = change_health_status.evaluate(project_facts)
        self.assertIsNone(result)


class RetentionRateInsightTestCase(TestCase):
    def setUp(self):
        project = create_project()
        create_periods(
            project,
            start=datetime.date(year=2019, month=12, day=2),
            end=datetime.date(year=2019, month=12, day=9),
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 1.08},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )
        create_periods(
            project,
            start=datetime.date(year=2019, month=11, day=25),
            end=datetime.date(year=2019, month=12, day=2),
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 5},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )
        create_periods(
            project,
            start=datetime.date(year=2019, month=11, day=18),
            end=datetime.date(year=2019, month=11, day=25),
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 5},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )
        create_periods(
            project,
            start=datetime.date(year=2019, month=11, day=11),
            end=datetime.date(year=2019, month=11, day=18),
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 1.08},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )
        self.project = project

    def test_trend_flat(self):
        start = datetime.date(year=2019, month=11, day=25)
        end = datetime.date(year=2019, month=12, day=2)
        args = {"start": start, "end": end, "project": self.project}
        project_facts = retention_rate_health.graph(args)
        expected = {
            "start": start,
            "end": end,
            "project": self.project,
            "var_retention_rate_health": HEALTH_STATUS["OFF_TRACK"],
            "var_retention_rate_health_weeks": 2,
            "var_retention_rate_trend": "flat",
            "trigger_retention_rate_health": True,
        }
        self.assertEqual(
            project_facts["var_retention_rate_health"],
            expected["var_retention_rate_health"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_health_weeks"],
            expected["var_retention_rate_health_weeks"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_trend"],
            expected["var_retention_rate_trend"],
        )
        self.assertEqual(
            project_facts["trigger_retention_rate_health"],
            expected["trigger_retention_rate_health"],
        )
        result = retention_rate_health.evaluate(project_facts)
        expected_text = (
            "Your Retention Rate has been Off Track for 2 week(s) and is trending flat."
        )
        self.assertEqual(result[0], "retention_rate_health")
        self.assertEqual(result[1], expected_text)

    def test_trend_down(self):
        start = datetime.date(year=2019, month=11, day=18)
        end = datetime.date(year=2019, month=11, day=25)
        args = {"start": start, "end": end, "project": self.project}
        project_facts = retention_rate_health.graph(args)
        expected = {
            "start": start,
            "end": end,
            "project": self.project,
            "var_retention_rate_health": HEALTH_STATUS["OFF_TRACK"],
            "var_retention_rate_health_weeks": 1,
            "var_retention_rate_trend": "down",
            "trigger_retention_rate_health": True,
        }
        self.assertEqual(
            project_facts["var_retention_rate_health"],
            expected["var_retention_rate_health"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_health_weeks"],
            expected["var_retention_rate_health_weeks"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_trend"],
            expected["var_retention_rate_trend"],
        )
        self.assertEqual(
            project_facts["trigger_retention_rate_health"],
            expected["trigger_retention_rate_health"],
        )
        result = retention_rate_health.evaluate(project_facts)
        expected_text = (
            "Your Retention Rate has been Off Track for 1 week(s) and is trending down."
        )
        self.assertEqual(result[0], "retention_rate_health")
        self.assertEqual(result[1], expected_text)

    def test_trend_up(self):
        start = datetime.date(year=2019, month=12, day=2)
        end = datetime.date(year=2019, month=12, day=9)
        args = {"start": start, "end": end, "project": self.project}
        project_facts = retention_rate_health.graph(args)
        expected = {
            "start": start,
            "end": end,
            "project": self.project,
            "var_retention_rate_health": HEALTH_STATUS["AT_RISK"],
            "var_retention_rate_health_weeks": 1,
            "var_retention_rate_trend": "up",
            "trigger_retention_rate_health": True,
        }
        self.assertEqual(
            project_facts["var_retention_rate_health"],
            expected["var_retention_rate_health"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_health_weeks"],
            expected["var_retention_rate_health_weeks"],
        )
        self.assertEqual(
            project_facts["var_retention_rate_trend"],
            expected["var_retention_rate_trend"],
        )
        self.assertEqual(
            project_facts["trigger_retention_rate_health"],
            expected["trigger_retention_rate_health"],
        )
        result = retention_rate_health.evaluate(project_facts)
        expected_text = (
            "Your Retention Rate has been At Risk for 1 week(s) and is trending up."
        )
        self.assertEqual(result[0], "retention_rate_health")
        self.assertEqual(result[1], expected_text)


class TopUSVTestCase(TestCase):
    def setUp(self):
        project = create_project()
        create_google_provider(project)
        self.start = datetime.date(year=2019, month=11, day=18)
        self.end = datetime.date(year=2019, month=11, day=25)
        self.project = project

    def get_google_api_mock(self, file_path):
        file_path = os.path.join(os.path.dirname(__file__), "tests", file_path)
        google_api = os.path.join(os.path.dirname(__file__), "tests/google_api.json")
        http = HttpMockSequence(
            [
                ({"status": "200"}, open(google_api, "rb").read()),
                ({"status": "200"}, open(file_path, "rb").read()),
            ]
        )
        return build("analyticsreporting", "v4", developerKey="developerKey", http=http)

    @mock.patch("remark.analytics.google_analytics.initialize_analytics_reporting")
    def test_direct_transitions(self, mock_google_api):
        mock_google_api.return_value = self.get_google_api_mock(
            "google_analytics_response.json"
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = top_usv_referral.graph(args)
        self.assertEqual(project_facts["trigger_has_data_google_analytics"], True)
        self.assertEqual(project_facts["var_top_usv_referral"], "Direct transitions")

        result = top_usv_referral.evaluate(project_facts)
        expected_text = "Direct transitions is your top source of Unique Site Visitors (USV) volume, this period."
        self.assertEqual(result[0], "top_usv_referral")
        self.assertEqual(result[1], expected_text)

    @mock.patch("remark.analytics.google_analytics.initialize_analytics_reporting")
    def test_google(self, mock_google_api):
        mock_google_api.return_value = self.get_google_api_mock(
            "google_analytics_response_google.json"
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = top_usv_referral.graph(args)
        self.assertEqual(project_facts["trigger_has_data_google_analytics"], True)
        self.assertEqual(project_facts["var_top_usv_referral"], "google")

        result = top_usv_referral.evaluate(project_facts)
        expected_text = "google is your top source of Unique Site Visitors (USV) volume, this period."
        self.assertEqual(result[0], "top_usv_referral")
        self.assertEqual(result[1], expected_text)

    @mock.patch("remark.analytics.google_analytics.initialize_analytics_reporting")
    def test_not_triggered(self, mock_google_api):
        mock_google_api.return_value = self.get_google_api_mock(
            "google_analytics_response_empty.json"
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = top_usv_referral.graph(args)
        self.assertIsNone(project_facts["var_top_usv_referral"])
        self.assertFalse(project_facts["trigger_has_data_google_analytics"])

        result = top_usv_referral.evaluate(project_facts)
        self.assertIsNone(result)

    @mock.patch("remark.analytics.google_analytics.initialize_analytics_reporting")
    def test_dont_have_provider(self, _):
        project = create_project()
        args = {"start": self.start, "end": self.end, "project": project}
        project_facts = top_usv_referral.graph(args)
        self.assertIsNone(project_facts["var_top_usv_referral"])
        self.assertFalse(project_facts["trigger_has_data_google_analytics"])

        result = top_usv_referral.evaluate(project_facts)
        self.assertIsNone(result)


class LowPerformingTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def generate_kpi(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 5},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )

    def test_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = low_performing.graph(args)

        self.assertEqual(project_facts["var_low_performing_kpi"], "apps")
        self.assertEqual(project_facts["trigger_low_performing"], True)

        result = low_performing.evaluate(project_facts)
        expected_text = "Volume of APP is your worst performing metric compared to your Remarkably customer peer set average, this period."
        self.assertEqual(result[0], "low_performing")
        self.assertEqual(result[1], expected_text)

    def test_not_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_reputation_building": 3928.90,
                "lease_applications": 3,
                "tours": 11,
            },
            target_period_params={"target_lease_applications": 5, "target_tours": 10},
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = low_performing.graph(args)

        self.assertEqual(project_facts["var_low_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_low_performing"], False)

        result = low_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        generate_benchmarks(stub_benchmark_kpis)
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = low_performing.graph(args)
        self.assertEqual(project_facts["var_low_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_low_performing"], False)

        result = low_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_benchmarks(self):
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = low_performing.graph(args)
        self.assertEqual(project_facts["var_low_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_low_performing"], False)

        result = low_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi_and_benchmarks(self):
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = low_performing.graph(args)
        self.assertEqual(project_facts["var_low_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_low_performing"], False)

        result = low_performing.evaluate(project_facts)
        self.assertIsNone(result)


class KPIBelowAverageTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def generate_kpi(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_reputation_building": 3928.90,
                "lease_applications": 3,
                "tours": 11,
            },
            target_period_params={"target_lease_applications": 5, "target_tours": 10},
        )

    def test_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_below_average.graph(args)

        self.assertEqual(project_facts["var_below_average_kpi"], "tou_app")
        self.assertEqual(project_facts["trigger_below_average"], True)

        result = kpi_below_average.evaluate(project_facts)
        expected_text = "TOU > APP is your worst performing metric compared to your Remarkably customer peer set average, this period."
        self.assertEqual(result[0], "kpi_below_average")
        self.assertEqual(result[1], expected_text)

    def test_not_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"lease_renewal_notices": 1, "lease_vacation_notices": 5},
            target_period_params={
                "target_lease_renewal_notices": 3,
                "target_lease_vacation_notices": 2,
            },
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_below_average.graph(args)

        self.assertEqual(project_facts["var_below_average_kpi"], None)
        self.assertEqual(project_facts["trigger_below_average"], False)

        result = kpi_below_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        generate_benchmarks(stub_benchmark_kpis)
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_below_average.graph(args)
        self.assertEqual(project_facts["var_below_average_kpi"], None)
        self.assertEqual(project_facts["trigger_below_average"], False)

        result = kpi_below_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_benchmarks(self):
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_below_average.graph(args)
        self.assertEqual(project_facts["var_below_average_kpi"], None)
        self.assertEqual(project_facts["trigger_below_average"], False)

        result = kpi_below_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi_and_benchmarks(self):
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_below_average.graph(args)
        self.assertEqual(project_facts["var_below_average_kpi"], None)
        self.assertEqual(project_facts["trigger_below_average"], False)

        result = kpi_below_average.evaluate(project_facts)
        self.assertIsNone(result)


class KPIHighPerformingTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def generate_kpi(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_reputation_building": 3928.90,
                "lease_applications": 3,
                "tours": 11,
            },
            target_period_params={"target_lease_applications": 5, "target_tours": 10},
        )

    def test_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_high_performing.graph(args)

        self.assertEqual(project_facts["var_high_performing_kpi"], "apps")
        self.assertEqual(project_facts["trigger_high_performing"], True)

        result = kpi_high_performing.evaluate(project_facts)
        expected_text = "Volume of APP is your best performing metric compared to your Remarkably customer peer set average, this period."
        self.assertEqual(result[0], "kpi_high_performing")
        self.assertEqual(result[1], expected_text)

    def test_not_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        create_periods(self.project, start=self.start, end=self.end)

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_high_performing.graph(args)

        self.assertEqual(project_facts["var_high_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_high_performing"], False)

        result = kpi_high_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        generate_benchmarks(stub_benchmark_kpis)
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_high_performing.graph(args)
        self.assertEqual(project_facts["var_high_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_high_performing"], False)

        result = kpi_high_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_benchmarks(self):
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_high_performing.graph(args)
        self.assertEqual(project_facts["var_high_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_high_performing"], False)

        result = kpi_high_performing.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi_and_benchmarks(self):
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_high_performing.graph(args)
        self.assertEqual(project_facts["var_high_performing_kpi"], None)
        self.assertEqual(project_facts["trigger_high_performing"], False)

        result = kpi_high_performing.evaluate(project_facts)
        self.assertIsNone(result)


class KPIAboveAverageTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def generate_kpi(self):
        create_periods(self.project, start=self.start, end=self.end)

    def test_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_above_average.graph(args)

        self.assertEqual(project_facts["var_above_average_kpi"], "usv_inq")
        self.assertEqual(project_facts["trigger_above_average"], True)

        result = kpi_above_average.evaluate(project_facts)
        expected_text = "USV > INQ is your best performing metric compared to your Remarkably customer peer set average, this period."
        self.assertEqual(result[0], "kpi_above_average")
        self.assertEqual(result[1], expected_text)

    def test_not_triggered(self):
        generate_benchmarks(stub_benchmark_kpis)
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_reputation_building": 3928.90,
                "lease_applications": 3,
                "tours": 11,
            },
            target_period_params={"target_lease_applications": 5, "target_tours": 10},
        )

        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_above_average.graph(args)

        self.assertEqual(project_facts["var_above_average_kpi"], None)
        self.assertEqual(project_facts["trigger_above_average"], False)

        result = kpi_above_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        generate_benchmarks(stub_benchmark_kpis)
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_above_average.graph(args)
        self.assertEqual(project_facts["var_above_average_kpi"], None)
        self.assertEqual(project_facts["trigger_above_average"], False)

        result = kpi_above_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_benchmarks(self):
        self.generate_kpi()
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_above_average.graph(args)
        self.assertEqual(project_facts["var_above_average_kpi"], None)
        self.assertEqual(project_facts["trigger_above_average"], False)

        result = kpi_above_average.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi_and_benchmarks(self):
        args = {"start": self.start, "end": self.end, "project": self.project}
        project_facts = kpi_above_average.graph(args)
        self.assertEqual(project_facts["var_above_average_kpi"], None)
        self.assertEqual(project_facts["trigger_above_average"], False)

        result = kpi_above_average.evaluate(project_facts)
        self.assertIsNone(result)


class KPIOffTrackMitigatedTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.start,
            period_params={
                "acq_demand_creation": decimal.Decimal("2350.0"),
                "lease_applications": 7,
                "tours": 2,
            },
        )
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_demand_creation": decimal.Decimal("2350.0"),
                "lease_applications": 7,
                "tours": 2,
            },
        )

        project_facts = kpi_off_track_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_off_track_mitigated"])
        self.assertEqual(project_facts["kpi_off_track_a"], "tours")
        self.assertEqual(project_facts["var_kpi_off_track_weeks"], 2)

        result = kpi_off_track_mitigated.evaluate(project_facts)
        expected_text = "While Volume of TOU is Off Track for 2 week(s), TOU > APP is exceeding performance target, resulting in On Track Volume of APP."
        self.assertEqual(result[0], "kpi_off_track_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_multiple_kpi(self):
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.start,
            period_params={
                "acq_demand_creation": decimal.Decimal("2350.0"),
                "lease_applications": 7,
                "tours": 2,
                "usvs": 350,
            },
        )
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_demand_creation": decimal.Decimal("2350.0"),
                "lease_applications": 7,
                "tours": 2,
                "usvs": 350,
            },
        )

        project_facts = kpi_off_track_mitigated.graph(self.args)

        self.assertTrue(project_facts["trigger_kpi_off_track_mitigated"])
        self.assertEqual(project_facts["kpi_off_track_a"], "tours")
        self.assertEqual(project_facts["var_kpi_off_track_weeks"], 2)

        result = kpi_off_track_mitigated.evaluate(project_facts)
        expected_text = "While Volume of TOU is Off Track for 2 week(s), TOU > APP is exceeding performance target, resulting in On Track Volume of APP."
        self.assertEqual(result[0], "kpi_off_track_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_no_kpi(self):
        project_facts = kpi_off_track_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_off_track_mitigated"])
        self.assertIsNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_off_track_weeks"], 0)
        self.assertIsNone(project_facts["kpi_off_track_a"])

        result = kpi_off_track_mitigated.evaluate(project_facts)
        self.assertIsNone(result)

    def test_not_triggered(self):
        create_periods(self.project, start=self.start, end=self.end)
        project_facts = kpi_off_track_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_off_track_mitigated"])
        self.assertIsNotNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_off_track_weeks"], 0)
        self.assertIsNone(project_facts["kpi_off_track_a"])

        result = kpi_off_track_mitigated.evaluate(project_facts)
        self.assertIsNone(result)


class KPIAtRiskMitigatedTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        create_periods(
            self.project, start=self.start - datetime.timedelta(weeks=1), end=self.start
        )
        create_periods(self.project, start=self.start, end=self.end)

        project_facts = kpi_at_risk_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_at_risk_mitigated"])
        self.assertEqual(project_facts["kpi_at_risk_a"], "usvs")
        self.assertEqual(project_facts["var_kpi_at_risk_weeks"], 2)

        result = kpi_at_risk_mitigated.evaluate(project_facts)
        expected_text = "While Volume of USV is At Risk for 2 week(s), USV > INQ is exceeding performance target, resulting in On Track Volume of INQ."
        self.assertEqual(result[0], "kpi_at_risk_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_multiple_kpi(self):
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.start,
            period_params={"lease_applications": 7, "tours": 10},
            target_period_params={},
        )
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"lease_applications": 7, "tours": 10},
        )

        project_facts = kpi_at_risk_mitigated.graph(self.args)

        self.assertTrue(project_facts["trigger_kpi_at_risk_mitigated"])
        self.assertEqual(project_facts["kpi_at_risk_a"], "tours")
        self.assertEqual(project_facts["var_kpi_at_risk_weeks"], 2)

        result = kpi_at_risk_mitigated.evaluate(project_facts)
        expected_text = "While Volume of TOU is At Risk for 2 week(s), TOU > APP is exceeding performance target, resulting in On Track Volume of APP."
        self.assertEqual(result[0], "kpi_at_risk_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_no_kpi(self):
        project_facts = kpi_at_risk_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_at_risk_mitigated"])
        self.assertIsNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_at_risk_weeks"], 0)
        self.assertIsNone(project_facts["kpi_at_risk_a"])

        result = kpi_at_risk_mitigated.evaluate(project_facts)
        self.assertIsNone(result)

    def test_not_triggered(self):
        create_periods(
            self.project, start=self.start, end=self.end, period_params={"usvs": 480}
        )
        project_facts = kpi_at_risk_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_at_risk_mitigated"])
        self.assertIsNotNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_at_risk_weeks"], 0)
        self.assertIsNone(project_facts["kpi_at_risk_a"])

        result = kpi_at_risk_mitigated.evaluate(project_facts)
        self.assertIsNone(result)


class KPIOffTrackNotMitigatedTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        period_params = {"inquiries": 30, "tours": 10}
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.start,
            period_params=period_params,
        )
        create_periods(
            self.project, start=self.start, end=self.end, period_params=period_params
        )

        project_facts = kpi_off_track_not_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_off_track_not_mitigated"])
        self.assertEqual(
            project_facts["var_kpi_off_track_not_mitigated"], "lease_applications"
        )
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated_weeks"], 2)

        result = kpi_off_track_not_mitigated.evaluate(project_facts)
        expected_text = "Volume of APP has been Off Track for 2 week(s)."
        self.assertEqual(result[0], "kpi_off_track_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_triggered_one_week(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={
                "acq_demand_creation": decimal.Decimal("2350.0"),
                "lease_applications": 7,
                "tours": 2,
            },
        )

        project_facts = kpi_off_track_not_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_off_track_not_mitigated"])
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated"], "inq_tou")
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated_weeks"], 1)

        result = kpi_off_track_not_mitigated.evaluate(project_facts)
        expected_text = "INQ > TOU has been Off Track for 1 week(s)."
        self.assertEqual(result[0], "kpi_off_track_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_multiple_kpi(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"inquiries": 30, "tours": 5},
        )

        project_facts = kpi_off_track_not_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_off_track_not_mitigated"])
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated"], "tours")
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated_weeks"], 1)

        result = kpi_off_track_not_mitigated.evaluate(project_facts)
        expected_text = "Volume of TOU has been Off Track for 1 week(s)."
        self.assertEqual(result[0], "kpi_off_track_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_no_kpi(self):
        project_facts = kpi_off_track_not_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_off_track_not_mitigated"])
        self.assertIsNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated_weeks"], 0)
        self.assertIsNone(project_facts["var_kpi_off_track_not_mitigated"])

        result = kpi_off_track_not_mitigated.evaluate(project_facts)
        self.assertIsNone(result)

    def test_not_triggered(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"lease_applications": 6},
        )
        project_facts = kpi_off_track_not_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_off_track_not_mitigated"])
        self.assertIsNotNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_off_track_not_mitigated_weeks"], 0)
        self.assertIsNone(project_facts["var_kpi_off_track_not_mitigated"])

        result = kpi_off_track_not_mitigated.evaluate(project_facts)
        self.assertIsNone(result)


class KPIAtRiskNotMitigatedTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        period_params = {"inquiries": 20, "tours": 12}
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.start,
            period_params=period_params,
        )
        create_periods(
            self.project, start=self.start, end=self.end, period_params=period_params
        )

        project_facts = kpi_at_risk_not_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_at_risk_not_mitigated"])
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated"], "tou_app")
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated_weeks"], 2)

        result = kpi_at_risk_not_mitigated.evaluate(project_facts)
        expected_text = "TOU > APP has been At Risk for 2 week(s)."
        self.assertEqual(result[0], "kpi_at_risk_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_triggered_one_week(self):
        create_periods(self.project, start=self.start, end=self.end)

        project_facts = kpi_at_risk_not_mitigated.graph(self.args)
        self.assertTrue(project_facts["trigger_kpi_at_risk_not_mitigated"])
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated"], "usvs")
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated_weeks"], 1)

        result = kpi_at_risk_not_mitigated.evaluate(project_facts)
        expected_text = "Volume of USV has been At Risk for 1 week(s)."
        self.assertEqual(result[0], "kpi_at_risk_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_multiple_kpi(self):
        create_periods(
            self.project,
            start=self.start,
            end=self.end,
            period_params={"inquiries": 20, "tours": 12},
        )

        project_facts = kpi_at_risk_not_mitigated.graph(self.args)

        self.assertTrue(project_facts["trigger_kpi_at_risk_not_mitigated"])
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated"], "tou_app")
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated_weeks"], 1)

        result = kpi_at_risk_not_mitigated.evaluate(project_facts)
        expected_text = "TOU > APP has been At Risk for 1 week(s)."
        self.assertEqual(result[0], "kpi_at_risk_not_mitigated")
        self.assertEqual(result[1], expected_text)

    def test_no_kpi(self):
        project_facts = kpi_at_risk_not_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_at_risk_not_mitigated"])
        self.assertIsNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated_weeks"], 0)
        self.assertIsNone(project_facts["var_kpi_at_risk_not_mitigated"])

        result = kpi_at_risk_not_mitigated.evaluate(project_facts)
        self.assertIsNone(result)

    def test_not_triggered(self):
        create_periods(
            self.project, start=self.start, end=self.end, period_params={"usvs": 480}
        )
        project_facts = kpi_at_risk_not_mitigated.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_at_risk_not_mitigated"])
        self.assertIsNotNone(project_facts["var_base_kpis"])
        self.assertEqual(project_facts["var_kpi_at_risk_not_mitigated_weeks"], 0)
        self.assertIsNone(project_facts["var_kpi_at_risk_not_mitigated"])

        result = kpi_at_risk_not_mitigated.evaluate(project_facts)
        self.assertIsNone(result)


class KPITrendChangeHealthTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        generate_weekly_periods(
            8, self.project, self.end, lambda i: {"usvs": 460 - i * 10}
        )

        project_facts = kpi_trend_change_health.graph(self.args)

        self.assertTrue(project_facts["trigger_kpi_trend_change_health"])
        expected = {
            "name": "usvs",
            "predicted_health": 2,
            "predicted_weeks": 2,
            "trend": "up",
            "weeks": 8,
        }
        self.assertDictEqual(project_facts["var_predicted_kpi"], expected)
        result = kpi_trend_change_health.evaluate(project_facts)
        expected_text = "Volume of USV has been trending up for 8 week(s); if it continues for 2 weeks, performance health is expected to change to On Track."
        self.assertEqual(result[0], "kpi_trend_change_health")
        self.assertEqual(result[1], expected_text)

    def test_triggered_one_week(self):
        create_periods(self.project, start=self.start, end=self.end)
        project_facts = kpi_trend_change_health.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_trend_change_health"])
        result = kpi_trend_change_health.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        project_facts = kpi_trend_change_health.graph(self.args)
        self.assertFalse(project_facts["trigger_kpi_trend_change_health"])
        result = kpi_trend_change_health.evaluate(project_facts)
        self.assertIsNone(result)


class USVsOnTrackTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.args = {"start": self.start, "end": self.end, "project": self.project}

    def test_triggered(self):
        generate_weekly_periods(3, self.project, self.end, lambda i: {"usvs": 480})
        project_facts = usvs_on_track.graph(self.args)
        self.assertTrue(project_facts["trigger_usvs_on_track"])

        result = usvs_on_track.evaluate(project_facts)
        expected_text = "Volume of USV has been On Track for 3 week(s)."
        self.assertEqual(result[0], "usvs_on_track")
        self.assertEqual(result[1], expected_text)

    def test_usvs_not_on_track(self):
        generate_weekly_periods(3, self.project, self.start, lambda i: {"usvs": 480})
        create_periods(self.project, self.start, self.end)

        project_facts = usvs_on_track.graph(self.args)
        self.assertFalse(project_facts["trigger_usvs_on_track"])

        result = usvs_on_track.evaluate(project_facts)
        self.assertIsNone(result)

    def test_no_kpi(self):
        project_facts = usvs_on_track.graph(self.args)
        self.assertFalse(project_facts["trigger_usvs_on_track"])

        result = usvs_on_track.evaluate(project_facts)
        self.assertIsNone(result)

    def test_not_triggered(self):
        create_periods(self.project, self.start, self.end)

        project_facts = usvs_on_track.graph(self.args)
        self.assertFalse(project_facts["trigger_usvs_on_track"])

        result = usvs_on_track.evaluate(project_facts)
        self.assertIsNone(result)
