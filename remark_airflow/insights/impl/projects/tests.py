import datetime
import decimal
from unittest.mock import patch, Mock

from django.test import TestCase

from remark.crm.models import Business
from remark.geo.models import Address
from remark.projects.models import (
    Project,
    Fund,
    TargetPeriod,
    Period,
    Property,
    LeaseStage,
)
from remark.users.models import Account
from .projects import get_project_facts, get_project_insights

mock_project_fact_generators = (
    Mock(__name__="trigger_is_active_campaign", return_value=True),
    Mock(__name__="trigger_campaign_health_status_off_track", return_value=True),
    Mock(__name__="var_current_period_leased_rate", return_value=0.89),
    Mock(__name__="var_target_leased_rate", return_value=0.94),
    Mock(__name__="var_campaign_health_status", return_value=2),
)


class LeaseRateAgainstModelTestCase(TestCase):
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

    def test_get_project_insights(self):
        project_facts = {
            "trigger_is_active_campaign": True,
            "trigger_campaign_health_status_off_track": True,
            "var_current_period_leased_rate": 0.89,
            "var_target_leased_rate": 0.94,
            "var_campaign_health_status": 2,
        }
        result = get_project_insights(project_facts)
        expected = {
            "lease_rate_against_target": f"Property is 0.89% Leased against period target of 0.94%, assessed as On Track."
        }
        self.assertEqual(result, expected)

    def test_get_project_insights_not_trigger(self):
        project_facts = {
            "trigger_is_active_campaign": False,
            "trigger_campaign_health_status_off_track": True,
            "var_current_period_leased_rate": 0.89,
            "var_target_leased_rate": 0.94,
            "var_campaign_health_status": 2,
        }
        result = get_project_insights(project_facts)
        expected = {}
        self.assertEqual(result, expected)
