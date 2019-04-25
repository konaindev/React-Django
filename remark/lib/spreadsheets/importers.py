import openpyxl

from .errors import ExcelError
from .getset import get_cell
from .rowcol import col_range, row_range
from .parse import parse_location_or_default
from .schema import DataType, unflatten_dict, is_schema_cell


class ExcelImporter:
    """
    Provides bare-bones tools for importing *any* of our data entry spreadsheets.
    """

    def __init__(self, f):
        """
        Create an importer with a fileobj or with the path to an extant file.
        """
        # Do *not* use read_only=True because this forces openpyxl into a mode
        # where *every* sheet/cell access results in re-parsing the XML. That's...
        # insane, and a sign that openpyxl is problematic. -Dave
        #
        # Example timing for one of our spreadsheets with read_only=True:
        #     imported full spreadsheet in 6.220s
        #
        # Example timing for that same spreadsheet without:
        #     imported full spreadsheet in 0.410s
        #
        # Insane!
        self.workbook = openpyxl.load_workbook(f, data_only=True)
        self.cleaned_data = {}
        self.errors = []

    def check_data_type(self, cell, data_type):
        """Raise an exception if cell's data type doesn't match provided data_type."""
        # If we have no expectations, we're always happy
        if callable(data_type):
            valid = data_type(cell)
        elif data_type == DataType.DATETIME:
            valid = cell.is_date
        else:
            valid = data_type == cell.data_type
        if not valid:
            raise ExcelValidationError(
                cell, f"found data type '{cell.data_type}' but expected '{data_type}'"
            )

    def check_convert(self, cell, converter=None):
        """
        Attempt to convert a cell's raw value to a python value.

        Raise an exception if the conversion fails. Otherwise, return
        the converted value.
        """
        # CONSIDER this is a pretty awkward API, I think?
        value = cell.value
        if converter is not None:
            try:
                value = converter(value)
            except Exception as e:
                raise ExcelValidationError(
                    cell, f"Could not apply value converter '{converter}': '{e}'"
                )
        return value

    def schema_cell(self, schema_item, location=None, sheet=None, col=None, row=None):
        """
        Given a schema item, return the cell at the underlying location.

        The location is determined first and foremost by the `location` provided
        here, and secondarily by the schema_item's `locator`.
        """
        sheet, col, row = parse_location_or_default(location, sheet, col, row)
        sheet, col, row = schema_item.locator(self.workbook, sheet, col, row)
        return get_cell(self.workbook, sheet, col, row)

    def schema_value(self, schema_item, location=None, sheet=None, col=None, row=None):
        """
        Given a SchemaCell, return the python-converted value at the
        underlying location, validating it as necessary.
        """
        cell = self.schema_cell(schema_item, location, sheet, col, row)
        self.check_data_type(cell, schema_item.data_type)
        value = self.check_convert(cell, schema_item.converter)
        return value

    def check_schema_value(
        self, schema_item, location=None, sheet=None, col=None, row=None, expected=None
    ):
        """
        Raise an exception if the wrong value is found.

        `expected` can be an explicit value, or a callable; if a callable
        is provided, it is called with the converted value and must return
        True if the expectation is met.
        """
        cell = self.schema_cell(schema_item, location, sheet, col, row)
        self.check_data_type(cell, schema_item.data_type)
        value = self.check_convert(cell, schema_item.converter)
        value_matches = expected(value) if callable(expected) else expected == value
        if not value_matches:
            raise ExcelValidationError(
                cell, f"expected value '{expected}', found '{value}'"
            )

    def row(self, schema, location=None, sheet=None, row=None):
        """
        Return the structured contents of a given row, based on the provided
        schema definition.

        A schema definition is simply a dictionary mapping a key name to
        a SchemaCell, which provides a locator, an expcted data type, and
        a python type converter.
        """
        sheet, _, row = parse_location_or_default(location, sheet, None, row)
        return unflatten_dict(
            {
                key: self.schema_value(schema_item_or_value, sheet=sheet, row=row)
                if is_schema_cell(schema_item_or_value)
                else schema_item_or_value
                for key, schema_item_or_value in schema.items()
            }
        )

    def col(self, schema, location=None, sheet=None, col=None):
        """
        Return the structured contents of a given column, based on the
        provided schema definition.

        A schema definition is simply a dictionary mapping a key name to
        a SchemaCell, which provides a locator, an expcted data type, and
        a python type converter.
        """
        sheet, col, _ = parse_location_or_default(location, sheet, col, None)
        return unflatten_dict(
            {
                key: self.schema_value(schema_item_or_value, sheet=sheet, col=col)
                if is_schema_cell(schema_item_or_value)
                else schema_item_or_value
                for key, schema_item_or_value in schema.items()
            }
        )

    def row_table(
        self, schema, rows=None, start_row=None, end_row=None, location=None, sheet=None
    ):
        """
        Return an array of row dictionaries based on the schema.

        Rows can either be provided as an iterable (via `rows`) or with
        explicit values, via `start_row` and `end_row`.
        """
        sheet, _, _ = parse_location_or_default(location, sheet, None, None)
        rows = rows or row_range(start_row, end_row)
        return [self.row(schema, sheet=sheet, row=row) for row in rows]

    def col_table(
        self, schema, cols=None, start_col=None, end_col=None, location=None, sheet=None
    ):
        """
        Return an array of column dictionaries based on the schema.

        Columns can either be provided as an iterable (via `cols`) or with
        explicit values, via `start_col` and `end_col`.
        """
        sheet, _, _ = parse_location_or_default(location, sheet, None, None)
        cols = cols or col_range(start_col, end_col)
        return [self.col(schema, sheet=sheet, col=col) for col in cols]

    def row_array(
        self,
        schema_item,
        rows=None,
        start_row=None,
        end_row=None,
        location=None,
        sheet=None,
    ):
        """
        Return an array of row values based on the schema_item.

        Rows can either be provided as an iterable (via `rows`) or with
        explicit values, via `start_row` and `end_row`.
        """
        sheet, _, _ = parse_location_or_default(location, sheet, None, None)
        rows = rows or row_range(start_row, end_row)
        return [self.schema_value(schema_item, sheet=sheet, row=row) for row in rows]

    def col_array(
        self,
        schema_item,
        cols=None,
        start_col=None,
        end_col=None,
        location=None,
        sheet=None,
    ):
        """
        Return an array of column values based on the schema item.

        Columns can either be provided as an iterable (via `cols`) or with
        explicit values, via `start_col` and `end_col`.
        """
        sheet, _, _ = parse_location_or_default(location, sheet, None, None)
        cols = cols or col_range(start_col, end_col)
        return [self.schema_value(schema_item, sheet=sheet, col=col) for col in cols]

    def table_array(
        self,
        schema_item,
        cols=None,
        start_col=None,
        end_col=None,
        rows=None,
        start_row=None,
        end_row=None,
        location=None,
        sheet=None,
        row_major=True,
    ):
        """
        Return a 2D array of values based on the schema item.

        Rows and columns can either be provided as an iterable 
        (via `rows` and `cols`) or with explicit values: `start_*` and `end_*`.

        By default, we return a row-major array; this can be flipped.
        """
        sheet, _, _ = parse_location_or_default(location, sheet, None, None)
        rows = list(rows or row_range(start_row, end_row))
        cols = list(cols or col_range(start_col, end_col))
        outer = rows if row_major else cols
        inner = cols if row_major else rows
        table = []
        for outer_index in outer:
            table.append(
                [
                    self.schema_value(
                        schema_item,
                        sheet=sheet,
                        col=inner_index if row_major else outer_index,
                        row=outer_index if row_major else inner_index,
                    )
                    for inner_index in inner
                ]
            )
        return table

    def is_valid(self):
        """Validate the spreadsheet; return False if not possible."""
        try:
            self.clean()
        except ExcelError as e:
            self.errors.append(e)
        return len(self.errors) == 0

    def clean(self):
        """
        Validate the spreadsheet.

        Updates the underlying cleaned_data dictionary as appropriate.

        Adds ExcelValidationErrors to the errors list when encountering
        validation errors that do not impact the ability to further validate;
        raises ExcelValidationError when encountering a hard-stop validation
        error.
        """
        pass
