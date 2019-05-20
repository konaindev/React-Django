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

The cell's coordinates are obtained by calling the locator(...) method.
See locators.py.

The cell's expected excel data type is defined by data_type and must be
one of the DataType.* values, or a callable that takes an openpyxl cell
and determines whether it's valid.

The cell's python type converter is an arbitrary callable (including arbitrary
python types, like int/Decimal/etc) that indicates how the value should be
converted into a python-native type.

CONSIDER: I originally broke this idea into two pieces:

(1) the locator
(2) type information: a combination of the data_type [which is about Excel's type]
    and the converter [which is about Python's]

And, y'know, these two things really *are* unrelated ideas. It just turns out it
seems pretty natural to tie the two together in a tuple; it makes schema
declarations in importers more compact and, I think, more readable.

Then again, maybe it's silly, and confusing to other devs, and we should separate
these two things back out -- you decide. :-) -Dave
"""
SchemaCell = namedtuple("SchemaCell", ["locator", "data_type", "converter"])

class SchemaCell:
    def __init__(self, locator, data_type, converter, label=None):
        self.locator = locator
        self.data_type = data_type
        self.converter = converter
        self.label = label


"""
Convenience wrappers around SchemaCell for common pairings of
excel data types and python data types.
"""


def StrCell(locator=None, label=None):
    """Return a cell that converts to a python string."""

    def str_or_convertible_data_type(cell):
        return cell.data_type in frozenset([DataType.STRING, DataType.NUMERIC])

    return SchemaCell(locator, str_or_convertible_data_type, str, label=label)


def NullStrDateCell(locator=None, label=None):
    """Return a cell that converts to an optional python string from a string or date."""

    def str_or_convertible_or_null_data_type(cell):
        return cell.data_type in frozenset(
            [DataType.STRING, DataType.NUMERIC, DataType.NULL, DataType.DATETIME]
        )

    def str_or_null_converter(value):
        if isinstance(value, str):
            # Convert empty strings to None
            result = str(value) if value else None
        else:
            # Convert non-None values to strings.
            result = str(value) if value is not None else None
        return result

    return SchemaCell(
        locator, str_or_convertible_or_null_data_type, str_or_null_converter,
        label=label
    )


def NullStrCell(locator=None, label=None):
    """Return a cell that converts to an optional python string."""

    def str_or_convertible_or_null_data_type(cell):
        return cell.data_type in frozenset(
            [DataType.STRING, DataType.NUMERIC, DataType.NULL]
        )

    def str_or_null_converter(value):
        if isinstance(value, str):
            # Convert empty strings to None
            result = str(value) if value else None
        else:
            # Convert non-None values to strings.
            result = str(value) if value is not None else None
        return result

    return SchemaCell(
        locator, str_or_convertible_or_null_data_type, str_or_null_converter,
        label=None
    )


def ChoiceCell(locator=None, choices=None, label=None):
    """Return a cell that converts to a predefined string, or raises."""
    choices = choices or []

    def choice_or_fail_converter(value):
        value = str(value) if value else None
        if value not in choices:
            raise ExcelValidationError(
                f"Unexpected value '{value}' found; expected one of '{choices}'"
            )
        return value

    return SchemaCell(locator, DataType.STRING, choice_or_fail_converter, label=None)


def NullChoiceCell(locator=None, choices=None, label=None):
    """Return a cell that converts to an optional predefined string, or raises."""
    choices = choices or []

    def str_or_null_data_type(cell):
        return cell.data_type in frozenset([DataType.STRING, DataType.NULL])

    def choice_or_null_or_fail_converter(value):
        value = str(value) if value else None
        if (value is not None) and (value not in choices):
            raise ExcelValidationError(
                f"Unexpected value '{value}' found; expected one of '{choices}'"
            )
        return value

    return SchemaCell(locator, str_or_null_data_type, choice_or_null_or_fail_converter, label=None)


def IntCell(locator=None, label=None):
    """Return a cell that converts to a python int, or raises."""
    return SchemaCell(locator, DataType.NUMERIC, int)


def DefaultIntCell(locator=None, default=0):
    """Return a cell that converts to a python int; if the cell is empty, return default."""

    def int_or_null_data_type(cell):
        return cell.data_type in frozenset([DataType.NUMERIC, DataType.NULL])

    def int_or_default_or_fail_converter(value):
        return int(value) if value is not None else default

    return SchemaCell(locator, int_or_null_data_type, int_or_default_or_fail_converter, label=None)


def FloatCell(locator=None, label=None):
    """Return a cell that converts to a python float."""
    return SchemaCell(locator, DataType.NUMERIC, float, label=None)


def DefaultFloatCell(locator=None, default=0.0, label=None):
    """Return a cell that converts to a python float; if the cell is empty, return default."""

    def float_or_null_data_type(cell):
        return cell.data_type in frozenset([DataType.NUMERIC, DataType.NULL])

    def float_or_default_or_fail_converter(value):
        return float(value) if value is not None else default

    return SchemaCell(
        locator, float_or_null_data_type, float_or_default_or_fail_converter, label=None
    )


def DecimalCell(locator=None, label=None):
    """Return a cell that converts to a python decimal."""
    return SchemaCell(locator, DataType.NUMERIC, Decimal, label=None)


def DefaultDecimalCell(locator=None, default=Decimal(0), label=None):
    """Return a cell that converts to a python Decimal; if the cell is empty, return default."""

    def decimal_or_null_data_type(cell):
        return cell.data_type in frozenset([DataType.NUMERIC, DataType.NULL])

    def decimal_or_default_or_fail_converter(value):
        return Decimal(value) if value is not None else default

    return SchemaCell(
        locator, decimal_or_null_data_type, decimal_or_default_or_fail_converter, label=None
    )


def DateTimeCell(locator=None, label=None):
    """Return a cell that converts to a datetime.datetime instance."""

    # converter is no-op because openpyxl already provides a datetime.
    # CONSIDER whether we need to do timezone normalization, however.
    return SchemaCell(locator, DataType.DATETIME, lambda dt: dt, label=None)


def DateCell(locator=None, label=None):
    """Return a cell that converts to a datetime.date instance."""
    return SchemaCell(locator, DataType.DATETIME, lambda dt: dt.date(), label=None)


def CurrencyCell(locator=None, label=None):
    """Return a cell that converts to a Decimal, quantized for currency."""
    return SchemaCell(locator, DataType.NUMERIC, lambda v: d_quant_currency(v), label=None)


def DefaultCurrencyCell(locator=None, default=Decimal("0"), label=None):
    """Return a cell that converts to a Decimal, quantized for currency, or default."""

    def currency_or_null_data_type(cell):
        return cell.data_type in frozenset([DataType.NUMERIC, DataType.NULL])

    def currency_or_default_or_fail_converter(value):
        return (
            d_quant_currency(value) if value is not None else d_quant_currency(default)
        )

    return SchemaCell(
        locator, currency_or_null_data_type, currency_or_default_or_fail_converter, label=None
    )

    return SchemaCell(locator, DataType.NUMERIC, lambda v: d_quant_currency(v))


def unflatten_dict(flat):
    """
    Convert a flat dictionary into a nested dictionary by treating any key that
    contains a '.' as a nested path name.

    For instance {"a": 1, "b.c": 2, "b.d": 3} --> {"a": 1, "b": {"c": 2, "d": 3}}

    This is useful when building complex nested schemas.
    """
    unflat = {}

    for k, v in flat.items():
        path = unflat
        keys = k.split(".")
        for part in keys[:-1]:
            path = path.setdefault(part, {})
        path[keys[-1]] = v

    return unflat


def is_schema_cell(obj):
    """Return True if this is a schema cell."""
    return isinstance(obj, SchemaCell)
