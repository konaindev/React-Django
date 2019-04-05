"""
Utilities for finding stuff in spreadsheets.

A 'getter' is a method that takes an openpyxl workbook instance, along
with the name of a sheet, column, and row. From that, it returns an
openpyxl Cell.

Getters are typically used in SchemaCells; see schema.py.

The `base_getter` implementation simply validates its inputs and returns a cell.

All other methods, including `loc`, `find_col`, and `find_row`, are higher-order
functions that *return* a getter. You can parameterize these in a number of ways
to provide highly dynamic functionality for obtaining data in a spreadsheet.
"""

from remark.lib.match import matchp

from .errors import ExcelProgrammingError, ExcelValidationError
from .parse import parse_location_or_default
from .rowcol import col_range, row_range


def base_getter(workbook, sheet, col, row):
    """
    Validate that workbook, sheet, col, and row are valid.

    If they're valid, return the openpyxl Cell at the given location.

    If they're not valid, raise an exception.
    """
    if workbook is None:
        raise ExcelProgrammingError(message="No workbook found")
    if (not sheet) or (not col) or (not row):
        raise ExcelProgrammingError((sheet, col, row), "incomplete location")
    if sheet not in workbook:
        raise ExcelValidationError(
            (sheet, col, row), f"'{sheet}' not found in workbook"
        )
    return workbook[sheet][f"{col}{row}"]


def loc(location=None, sheet=None, col=None, row=None):
    """
    Returns a cell getter function that is pre-populated with an arbitrary set
    of values.
    """
    d_sheet, d_col, d_row = parse_location_or_default(location, sheet, col, row)

    def getter(workbook, sheet, col, row):
        return base_getter(workbook, sheet or d_sheet, col or d_col, row or d_row)

    return getter


def find_col(header_row, predicate, start_col="A", end_col="ZZ"):
    """
    Returns a getter method that locates a cell by looking for the column
    that matches a given `predicate` in the provided `header_row`.

    As a convenience, if `predicate` is a string, a match method is created
    using an `icontains=predicate` query. That's the form of query you
    probably want most of the time.

    The `header_row` is scanned from `start_col` to `end_col`, which default
    to "reasonable" values.
    """
    if isinstance(predicate, str):
        predicate = matchp(icontains=predicate)

    # We only want to perform the search once, so we cache the found
    # column in the outer scope.
    cached_col = None

    def find(workbook, sheet):
        """Perform the actual search."""
        # Gin up a sequence of columns whose value in the header_row
        # satisfy the predicate
        seq = (
            col
            for col in col_range(start_col, end_col)
            if predicate(base_getter(workbook, sheet, col, header_row).value)
        )
        # Return the first item in the sequence, or None
        return next(seq, None)

    def getter(workbook, sheet, col, row):
        nonlocal cached_col
        if cached_col is None:
            cached_col = find(workbook, sheet)
        return base_getter(workbook, sheet, cached_col or col, row)

    return getter


def find_row(header_col, predicate, start_row=1, end_row=1000):
    """
    Returns a getter method that locates a cell by looking for the row
    that matches a given `predicate` in the provided `header_col`.

    As a convenience, if `predicate` is a string, a match method is created
    using an `icontains=predicate` query. That's the form of query you
    probably want most of the time.

    The `header_col` is scanned from `start_row` to `end_row`, which default
    to "reasonable" values.
    """
    if isinstance(predicate, str):
        predicate = matchp(icontains=predicate)

    # We only want to perform the search once, so we cache the found
    # row in the outer scope.
    cached_row = None

    def find(workbook, sheet):
        """Perform the actual search."""
        # Gin up a sequence of rows whose value in the header_col
        # satisfy the predicate
        seq = (
            row
            for row in row_range(start_row, end_row)
            if predicate(base_getter(workbook, sheet, header_col, row).value)
        )
        # Return the first item in the sequence, or None
        return next(seq, None)

    def getter(workbook, sheet, col, row):
        nonlocal cached_row
        if cached_row is None:
            cached_row = find(workbook, sheet)
        return base_getter(workbook, sheet, col, cached_row or row)

    return getter

