"""
Simple utilities for working with rows and columns.
"""


def row_range(start_row, end_row):
    """Return an iterable of rows; both start and end are inclusive."""
    return range(start_row, end_row + 1)


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


def next_col(col):
    """Given a column name, determine the next column name."""
    return col_for_index(index_for_col(col) + 1)


def col_range(start_col, end_col):
    """Return an iterable of cols; both start and end are inclusive."""
    return (
        col_for_index(i)
        for i in range(index_for_col(start_col), index_for_col(end_col) + 1)
    )
