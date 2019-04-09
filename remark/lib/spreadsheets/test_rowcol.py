from django.test import TestCase


from .rowcol import index_for_col, col_for_index, next_col, col_range, row_range


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
