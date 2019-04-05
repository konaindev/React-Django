from django.test import TestCase

from .errors import ExcelError
from .getters import base_getter


class BaseGetterTestCase(TestCase):
    def test_no_workbook(self):
        with self.assertRaises(ExcelError):
            base_getter(None, None, None, None)

    def test_incomplete_location(self):
        with self.assertRaises(ExcelError):
            base_getter({}, None, None, None)

    def test_sheet_not_found(self):
        with self.assertRaises(ExcelError):
            base_getter({}, "not_found", "A", "7")

    def test_gets_value(self):
        workbook = {"sheet": {"A1": "hello"}}
        self.assertEqual(base_getter(workbook, "sheet", "A", 1), "hello")


class LocTestCase(TestCase):
    pass


class FindColTestCase(TestCase):
    pass


class FindRowTestCase(TestCase):
    pass
