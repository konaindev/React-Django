"""
A library for reading data from, and writing data to, excel spreadsheets.
"""
# flake8: noqa

from .errors import (
    ExcelError,
    ExcelLocationError,
    ExcelProgrammingError,
    ExcelValidationError,
)
from .getset import get_cell, set_cell
from .importers import ExcelImporter
from .locators import BaseLocator, loc, find_col, find_row
from .parse import parse_location_or_default, parse_location, unparse_location
from .rowcol import (
    advance_col,
    advance_row,
    col_for_index,
    col_range,
    cols_until_empty,
    cols_until,
    cols_while_empty,
    cols_while,
    index_for_col,
    location_range_rect,
    location_range,
    next_col,
    next_row,
    prev_col,
    prev_row,
    row_range,
    rows_until_empty,
    rows_until,
    rows_while_empty,
    rows_while,
)
from .schema import (
    ChoiceCell,
    CurrencyCell,
    DataType,
    DateCell,
    DateTimeCell,
    DecimalCell,
    DefaultCurrencyCell,
    DefaultDecimalCell,
    DefaultFloatCell,
    DefaultIntCell,
    FloatCell,
    IntCell,
    NullChoiceCell,
    NullStrCell,
    NullStrDateCell,
    SchemaCell,
    StrCell,
    unflatten_dict,
)

