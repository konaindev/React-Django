from datetime import date
from unittest import TestCase

from .insights import Modifier, Insight, InsightManager


class InsightTestCase(TestCase):
    def setUp(self) -> None:
        modifier1 = Modifier(
            name="modifier 1",
            trigger=lambda *args: {},
            text_template=lambda *args: "template modifier 1",
        )
        modifier2 = Modifier(
            name="modifier 2",
            trigger=lambda *args: None,
            text_template=lambda *args: "template modifier 2",
        )
        modifier3 = Modifier(
            name="modifier 3",
            trigger=lambda *args: {},
            text_template=lambda *args: "template modifier 3",
        )

        self.insight1 = Insight(
            name="Insight 1",
            trigger=lambda *args: None,
            text_template=lambda *args: "template insight 1",
            priority=1,
        )
        self.insight2 = Insight(
            name="Insight 2",
            trigger=lambda *args: {},
            text_template=lambda *args: "template insight 2",
            priority=2,
            modifiers=[modifier1, modifier2, modifier3],
        )
        self.insight3 = Insight(
            name="Insight 3",
            trigger=lambda *args: {},
            text_template=lambda *args: "template insight 3",
            priority=3,
            modifiers=[modifier1, modifier2, modifier3],
        )
        self.insight4 = Insight(
            name="Insight 4",
            trigger=lambda *args: {},
            text_template=lambda *args: "template insight 4",
            priority=1,
            modifiers=[modifier1, modifier2, modifier3],
        )

    def test_insight_manager(self):
        manager = InsightManager(
            [self.insight2, self.insight1, self.insight3, self.insight4]
        )
        result = manager.evaluate(
            "projects_id", start=date(2019, 10, 28), end=date(2019, 11, 3)
        )
        expected = [
            ("Insight 4", "template modifier 1"),
            ("Insight 2", "template modifier 3"),
            ("Insight 3", "template insight 3"),
        ]
        self.assertCountEqual(result, expected)

    def test_insight_manager_one_insight(self):
        manager = InsightManager([self.insight1])
        result = manager.evaluate(
            "projects_id", start=date(2019, 10, 28), end=date(2019, 11, 3)
        )
        expected = []
        self.assertCountEqual(result, expected)
