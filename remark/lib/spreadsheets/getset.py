"""
Simple utilities for getting and setting openpyxl cells
(and for complaining when we're doing the wrong thing).
"""

from .errors import ExcelProgrammingError


def get_cell(workbook, sheet, col, row):
    """
    Return an openpyxl Cell given a workbook instance,
    along with a *fully specified* sheet name, col, and row.

    Fail if any parameter is missing or if the sheet doesn't exist.
    """
    # Workbook must be supplied
    if workbook is None:
        raise ExcelProgrammingError(message="No workbook found")

    # Make sure a complete location is provided
    if (not sheet) or (not col) or (not row):
        raise ExcelProgrammingError((sheet, col, row), "incomplete location")

    # Make sure sheet exists
    if sheet not in workbook:
        raise ExcelProgrammingError((sheet, col, row), "invalid sheet")

    return workbook[sheet][f"{col}{row}"]


def set_cell(workbook, sheet, col, row, value):
    raise NotImplementedError("Not implemented, but it will be soon.")
