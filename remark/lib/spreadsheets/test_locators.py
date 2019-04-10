from django.test import TestCase

from .locators import loc, find_col, find_row


class TestCell:
    def __init__(self, value):
        self.value = value


class LocTestCase(TestCase):
    def test_default_location(self):
        locator = loc("A42")
        location = locator({}, "test", None, None)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_sheet(self):
        locator = loc("test!")
        location = locator({}, None, "A", 42)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_col(self):
        locator = loc("A")
        location = locator({}, "test", None, 42)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_row(self):
        locator = loc(42)
        location = locator({}, "test", "A", None)
        self.assertEqual(location, ("test", "A", 42))

    def test_init_values_are_defaults_not_overrides(self):
        locator = loc("wild!Z99")
        location = locator({}, "test", "A", 42)
        self.assertEqual(location, ("test", "A", 42))


class FindColTestCase(TestCase):
    def test_correct_col(self):
        # Find the column in the header row whose cell contains the value "GOOD"
        locator = find_col(
            1, predicate=lambda v: v == "GOOD", start_col="A", end_col="D"
        )
        workbook = {
            "test": {
                "A1": TestCell("bad"),
                "B1": TestCell("wild"),
                "C1": TestCell("GOOD"),
                "D1": TestCell("cool"),
            }
        }
        location = locator(workbook, "test", None, 42)
        self.assertEqual(location, ("test", "C", 42))


class FindRowTestCase(TestCase):
    def test_correct_row(self):
        # Find the row in the header column whose cell contains the value "GOOD"
        locator = find_row("A", predicate=lambda v: v == "GOOD", start_row=1, end_row=4)
        workbook = {
            "test": {
                "A1": TestCell("bad"),
                "A2": TestCell("wild"),
                "A3": TestCell("GOOD"),
                "A4": TestCell("cool"),
            }
        }
        location = locator(workbook, "test", "ZZTOP", None)
        self.assertEqual(location, ("test", "ZZTOP", 3))

