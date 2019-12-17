from unittest.mock import patch, Mock

from django.test import TestCase

from remark_airflow.insights.framework.core import Insight
from .projects import get_project_facts, get_project_insights

mock_project_fact_generators = (
    Mock(__name__="trigger_is_active_campaign", return_value=True),
    Mock(__name__="trigger_campaign_health_status_off_track", return_value=True),
    Mock(__name__="var_current_period_leased_rate", return_value=0.89),
    Mock(__name__="var_target_leased_rate", return_value=0.94),
    Mock(__name__="var_campaign_health_status", return_value=2),
)


class GetProjectFactsTestCase(TestCase):
    def setUp(self):
        self.project = Mock()
        self.start = Mock()
        self.end = Mock()

    @patch(
        "remark_airflow.insights.impl.projects.projects.PROJECT_FACT_GENERATORS",
        mock_project_fact_generators,
    )
    def test_get_project_facts(self):
        result = get_project_facts(self.project, self.start, self.end)
        expected = {
            "trigger_is_active_campaign": True,
            "trigger_campaign_health_status_off_track": True,
            "var_current_period_leased_rate": 0.89,
            "var_target_leased_rate": 0.94,
            "var_campaign_health_status": 2,
        }
        self.assertEqual(result, expected)


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
            "change_health_status": "Campaign health has changed from Off Track to On Track during this period."
        }
        self.assertEqual(result, expected)

    def test_get_project_insights_not_trigger(self):
        project_facts = self.project_facts.copy()
        project_facts["trigger_is_active_campaign"] = False
        project_facts["trigger_health_status_is_changed"] = False
        result = get_project_insights(project_facts, self.project_insights)
        expected = {}
        self.assertEqual(result, expected)
