from .parse import unparse_location

import openpyxl


class ExcelError(Exception):
    """Generic error for all code in this library."""

    def __init__(self, where=None, message=None):
        """
        Construct an ExcelError. For convenience, `where` may be one of:

        1. An arbitrary string
        2. A tuple of (sheet, col, row)
        3. An openpyxl Cell
        """
        if isinstance(where, openpyxl.cell.cell.Cell):
            where = unparse_location(where.parent.title, where.column_name, where.row)
        elif isinstance(where, tuple):
            where = unparse_location(*where)

        super().__init__(f"{where}:: {message}")


class ExcelValidationError(ExcelError):
    """An exception for when there's an error in the excel spreadsheet itself."""

    pass


class ExcelProgrammingError(ExcelError):
    """An exception for when we messed something up here in this code..."""

    pass
