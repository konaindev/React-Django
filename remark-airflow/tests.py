from datetime import date
from unittest import TestCase, mock

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

    def test_produces_template(self):
        trigger = lambda project_id, start, end: {
            "project_id": project_id,
            "start": start,
            "end": end,
        }
        text_template = (
            lambda data: f"USV to INQ is above target"
            f" for Project {data['project_id']}"
            f" date: {data['start'].strftime('%Y-%m-%d')} - {data['end'].strftime('%Y-%m-%d')}"
        )
        insight = Insight(
            name="USV to INQ",
            trigger=trigger,
            text_template=text_template,
            priority=1,
            modifiers=[],
        )

        manager = InsightManager([insight])
        result = manager.evaluate(
            "pro_123456", start=date(2019, 10, 28), end=date(2019, 11, 3)
        )
        expected = [
            (
                "USV to INQ",
                "USV to INQ is above target for Project pro_123456 date: 2019-10-28 - 2019-11-03",
            )
        ]
        self.assertCountEqual(result, expected)

    def test_modifier_changing_result(self):
        modifier = Modifier(
            name="INQ Volume",
            trigger=lambda *args: {},
            text_template=lambda *args: "USV to INQ is above target. Expect INQ volumes to be Above target.",
        )
        insight = Insight(
            name="USV to INQ",
            trigger=lambda *args: {},
            text_template=lambda *args: "USV to INQ is above target",
            priority=1,
            modifiers=[modifier],
        )

        manager = InsightManager([insight])
        result = manager.evaluate(
            "projects_id", start=date(2019, 10, 28), end=date(2019, 11, 3)
        )
        expected = [
            (
                "USV to INQ",
                "USV to INQ is above target. Expect INQ volumes to be Above target.",
            )
        ]
        self.assertCountEqual(result, expected)

    def test_modifier_called_once(self):
        trigger_mock = mock.MagicMock(return_value={})
        modifier = Modifier(
            name="USV Volume",
            trigger=trigger_mock,
            text_template=lambda *args: "USV to INQ is above target. Expect USV volumes to be Above target.",
        )
        insight1 = Insight(
            name="USV to INQ",
            trigger=lambda *args: {},
            text_template=lambda *args: "USV to INQ is above target",
            priority=1,
            modifiers=[modifier],
        )
        insight2 = Insight(
            name="USV to EXE",
            trigger=lambda *args: {},
            text_template=lambda *args: "USV to EXE is above target",
            priority=2,
            modifiers=[modifier],
        )

        manager = InsightManager([insight1, insight2])
        result = manager.evaluate(
            "projects_id", start=date(2019, 10, 28), end=date(2019, 11, 3)
        )
        expected = [
            (
                "USV to INQ",
                "USV to INQ is above target. Expect USV volumes to be Above target.",
            ),
            (
                "USV to EXE",
                "USV to EXE is above target"
            )
        ]
        trigger_mock.assert_called_once()
        self.assertCountEqual(result, expected)
