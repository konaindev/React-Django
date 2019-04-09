from django.test import TestCase

from .errors import ExcelError
from .locators import BaseLocator, loc, find_col, find_row


class TestCell:
    def __init__(self, value):
        self.value = value


class BaseLocatorTestCase(TestCase):
    def setUp(self):
        super().setUp()
        self.locator = BaseLocator()

    def test_cell_no_workbook(self):
        with self.assertRaises(ExcelError):
            self.locator.cell(None, None, None, None)

    def test_cell_incomplete_location(self):
        with self.assertRaises(ExcelError):
            self.locator.cell({}, None, None, None)

    def test_cell_sheet_not_found(self):
        with self.assertRaises(ExcelError):
            self.locator.cell({}, "not_found", "A", "7")

    def test_gets_value(self):
        workbook = {"sheet": {"A1": "hello"}}
        self.assertEqual(self.locator.cell(workbook, "sheet", "A", 1), "hello")


class LocTestCase(TestCase):
    def test_default_location(self):
        locator = loc(location="A42")
        location = locator.locate({}, "test", None, None)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_sheet(self):
        locator = loc(sheet="test")
        location = locator.locate({}, None, "A", 42)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_col(self):
        locator = loc(col="A")
        location = locator.locate({}, "test", None, 42)
        self.assertEqual(location, ("test", "A", 42))

    def test_default_row(self):
        locator = loc(row=42)
        location = locator.locate({}, "test", "A", None)
        self.assertEqual(location, ("test", "A", 42))

    def test_defaults_only(self):
        locator = loc("wild!Z99")
        location = locator.locate({}, "test", "A", 42)
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
        location = locator.locate(workbook, "test", None, 42)
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
        location = locator.locate(workbook, "test", "ZZTOP", None)
        self.assertEqual(location, ("test", "ZZTOP", 3))

