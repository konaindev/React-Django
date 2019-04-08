from django.test import TestCase

from .errors import ExcelError
from .locators import BaseLocator


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
    pass


class FindColTestCase(TestCase):
    pass


class FindRowTestCase(TestCase):
    pass
