from django.test import TestCase

from .parse import parse_location, unparse_location, parse_location_or_default


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

    def test_tuple(self):
        parsed = parse_location(("already_parsed", "A", 99))
        self.assertEqual(parsed, ("already_parsed", "A", 99))


class ParseLocationOrDefaultTestCase(TestCase):
    def test_empty_string(self):
        parsed = parse_location_or_default("", "default", "ZZ", 333)
        self.assertEqual(parsed, ("default", "ZZ", 333))

    def test_sheet_only(self):
        parsed = parse_location_or_default("sheet!", "default", "ZZ", 333)
        self.assertEqual(parsed, ("sheet", "ZZ", 333))

    def test_col_only(self):
        parsed = parse_location_or_default("c", "default", "ZZ", 333)
        self.assertEqual(parsed, ("default", "C", 333))

    def test_row_only(self):
        parsed = parse_location_or_default("22", "default", "ZZ", 333)
        self.assertEqual(parsed, ("default", "ZZ", 22))

    def test_all(self):
        parsed = parse_location_or_default("sheet!AZ42", "default", "ZZ", 333)
        self.assertEqual(parsed, ("sheet", "AZ", 42))

    def test_quoted_sheet(self):
        parsed = parse_location_or_default("'output sheet'!BB7", "default", "ZZ", 333)
        self.assertEqual(parsed, ("output sheet", "BB", 7))

    def test_tuple(self):
        parsed = parse_location_or_default(
            ("already_parsed", None, 99), "default", "ZZ", 333
        )
        self.assertEqual(parsed, ("already_parsed", "ZZ", 99))


class UnparseLocationTestCase(TestCase):
    def test_simple(self):
        unparsed = unparse_location("sheet", "A", 7)
        self.assertEqual(unparsed, "'sheet'!A7")

    def test_no_sheet(self):
        unparsed = unparse_location(None, "A", 7)
        self.assertEqual(unparsed, "A7")

    def test_no_col(self):
        unparsed = unparse_location("sheet", None, 7)
        self.assertEqual(unparsed, "'sheet'!7")

    def test_no_row(self):
        unparsed = unparse_location("sheet", "C", None)
        self.assertEqual(unparsed, "'sheet'!C")

    def test_nothing(self):
        unparsed = unparse_location(None, None, None)
        self.assertEqual(unparsed, "")

    def test_round_trip_1(self):
        original = "'sheet name'!A1"
        self.assertEqual(original, unparse_location(*parse_location(original)))

    def test_round_trip_2(self):
        original = "'fun in the sun name'!AZQ17"
        self.assertEqual(original, unparse_location(*parse_location(original)))
