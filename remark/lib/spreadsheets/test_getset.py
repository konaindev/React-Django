from django.test import TestCase

from .errors import ExcelError
from .getset import get_cell


class GetCellTestCase(TestCase):
    def test_workbook_required(self):
        with self.assertRaises(ExcelError):
            get_cell(None, None, None, None)

    def test_sheet_required(self):
        with self.assertRaises(ExcelError):
            get_cell({}, None, "A", 1)

    def test_col_required(self):
        with self.assertRaises(ExcelError):
            get_cell({}, "sheet", None, 1)

    def test_row_required(self):
        with self.assertRaises(ExcelError):
            get_cell({}, "sheet", "A", None)

    def test_sheet_must_be_in_workbook(self):
        with self.assertRaises(ExcelError):
            get_cell({}, "sheet", "A", 1)

    def test_returns_cell(self):
        result = get_cell({"sheet": {"A1": "cell"}}, "sheet", "A", 1)
        self.assertEqual(result, "cell")

