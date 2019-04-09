from django.test import TestCase


from .rowcol import (
    col_for_index,
    col_range,
    cols_until_empty,
    cols_until,
    cols_while_empty,
    cols_while,
    index_for_col,
    next_col,
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
    def tets_next_col(self):
        self.assertEqual(next_col("A"), "B")
        self.assertEqual(next_col("Z"), "AA")
        self.assertEqual(next_col("AA"), "AB")
        self.assertEqual(next_col("AZ"), "BA")


class RangesTestCase(TestCase):
    def test_col_range(self):
        cols = col_range("B", "G")
        self.assertEqual(list(cols), ["B", "C", "D", "E", "F", "G"])

    def test_row_range(self):
        rows = row_range(1, 5)
        self.assertEqual(list(rows), [1, 2, 3, 4, 5])


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
