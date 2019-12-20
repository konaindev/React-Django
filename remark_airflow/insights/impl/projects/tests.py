import datetime

from django.test import TestCase
from graphkit import operation

from remark.factories.projects import create_project
from remark_airflow.insights.framework.core import Insight
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
