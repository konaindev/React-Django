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
                message=f"Row `{row}` cannot be advanced by `{increment}`: out of bounds."
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
                message=f"Column `{col}` cannot be advanced by `{increment}`: out of bounds."
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


def _is_empty(value):
    """Return True if a cell's value is 'empty'; intentionally *loose* definition."""
    return (value is None) or (isinstance(value, str) and not bool(value))


def rows_until(
    workbook,
    predicate,
    start_row,
    location=None,
    sheet=None,
    col=None,
    next_fn=next_row,
):
    """
    Return an iterable of row numbers, starting with start_row, and ending
    as soon as a `predicate` about some column in the current row is True.

    This is particularly useful both when calling the various Importer.*_table(...)
    methods and when parameterizing the more complex locators.
    """
    sheet, col, _ = parse_location_or_default(location, sheet, col, None)
    if col is None:
        raise ExcelProgrammingError(
            message="Location provided to rows_until() must contain a column!"
        )

    def p(row):
        return predicate(get_cell(workbook, sheet, col, row).value)

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
    location=None,
    sheet=None,
    col=None,
    next_fn=next_row,
):
    """
    Return an iterable of row numbers, starting with start_row, and ending
    as soon as a `predicate` about some column in the current row is False.

    This is the inverse of rows_until. We simply invert the `predicate`.
    """
    return rows_until(
        workbook, lambda v: not predicate(v), start_row, location, sheet, col, next_fn
    )


def rows_until_empty(
    workbook, start_row, location=None, sheet=None, col=None, next_fn=next_row
):
    """
    Return an iterable of row numbers, starting with start_row, and ending
    as soon as the provided column is empty on the current row.
    """
    return rows_until(workbook, _is_empty, start_row, location, sheet, col, next_fn)


def rows_while_empty(
    workbook, start_row, location=None, sheet=None, col=None, next_fn=next_row
):
    return rows_while(workbook, _is_empty, start_row, location, sheet, col, next_fn)


def cols_until(
    workbook,
    predicate,
    start_col,
    location=None,
    sheet=None,
    row=None,
    next_fn=next_col,
):
    """
    Return an iterable of column names, starting with start_col, and ending
    as soon as a `predicate` about some row in the current column is True.

    This is particularly useful both when calling the various Importer.*_table(...)
    methods and when parameterizing the more complex locators.
    """
    sheet, _, row = parse_location_or_default(location, sheet, None, row)
    if row is None:
        raise ExcelProgrammingError(
            message="Location provided to cols_until() must contain a row!"
        )

    def p(col):
        return predicate(get_cell(workbook, sheet, col, row).value)

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
    location=None,
    sheet=None,
    row=None,
    next_fn=next_col,
):
    """
    Return an iterable of column names, starting with start_col, and ending
    as soon as a `predicate` about some row in the current column is False.

    This is the inverse of cols_until. We simply invert the `predicate`.
    """
    return cols_until(
        workbook, lambda v: not predicate(v), start_col, location, sheet, row, next_col
    )


def cols_until_empty(
    workbook, start_col, location=None, sheet=None, row=None, next_fn=next_col
):
    """
    Return an iterable of row numbers, starting with start_row, and ending
    as soon as the provided column is empty on the current row.
    """
    return cols_until(workbook, _is_empty, start_col, location, sheet, row, next_fn)


def cols_while_empty(
    workbook, start_col, location=None, sheet=None, row=None, next_fn=next_col
):
    return cols_while(workbook, _is_empty, start_col, location, sheet, row, next_fn)

