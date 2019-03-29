import os.path

from django.test import TestCase

from .spreadsheets import (
    _parse_loc,
    _loc,
    BaselinePerfImporter,
    RemarkablyExcelImporter,
)


class ParseLocTestCase(TestCase):
    def test_empty_string(self):
        parsed = _parse_loc("")
        self.assertEqual(parsed, (None, None, None))

    def test_sheet_only(self):
        parsed = _parse_loc("sheet!")
        self.assertEqual(parsed, ("sheet", None, None))

    def test_col_only(self):
        parsed = _parse_loc("c")
        self.assertEqual(parsed, (None, "C", None))

    def test_row_only(self):
        parsed = _parse_loc("22")
        self.assertEqual(parsed, (None, None, 22))

    def test_all(self):
        parsed = _parse_loc("sheet!AZ42")
        self.assertEqual(parsed, ("sheet", "AZ", 42))

    def test_quoted_sheet(self):
        parsed = _parse_loc("'output sheet'!BB7")
        self.assertEqual(parsed, ("output sheet", "BB", 7))


class LocTestCase(TestCase):
    def test_empty(self):
        loc = _loc()
        self.assertEqual(loc.sheet, None)
        self.assertEqual(loc.col, None)
        self.assertEqual(loc.row, None)
        self.assertEqual(loc.dt, None)

    def test_parsed(self):
        loc = _loc("example!A9")
        self.assertEqual(loc.sheet, "example")
        self.assertEqual(loc.col, "A")
        self.assertEqual(loc.row, 9)
        self.assertEqual(loc.dt, None)

    def test_derived(self):
        base_loc = _loc("example!A9", dt="foo")
        loc = _loc("whatever!2", loc=base_loc)
        self.assertEqual(loc.sheet, "whatever")
        self.assertEqual(loc.col, "A")
        self.assertEqual(loc.row, 2)
        self.assertEqual(loc.dt, "foo")

    def test_explicit(self):
        loc = _loc(sheet="whatever", col="C", row=2, dt="yomamaha")
        self.assertEqual(loc.sheet, "whatever")
        self.assertEqual(loc.col, "C")
        self.assertEqual(loc.row, 2)
        self.assertEqual(loc.dt, "yomamaha")


class TestImporter(RemarkablyExcelImporter):
    pass


class TestVersionCheck(TestCase):
    TEST_FILE_NAME = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "../../xls/examples/elcortez-baseline-perf.xlsx",
    )

    def test_pass(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "baseline_perf"
        importer.expected_version = 1
        self.assertTrue(importer.is_valid())

    def test_fail(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "nope"
        importer.expected_version = 0
        self.assertFalse(importer.is_valid())
        self.assertEqual(len(importer.errors), 1)


class BaselinePerfTestCase(TestCase):
    TEST_FILE_NAME = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "../../xls/examples/elcortez-baseline-perf.xlsx",
    )

    def test_example_data(self):
        importer = BaselinePerfImporter(self.TEST_FILE_NAME)
        self.assertTrue(importer.is_valid())
