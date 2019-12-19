import datetime
from decimal import Decimal

from django.test import TestCase

from remark.factories.periods import create_periods
from remark.factories.projects import create_project
from remark_airflow.insights.framework.core import Insight
from .projects import get_project_facts, get_project_insights


class GetProjectFactsTestCase(TestCase):
    def setUp(self):
        start = datetime.date(year=2019, month=12, day=2)
        end = datetime.date(year=2019, month=12, day=9)
        project = create_project()
        create_periods(
            project,
            start=datetime.date(year=2019, month=11, day=25),
            end=datetime.date(year=2019, month=12, day=2),
            period_params={
                "leased_units_end": 109,
                "occupiable_units_start": 200,
                "leases_executed": 4,
                "usvs": 414,
            },
            target_period_params={
                "target_leased_rate": Decimal("0.940"),
                "target_leases_executed": 6,
                "target_usvs": 300,
            },
        )
        create_periods(
            project,
            start=start,
            end=end,
            period_params={
                "leased_units_end": 179,
                "occupiable_units_start": 200,
                "leases_executed": 4,
                "usvs": 400,
            },
            target_period_params={"target_leases_executed": 6, "target_usvs": 300},
        )
        self.project_id = project.public_id
        self.start = start
        self.end = end

    def test_get_project_facts(self):
        result = get_project_facts(self.project_id, self.start, self.end)
        expected = {
            "trigger_campaign_health_status_off_track": True,
            "trigger_health_status_is_changed": True,
            "trigger_is_active_campaign": True,
            "var_campaign_health_status": 2,
            "var_current_period_leased_rate": 0.895,
            "var_prev_health_status": 0,
            "var_target_leased_rate": Decimal("0.940"),
            "var_usv_exe": 0.01,
            "var_target_usv_exe": 0.02,
            "var_usv_exe_health_status": 0,
            "trigger_usv_exe_off_track": True,
            "var_weeks_usv_exe_off_track": 2,
            "var_kpi_usv_exe_off_track": "Volume of USV",
            "var_weeks_usv_exe_at_risk": 0,
            "var_kpi_usv_exe_at_risk": None,
            "trigger_usv_exe_at_risk": False,
        }
        self.maxDiff = None
        del result["var_base_kpis"]
        del result["var_base_targets"]
        del result["var_computed_kpis"]
        del result["var_target_computed_kpis"]
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
