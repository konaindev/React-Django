"""
Simple utilities for working with rows and columns, and for identifying
ranges of rows and columns that meet certain criteria.
"""

from .errors import ExcelProgrammingError
from .getset import get_cell
from .parse import parse_location_or_default


def row_range(start_row, end_row):
    """Return an iterable of rows; both start and end are inclusive."""
    return range(start_row, end_row + 1)


def advance_row(increment):
    """Given a row index, return a partial that advances it by `increment` places."""

    def advance(row):
        result = row + increment
        if result <= 0:
            raise ExcelProgrammingError(
                f"Row `{row}` cannot be advanced by `{increment}`: out of bounds."
            )
        return result

    return advance


next_row = advance_row(1)
prev_row = advance_row(-1)


def index_for_col(col):
    """Given a column name, return an index for it; A = 1"""
    # This is simple base-26 arithmetic, only there's no 0 in the alphabet
    # We reverse the column name because the rightmost character is the 0's
    # place; the next rightmost is the 26's place, etc.
    return sum(((ord(c) - ord("A") + 1) * 26 ** i for i, c in enumerate(col[::-1])))


def col_for_index(index):
    """Given a column index with A = 1, return a name for it."""
    # This is base-10 to base-26 arithmetic, shifted by 1
    col = ""
    while index > 0:
        index, r = divmod(index - 1, 26)
        col = chr(ord("A") + r) + col
    return col


def advance_col(increment):
    """Given a column name, return a function that advances it by `increment` places."""

    def advance(col):
        index = index_for_col(col) + increment
        if index <= 0:
            raise ExcelProgrammingError(
                f"Column `{col}` cannot be advanced by `{increment}`: out of bounds."
            )
        return col_for_index(index)

    return advance


next_col = advance_col(1)
prev_col = advance_col(-1)


def col_range(start_col, end_col):
    """Return an iterable of cols; both start and end are inclusive."""
    return (
        col_for_index(i)
        for i in range(index_for_col(start_col), index_for_col(end_col) + 1)
    )


def location_range(
    start=None,
    end=None,
    sheet=None,
    start_col=None,
    start_row=None,
    end_col=None,
    end_row=None,
):
    """
    Return an iterable of (sheet, col, row) locations.

    The sequence must be along a single axis (a row or a column); for
    recangular ranges, see location_range_rect(...).
    """
    start_sheet, start_col, start_row = parse_location_or_default(
        start, sheet, start_col, start_row
    )
    end_sheet, end_col, end_row = parse_location_or_default(
        end, sheet, end_col, end_row
    )

    # Sanity check: you've got to stay in a single sheet
    if start_sheet != end_sheet:
        raise ExcelProgrammingError("location_range must reside on a single sheet!")

    # Sanity check: you've got to start somewhere.
    if start_col is None and start_row is None:
        raise ExcelProgrammingError("location_range must start and end somewhere!")

    # Sanity check: this has to be a non-rectangular range.
    if start_col != end_col and start_row != end_row:
        raise ExcelProgrammingError(
            "location_range must not be rectangular; use location_range_rect instead."
        )

    result = None
    sheet = start_sheet

    # Row-only iteration
    if start_col == end_col:
        col = start_col
        result = ((sheet, col, row) for row in row_range(start_row, end_row))

    # Column-only iteration
    elif start_row == end_row:
        # This is col-only
        row = start_row
        result = ((sheet, col, row) for col in col_range(start_col, end_col))

    assert result is not None, "one of the two cases must always be possible"

    return result


def location_range_rect(
    start=None,
    end=None,
    sheet=None,
    start_col=None,
    start_row=None,
    end_col=None,
    end_row=None,
    row_major=True,
):
    """
    Return an iterable that contains iterables of (sheet, col, row) locations.

    The sequence must be rectangular.
    """
    start_sheet, start_col, start_row = parse_location_or_default(
        start, sheet, start_col, start_row
    )
    end_sheet, end_col, end_row = parse_location_or_default(
        end, sheet, end_col, end_row
    )

    # Sanity check: you've got to stay in a single sheet
    if start_sheet != end_sheet:
        raise ExcelProgrammingError(
            "location_range_rect must reside on a single sheet!"
        )

    # Sanity check: you've got to start somewhere.
    if start_col is None and start_row is None:
        raise ExcelProgrammingError("location_range_rect must start and end somewhere!")

    # Sanity check: this has to be a rectangular range.
    if start_col == end_col or start_row == end_row:
        raise ExcelProgrammingError(
            "location_range_rect must be rectangular; use location_range instead."
        )

    sheet = start_sheet

    if row_major:
        result = (
            ((sheet, col, row) for col in col_range(start_col, end_col))
            for row in row_range(start_row, end_row)
        )
    else:
        result = (
            ((sheet, col, row) for row in row_range(start_row, end_row))
            for col in col_range(start_col, end_col)
        )

    return result


def _is_empty(value):
    """Return True if a cell's value is 'empty'; intentionally *loose* definition."""
    return (value is None) or (isinstance(value, str) and not bool(value))


def rows_until(
    workbook,
    predicate,
    start_row,
    test_location=None,
    test_sheet=None,
    test_col=None,
    next_fn=next_row,
):
    """
    Return an iterable of row numbers, starting with start_row, and ending as 
    soon as a `predicate` about some column in the current row is True.

    This is particularly useful both when calling the various Importer.*_table(...)
    methods and when parameterizing the more complex locators.
    """
    test_sheet, test_col, _ = parse_location_or_default(
        test_location, test_sheet, test_col, None
    )
    if test_sheet is None:
        raise ExcelProgrammingError(
            "test location provided to rows_until() must contain a sheet!"
        )
    if test_col is None:
        raise ExcelProgrammingError(
            "test location provided to rows_until() must contain a column!"
        )

    def p(row):
        return predicate(get_cell(workbook, test_sheet, test_col, row).value)

    row = start_row
    done = p(row)
    while not done:
        yield row
        row = next_fn(row)
        done = p(row)


def rows_while(
    workbook,
    predicate,
    start_row,
    test_location=None,
    test_sheet=None,
    test_col=None,
    next_fn=next_row,
):
    """
    Return an iterable row numbers, starting with start_row, and ending
    as soon as a `predicate` about some column in the current row is False.

    This is the inverse of rows_until. We simply invert the `predicate`.
    """
    return rows_until(
        workbook,
        lambda v: not predicate(v),
        start_row,
        test_location,
        test_sheet,
        test_col,
        next_fn,
    )


def rows_until_empty(
    workbook,
    start_row,
    test_location=None,
    test_sheet=None,
    test_col=None,
    next_fn=next_row,
):
    """
    Return an iterable of row numbers, starting with start_row, and ending
    as soon as the provided column is empty on the current row.
    """
    return rows_until(
        workbook, _is_empty, start_row, test_location, test_sheet, test_col, next_fn
    )


def rows_while_empty(
    workbook,
    start_row,
    test_location=None,
    test_sheet=None,
    test_col=None,
    next_fn=next_row,
):
    return rows_while(
        workbook, _is_empty, start_row, test_location, test_sheet, test_col, next_fn
    )


def cols_until(
    workbook,
    predicate,
    start_col,
    test_location=None,
    test_sheet=None,
    test_row=None,
    next_fn=next_col,
):
    """
    Return an iterable of column names, starting with start_col, and ending
    as soon as a `predicate` about some row in the current column is True.

    This is particularly useful both when calling the various Importer.*_table(...)
    methods and when parameterizing the more complex locators.
    """
    test_sheet, _, test_row = parse_location_or_default(
        test_location, test_sheet, None, test_row
    )
    if test_sheet is None:
        raise ExcelProgrammingError(
            "test location provided to cols_until() must contain a sheet!"
        )
    if test_row is None:
        raise ExcelProgrammingError(
            "test location provided to cols_until() must contain a row!"
        )

    def p(col):
        return predicate(get_cell(workbook, test_sheet, col, test_row).value)

    col = start_col
    done = p(col)
    while not done:
        yield col
        col = next_fn(col)
        done = p(col)


def cols_while(
    workbook,
    predicate,
    start_col,
    test_location=None,
    test_sheet=None,
    test_row=None,
    next_fn=next_col,
):
    """
    Return an iterable column names, starting with start_col, and ending
    as soon as a `predicate` about some row in the current column is False.

    This is the inverse of cols_until. We simply invert the `predicate`.
    """
    return cols_until(
        workbook,
        lambda v: not predicate(v),
        start_col,
        test_location,
        test_sheet,
        test_row,
        next_col,
    )


def cols_until_empty(
    workbook,
    start_col,
    test_location=None,
    test_sheet=None,
    test_row=None,
    next_fn=next_col,
):
    """
    Return an iterable of (sheet, col, row) locations, starting with start_col, and ending
    as soon as the provided column is empty on the current row.
    """
    return cols_until(
        workbook, _is_empty, start_col, test_location, test_sheet, test_row, next_fn
    )


def cols_while_empty(
    workbook,
    start_col,
    test_location=None,
    test_sheet=None,
    test_row=None,
    next_fn=next_col,
):
    return cols_while(
        workbook, _is_empty, start_col, test_location, test_sheet, test_row, next_fn
    )

