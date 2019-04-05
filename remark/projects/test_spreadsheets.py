from decimal import Decimal
import datetime
import os.path

from django.test import TestCase

from .spreadsheets import (
    parse_location,
    row_range,
    col_range,
    index_for_col,
    col_for_index,
    next_col,
    BaselinePerfImporter,
    RemarkablyExcelImporter,
)


class ParseLocationTestCase(TestCase):
    def test_empty_string(self):
        parsed = parse_location("")
        self.assertEqual(parsed, (None, None, None))

    def test_sheet_only(self):
        parsed = parse_location("sheet!")
        self.assertEqual(parsed, ("sheet", None, None))

    def test_col_only(self):
        parsed = parse_location("c")
        self.assertEqual(parsed, (None, "C", None))

    def test_row_only(self):
        parsed = parse_location("22")
        self.assertEqual(parsed, (None, None, 22))

    def test_all(self):
        parsed = parse_location("sheet!AZ42")
        self.assertEqual(parsed, ("sheet", "AZ", 42))

    def test_quoted_sheet(self):
        parsed = parse_location("'output sheet'!BB7")
        self.assertEqual(parsed, ("output sheet", "BB", 7))


class RangeTestCase(TestCase):
    def test_index_for_col(self):
        self.assertEqual(index_for_col("A"), 1)
        self.assertEqual(index_for_col("Z"), 26)
        self.assertEqual(index_for_col("AA"), 27)
        self.assertEqual(index_for_col("AZ"), 52)

    def test_col_for_index(self):
        self.assertEqual(col_for_index(1), "A")
        self.assertEqual(col_for_index(26), "Z")
        self.assertEqual(col_for_index(27), "AA")
        self.assertEqual(col_for_index(52), "AZ")

    def tets_next_col(self):
        self.assertEqual(next_col("A"), "B")
        self.assertEqual(next_col("Z"), "AA")
        self.assertEqual(next_col("AA"), "AB")
        self.assertEqual(next_col("AZ"), "BA")

    def test_col_range(self):
        cols = col_range("B", "G")
        self.assertEqual(list(cols), ["B", "C", "D", "E", "F", "G"])

    def test_row_range(self):
        rows = row_range(1, 5)
        self.assertEqual(list(rows), [1, 2, 3, 4, 5])


# class LocTestCase(TestCase):
#     def test_empty(self):
#         loc = _loc()
#         self.assertEqual(loc.sheet, None)
#         self.assertEqual(loc.col, None)
#         self.assertEqual(loc.row, None)
#         self.assertEqual(loc.dt, None)

#     def test_parsed(self):
#         loc = _loc("example!A9")
#         self.assertEqual(loc.sheet, "example")
#         self.assertEqual(loc.col, "A")
#         self.assertEqual(loc.row, 9)
#         self.assertEqual(loc.dt, None)

#     def test_derived(self):
#         base_loc = _loc("example!A9", dt="foo")
#         loc = _loc("whatever!2", loc=base_loc)
#         self.assertEqual(loc.sheet, "whatever")
#         self.assertEqual(loc.col, "A")
#         self.assertEqual(loc.row, 2)
#         self.assertEqual(loc.dt, "foo")

#     def test_explicit(self):
#         loc = _loc(sheet="whatever", col="C", row=2, dt="yomamaha")
#         self.assertEqual(loc.sheet, "whatever")
#         self.assertEqual(loc.col, "C")
#         self.assertEqual(loc.row, 2)
#         self.assertEqual(loc.dt, "yomamaha")


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
        """
        An integration test that ensures that both our checked-in
        example baseline/perf spreadsheet *and* our importer are in
        agreement. If they aren't... boom!
        """
        importer = BaselinePerfImporter(self.TEST_FILE_NAME)
        if not importer.is_valid():
            raise importer.errors[0]

        self.assertEqual(
            importer.cleaned_data["baseline_start_date"],
            datetime.date(year=2018, month=8, day=1),
        )
        self.assertEqual(
            importer.cleaned_data["baseline_end_date"],
            datetime.date(year=2019, month=3, day=1),
        )
        self.assertEqual(len(importer.cleaned_data["periods"]), 9)
        self.assertEqual(
            importer.cleaned_data["periods"][-1]["start"],
            datetime.date(year=2019, month=3, day=8),
        )
        self.assertEqual(
            importer.cleaned_data["periods"][-1]["end"],
            datetime.date(year=2019, month=3, day=15),
        )
        self.assertEqual(importer.cleaned_data["periods"][1]["inquiries"], 73)
        self.assertEqual(
            importer.cleaned_data["periods"][2]["acq_demand_creation"],
            Decimal("3628.56"),
        )

