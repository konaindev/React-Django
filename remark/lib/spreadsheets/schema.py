from collections import namedtuple

import openpyxl


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


# At some point I might expand these; for now, schemas are simply
# dictionaries with arbitrary keys associated with SchemaCell instances.
SchemaRow = dict
SchemaCol = dict
Schema = dict
