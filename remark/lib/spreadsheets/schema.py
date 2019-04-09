from collections import namedtuple
from decimal import Decimal

import openpyxl

from remark.lib.math import d_quant_currency

from .errors import ExcelValidationError


class DataType:
    """An enumeration of possible Excel data types."""

    STRING = openpyxl.cell.cell.TYPE_STRING
    FORMULA = openpyxl.cell.cell.TYPE_FORMULA
    NUMERIC = openpyxl.cell.cell.TYPE_NUMERIC
    BOOL = openpyxl.cell.cell.TYPE_BOOL
    NULL = openpyxl.cell.cell.TYPE_NULL
    ERROR = openpyxl.cell.cell.TYPE_ERROR
    DATETIME = "d"  # This requires us to call is_date()


"""
A SchemaCell represents the expected schema for a given cell.

The cell is obtained by calling the getter(...) method. See locators.py.

The cell's expected excel data type is defined by data_type and must be
one of the DataType.* values.

The cell's python type converter is an arbitrary callable (including arbitrary
python types, like int/Decimal/etc) that indicates how the value should be
converted into a python-native type.
"""
SchemaCell = namedtuple("SchemaCell", ["getter", "data_type", "converter"])

"""
Convenience wrappers around SchemaCell for common pairings of 
excel data types and python data types.
"""


def StrCell(getter):
    """Return a cell that converts to a python string."""
    return SchemaCell(getter, DataType.STRING, str)


def NullStrCell(getter):
    """Return a cell that converts to an optional python string."""

    def str_or_null(value):
        return str(value) if str(value) else None

    return SchemaCell(getter, DataType.String, str_or_null)


def ChoiceCell(getter, choices):
    """Return a cell that converts to a predefined string, or raises."""

    def choice_or_fail(value):
        value = str(value) if str(value) else None
        if value not in choices:
            raise ExcelValidationError(
                message=f"Unexpected value '{value}' found; expected one of '{choices}'"
            )
        return value

    return SchemaCell(getter, DataType.STRING, choice_or_fail)


def NullChoiceCell(getter, choices):
    """Return a cell that converts to an optional predefined string, or raises."""

    def choice_or_null_or_fail(value):
        value = str(value) if str(value) else None
        if (value is not None) and (value not in choices):
            raise ExcelValidationError(
                message=f"Unexpected value '{value}' found; expected one of '{choices}'"
            )
        return value

    return SchemaCell(getter, DataType.String, choice_or_null_or_fail)


def IntCell(getter):
    """Return a cell that converts to a predefined string, or raises."""
    return SchemaCell(getter, DataType.NUMERIC, int)


def FloatCell(getter):
    """Return a cell that converts to a python float."""
    return SchemaCell(getter, DataType.NUMERIC, float)


def DecimalCell(getter):
    """Return a cell that converts to a python decimal."""
    return SchemaCell(getter, DataType.NUMERIC, Decimal)


def DateTimeCell(getter):
    """Return a cell that converts to a datetime.datetime instance."""

    # converter is no-op because openpyxl already provides a datetime.
    # CONSIDER whether we need to do timezone normalization, however.
    return SchemaCell(getter, DataType.DATETIME, lambda dt: dt)


def DateCell(getter):
    """Return a cell that converts to a datetime.date instance."""
    return SchemaCell(getter, DataType.DATETIME, lambda dt: dt.date())


def CurrencyCell(getter):
    """Return a cell that converts to a Decimal, quantized for currency."""
    return SchemaCell(getter, DataType.NUMERIC, lambda v: d_quant_currency(v))


# At some point I might expand this; for now, schemas are simply
# dictionaries with arbitrary keys associated with SchemaCell instances.
Schema = dict

