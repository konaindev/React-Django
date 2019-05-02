from django.test import TestCase


from .errors import ExcelError, ExcelProgrammingError
from .rowcol import (
    col_for_index,
    col_range,
    cols_until_empty,
    cols_until,
    cols_while_empty,
    cols_while,
    index_for_col,
    location_range,
    next_col,
    next_row,
    prev_col,
    prev_row,
    row_range,
    rows_until_empty,
    rows_until,
    rows_while_empty,
    rows_while,
)


class TestCell:
    def __init__(self, value):
        self.value = value


class IndexForColTestCase(TestCase):
    def test_index_for_col(self):
        self.assertEqual(index_for_col("A"), 1)
        self.assertEqual(index_for_col("Z"), 26)
        self.assertEqual(index_for_col("AA"), 27)
        self.assertEqual(index_for_col("AZ"), 52)


class ColForIndexTestCase(TestCase):
    def test_col_for_index(self):
        self.assertEqual(col_for_index(1), "A")
        self.assertEqual(col_for_index(26), "Z")
        self.assertEqual(col_for_index(27), "AA")
        self.assertEqual(col_for_index(52), "AZ")


class NextColTestCase(TestCase):
    def test_next_col(self):
        self.assertEqual(next_col("A"), "B")
        self.assertEqual(next_col("Z"), "AA")
        self.assertEqual(next_col("AA"), "AB")
        self.assertEqual(next_col("AZ"), "BA")


class PrevColTestCase(TestCase):
    def test_prev_col(self):
        self.assertEqual(prev_col("B"), "A")
        self.assertEqual(prev_col("AA"), "Z")
        self.assertEqual(prev_col("AB"), "AA")
        self.assertEqual(prev_col("BA"), "AZ")

    def test_prev_col_boundary(self):
        with self.assertRaises(ExcelError):
            prev_col("A")


class NextRowTestCase(TestCase):
    def test_next_row(self):
        # This is all very silly
        self.assertEqual(next_row(1), 2)
        self.assertEqual(next_row(26), 27)
        self.assertEqual(next_row(27), 28)
        self.assertEqual(next_row(52), 53)


class PrevRowTestCase(TestCase):
    def test_prev_row(self):
        # This is all very silly, too
        self.assertEqual(prev_row(2), 1)
        self.assertEqual(prev_row(27), 26)
        self.assertEqual(prev_row(28), 27)
        self.assertEqual(prev_row(53), 52)

    def test_prev_row_boundary(self):
        with self.assertRaises(ExcelError):
            prev_row(1)


class RangesTestCase(TestCase):
    def test_col_range(self):
        cols = col_range("B", "G")
        self.assertEqual(list(cols), ["B", "C", "D", "E", "F", "G"])

    def test_row_range(self):
        rows = row_range(1, 5)
        self.assertEqual(list(rows), [1, 2, 3, 4, 5])

    def test_location_range_col(self):
        locations = location_range("B", "D")
        self.assertEqual(
            list(locations), [(None, "B", None), (None, "C", None), (None, "D", None)]
        )

    def test_location_range_col_explicit(self):
        locations = location_range(start_col="B", end_col="D")
        self.assertEqual(
            list(locations), [(None, "B", None), (None, "C", None), (None, "D", None)]
        )

    def test_location_range_row(self):
        locations = location_range(1, 3)
        self.assertEqual(
            list(locations), [(None, None, 1), (None, None, 2), (None, None, 3)]
        )

    def test_location_range_row_explicit(self):
        locations = location_range(start_row=1, end_row=3)
        self.assertEqual(
            list(locations), [(None, None, 1), (None, None, 2), (None, None, 3)]
        )

    def test_location_range_rectangular(self):
        locations = location_range("foo!A1", "foo!C2")
        self.assertEqual(
            list(locations),
            [
                ("foo", "A", 1),
                ("foo", "B", 1),
                ("foo", "C", 1),
                ("foo", "A", 2),
                ("foo", "B", 2),
                ("foo", "C", 2),
            ],
        )

    def test_location_range_invalid_sheets(self):
        with self.assertRaises(ExcelProgrammingError):
            locations = location_range("foo!A", "bar!B")
            _ = list(locations)


class TestRowsUntilAndWhile(TestCase):
    def setUp(self):
        self.workbook = {
            "sheet": {
                "A1": TestCell("hello"),
                "A2": TestCell("goodbye"),
                "A3": TestCell("wacky"),
                "A4": TestCell("remarkably"),
                "B1": TestCell("something"),
                "B2": TestCell("something"),
                "B3": TestCell(""),
                "B4": TestCell(""),
                "B5": TestCell("hello"),
                "C1": TestCell("another_thing"),
                "C2": TestCell(None),
                "C3": TestCell(None),
                "C4": TestCell("hello_again"),
            }
        }

    def test_rows_until(self):
        rows = rows_until(self.workbook, lambda v: v == "remarkably", 1, "sheet!A")
        self.assertEqual(list(rows), [1, 2, 3])

    def test_rows_until_reverse(self):
        rows = rows_until(
            self.workbook, lambda v: v == "hello", 4, "sheet!A", next_fn=prev_row
        )
        self.assertEqual(list(rows), [4, 3, 2])

    def test_rows_until_nothing(self):
        rows = rows_until(self.workbook, lambda v: v == "hello", 1, "sheet!A")
        self.assertEqual(list(rows), [])

    def test_rows_until_empty_1(self):
        rows = rows_until_empty(self.workbook, 1, "sheet!B")
        self.assertEqual(list(rows), [1, 2])

    def test_rows_until_empty_2(self):
        rows = rows_until_empty(self.workbook, 1, "sheet!C")
        self.assertEqual(list(rows), [1])

    def test_rows_while(self):
        rows = rows_while(self.workbook, lambda v: v != "remarkably", 1, "sheet!A")
        self.assertEqual(list(rows), [1, 2, 3])

    def test_rows_while_nothing(self):
        rows = rows_while(self.workbook, lambda v: v != "hello", 1, "sheet!A")
        self.assertEqual(list(rows), [])

    def test_rows_while_empty_1(self):
        rows = rows_while_empty(self.workbook, 3, "sheet!B")
        self.assertEqual(list(rows), [3, 4])

    def test_rows_while_empty_2(self):
        rows = rows_while_empty(self.workbook, 2, "sheet!C")
        self.assertEqual(list(rows), [2, 3])


class TestColsUntilAndWhile(TestCase):
    def setUp(self):
        self.workbook = {
            "sheet": {
                "A1": TestCell("hello"),
                "B1": TestCell("goodbye"),
                "C1": TestCell("wacky"),
                "D1": TestCell("remarkably"),
                "A2": TestCell("something"),
                "B2": TestCell("something"),
                "C2": TestCell(""),
                "D2": TestCell(""),
                "E2": TestCell("hello"),
                "A3": TestCell("another_thing"),
                "B3": TestCell(None),
                "C3": TestCell(None),
                "D3": TestCell("hello_again"),
            }
        }

    def test_cols_until(self):
        cols = cols_until(self.workbook, lambda v: v == "remarkably", "A", "sheet!1")
        self.assertEqual(list(cols), ["A", "B", "C"])

    def test_cols_until_nothing(self):
        cols = cols_until(self.workbook, lambda v: v == "hello", "A", "sheet!1")
        self.assertEqual(list(cols), [])

    def test_cols_until_empty_1(self):
        cols = cols_until_empty(self.workbook, "A", "sheet!2")
        self.assertEqual(list(cols), ["A", "B"])

    def test_cols_until_empty_2(self):
        cols = cols_until_empty(self.workbook, "A", "sheet!3")
        self.assertEqual(list(cols), ["A"])

    def test_cols_while(self):
        cols = cols_while(self.workbook, lambda v: v != "remarkably", "A", "sheet!1")
        self.assertEqual(list(cols), ["A", "B", "C"])

    def test_cols_while_nothing(self):
        cols = cols_while(self.workbook, lambda v: v != "hello", "A", "sheet!1")
        self.assertEqual(list(cols), [])

    def test_cols_while_empty_1(self):
        cols = cols_while_empty(self.workbook, "C", "sheet!2")
        self.assertEqual(list(cols), ["C", "D"])

    def test_cols_while_empty_2(self):
        cols = cols_while_empty(self.workbook, "B", "sheet!3")
        self.assertEqual(list(cols), ["B", "C"])

