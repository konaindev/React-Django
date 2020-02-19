from unittest import TestCase

from .core import Insight


class InsightTestCase(TestCase):
    def setUp(self) -> None:
        self.template = (
            lambda data: "Campaign health has changed from %(prev_health_status)s "
            "to %(health_status)s during this period." % data
        )

    def test_insight(self):
        project_facts = {
            "health_status": "On Track",
            "prev_health_status": "At Risk",
            "health_has_changed": True,
        }
        insight = Insight(
            name="Change Health Status",
            template=self.template,
            triggers=["health_has_changed"],
        )
        result = insight.evaluate(project_facts)
        expected = (
            "Change Health Status",
            "Campaign health has changed from At Risk to On Track during this period.",
        )
        self.assertCountEqual(result, expected)

    def test_insight_not_trigger(self):
        project_facts = {
            "health_status": "On Track",
            "prev_health_status": "On Track",
            "health_has_changed": True,
            "second_condition": False,
        }
        insight = Insight(
            name="Change Health Status",
            template=self.template,
            triggers=["health_has_changed", "second_condition"],
        )
        result = insight.evaluate(project_facts)
        self.assertIsNone(result)

    def test_insight_template_is_str(self):
        project_facts = {
            "health_status": "On Track",
            "prev_health_status": "At Risk",
            "health_has_changed": True,
        }
        insight = Insight(
            name="Change Health Status",
            template="Campaign health has changed from At Risk to On Track during this period.",
            triggers=["health_has_changed"],
        )
        result = insight.evaluate(project_facts)
        expected = (
            "Change Health Status",
            "Campaign health has changed from At Risk to On Track during this period.",
        )
        self.assertCountEqual(result, expected)
