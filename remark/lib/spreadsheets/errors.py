from .parse import unparse_location

import openpyxl


class ExcelError(Exception):
    """Generic error for all code in this library."""

    def __init__(self, message, where=None):
        """
        Construct an ExcelError. For convenience, `where` may be one of:

        1. An arbitrary string
        2. A tuple of (sheet, col, row)
        3. An openpyxl Cell
        """
        if isinstance(where, openpyxl.cell.cell.Cell):
            where = unparse_location(where.parent.title, where.column_letter, where.row)
        elif isinstance(where, tuple):
            where = unparse_location(*where)

        message = f"{where} :: {message}" if where else message
        super().__init__(message)


class ExcelLocationError(ExcelError):
    """An exception for when we failed to locate a cell successfully."""

    pass


class ExcelProgrammingError(ExcelError):
    """An exception for when we made a mistake in our code, which mistake is caught at runtime."""

    pass


class ExcelValidationError(ExcelError):
    """An exception for when there's a data validation issue in an excel spreadsheet."""

    pass

