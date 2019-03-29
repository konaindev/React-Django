"""
Utilities for validating and importing spreadsheet uploads.
"""
import re
from collections import namedtuple

import openpyxl


class DataType:
    STRING = openpyxl.cell.cell.TYPE_STRING
    FORMULA = openpyxl.cell.cell.TYPE_FORMULA
    NUMERIC = openpyxl.cell.cell.TYPE_NUMERIC
    BOOL = openpyxl.cell.cell.TYPE_BOOL
    NULL = openpyxl.cell.cell.TYPE_NULL
    ERROR = openpyxl.cell.cell.TYPE_ERROR
    DATE = "d"  # This requires us to call is_date()


class ExcelError(Exception):
    """Generic error for all code in this library."""

    def __init__(self, loc, message):
        super().__init__(f"'{loc}:: {message}")


class ExcelValidationError(ExcelError):
    """An exception for when there's an error in the excel spreadsheet itself."""

    pass


class ExcelProgrammingError(ExcelError):
    """An exception for when we messed something up here in this code..."""

    pass


_parse_re = re.compile("(?:'?([a-z 0-9_-]+)'?!)?([a-z]*)([0-9]*)", re.IGNORECASE)


def _parse_loc(loc_str):
    """
    Attempt to parse a location string. 
    
    Return a tuple of (sheet, col, row) from the parse, where one
    or more of those values could be None.

    Any of the following are valid strings:

        "sheetname!"
        "sheetname!C3"
        "'sheet name'!C3"
        "sheetname!C'
        "sheetname!3'
        "C3"
        "C"
        "3"
    """
    sheet, col, row = list(_parse_re.match(loc_str).groups())
    return (sheet or None, col.upper() if col else None, int(row) if row else None)


_baseloc = namedtuple("_baseloc", ["sheet", "col", "row", "dt"])


class _loc(_baseloc):
    """
    A _loc is a reference to a cell and (optional) expected data type. The reference
    can be partial, although eventually, when fetched, the location must be
    complete.
    """

    def __new__(cls, *args, sheet=None, col=None, row=None, dt=None, loc=None):
        """
        Construct a location tuple. For convenience, this is a very flexible
        constructor; the cost is that its implementation is a bit persnickety.

        You can construct a location with an argument, keyword arguments, or
        some combination thereof. If an argument is provided, it overrides 
        keyword values.

        The provided argument can be any that _parse_loc(...) supports.

        You can also construct a location 'on top' of a previously defined
        location (`loc`) in which case locally provided values override
        any values contained therein.
        """
        if len(args) == 1:
            _sheet, _col, _row = _parse_loc(args[0])
            sheet = _sheet or sheet
            col = _col or col
            row = _row or row

        if loc is not None:
            sheet = sheet or loc.sheet
            col = col or loc.col
            row = row or loc.row
            dt = dt or loc.dt

        return super().__new__(cls, sheet=sheet, col=col, row=row, dt=dt)

    def is_complete(self):
        return (
            (self.sheet is not None)
            and (self.col is not None)
            and (self.row is not None)
        )

    def __str__(self):
        return f"'{self.sheet}!{self.col}{self.row}"


class ExcelImporter:
    """
    Provides bare-bones tools for importing *any* of our data entry spreadsheets.
    """

    def __init__(self, f):
        """
        Create an importer with a fileobj or with the path to an extant file.
        """
        self.workbook = openpyxl.load_workbook(f, data_only=True, read_only=True)
        self.cleaned_data = {}
        self.errors = []

    def check_dt(self, loc, cell):
        """Raise an exception if cell's data type doesn't match expected `loc.dt`."""
        # If we have no expectations, we're always happy
        if loc.dt is not None:
            valid_date = loc.dt != DataType.DATE or cell.is_date
            valid_type = loc.dt == DataType.DATE or loc.dt == cell.data_type
            valid = valid_date and valid_type
            if not valid:
                raise ExcelValidationError(
                    loc, f"found data type '{cell.data_type}' but expected '{loc.dt}'"
                )

    def cell(self, loc):
        """
        Return the cell at a given location, validating its existence and type.
        """
        if not loc.is_complete():
            raise ExcelProgrammingError(loc, f"incomplete loc")
        if loc.sheet not in self.workbook:
            raise ExcelValidationError(loc, f"'{loc.sheet}' not found")
        cell = self.workbook[loc.sheet][f"{loc.col}{loc.row}"]
        self.check_dt(loc, cell)
        return cell

    def value(self, loc):
        """
        Return the value at a given location, validating the data type.
        """
        cell = self.cell(loc)
        return cell.value

    def check_value(self, loc, expected):
        """
        Raise an exception if the wrong value is found.
        """
        cell = self.cell(loc)
        if cell.value != expected:
            raise ExcelValidationError(
                loc, f"expected value '{expected}', found '{cell.value}'"
            )

    def row(self, schema, row, sheet=None):
        """
        Return the structured contents of a given row, based on the provided
        schema definition.

        A schema definition is simply a dictionary mapping a key name to
        a (likely incomplete) _loc structure indicating where in a row to
        find the data in question.
        """
        return {
            key: self.value(_loc(sheet=sheet, row=row, loc=base_loc))
            for key, base_loc in schema.items()
        }

    def table(self, schema, start_row, end_row, sheet=None):
        """
        Return an array of rows, starting with start_row and including
        end_row.
        """
        return [
            self.row(schema, row, sheet=sheet) for row in range(start_row, end_row + 1)
        ]

    def is_valid(self):
        """Validate the spreadsheet; return False if not possible."""
        try:
            self.clean()
        except ExcelValidationError as e:
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


class RemarkablyExcelImporter(ExcelImporter):
    """
    An excel importer base class with tools specifically tailored to
    remarkably-style excel templates.
    """

    expected_type = None
    expected_version = None

    SPREADSHEET_TYPE_LOC = _loc("VERSION!B1", dt=DataType.STRING)
    SPREADSHEET_VERSION_LOC = _loc("VERSION!B2", dt=DataType.NUMERIC)

    def clean(self):
        """
        Clean a remarkably-style excel spreadsheet.
        """
        self.check_version()

    def check_version(self):
        """
        Validate the VERSION tab of the spreadsheet.
        """
        self.check_value(self.SPREADSHEET_TYPE_LOC, self.expected_type)
        self.check_value(self.SPREADSHEET_VERSION_LOC, self.expected_version)


class BaselinePerfImporter(RemarkablyExcelImporter):
    expected_type = "baseline_perf"
    expected_version = 1

    PERIOD_SHEET = "output_periods"

    PERIOD_SCHEMA = {
        "start": _loc("A", dt=DataType.DATE),
        "end": _loc("B", dt=DataType.DATE),
        "leased_units_start": _loc("C", dt=DataType.NUMERIC),
        "leases_ended": _loc("F", dt=DataType.NUMERIC),
        "lease_applications": _loc("D", dt=DataType.NUMERIC),
        "leases_executed": _loc("E", dt=DataType.NUMERIC),
        "lease_cds": _loc("G", dt=DataType.NUMERIC),
        "leases_due_to_expire": _loc("H", dt=DataType.NUMERIC),
        "lease_renewal_notices": _loc("J", dt=DataType.NUMERIC),
        "lease_renewals": _loc("I", dt=DataType.NUMERIC),
        "lease_vacation_notices": _loc("K", dt=DataType.NUMERIC),
        "target_lease_percent": _loc("AC", dt=DataType.NUMERIC),
        "target_lease_applications": _loc("AE", dt=DataType.NUMERIC),
        "target_leases_executed": _loc("AF", dt=DataType.NUMERIC),
        "target_lease_renewal_notices": _loc("AJ", dt=DataType.NUMERIC),
        "target_leases_due_to_expire": _loc("AH", dt=DataType.NUMERIC),
        "target_lease_renewals": _loc("AI", dt=DataType.NUMERIC),
        "target_lease_vacation_notices": _loc("AK", dt=DataType.NUMERIC),
        "target_lease_cds": _loc("AG", dt=DataType.NUMERIC),
        "target_delta_leases": _loc("AD", dt=DataType.NUMERIC),
        "occupiable_units_start": _loc("M", dt=DataType.NUMERIC),
        "occupied_units_start": _loc("L", dt=DataType.NUMERIC),
        "move_ins": _loc("N", dt=DataType.NUMERIC),
        "move_outs": _loc("O", dt=DataType.NUMERIC),
        "target_move_ins": _loc("AL", dt=DataType.NUMERIC),
        "target_move_outs": _loc("AM", dt=DataType.NUMERIC),
        "acq_reputation_building": _loc("S", dt=DataType.NUMERIC),
        "acq_demand_creation": _loc("T", dt=DataType.NUMERIC),
        "acq_leasing_enablement": _loc("U", dt=DataType.NUMERIC),
        "acq_market_intelligence": _loc("V", dt=DataType.NUMERIC),
        "monthly_average_rent": _loc("AA", dt=DataType.NUMERIC),
        "lowest_monthly_rent": _loc("AB", dt=DataType.NUMERIC),
        "target_acq_investment": _loc("AN", dt=DataType.NUMERIC),
        "ret_reputation_building": _loc("W", dt=DataType.NUMERIC),
        "ret_demand_creation": _loc("X", dt=DataType.NUMERIC),
        "ret_leasing_enablement": _loc("Y", dt=DataType.NUMERIC),
        "ret_market_intelligence": _loc("Z", dt=DataType.NUMERIC),
        "target_ret_investment": _loc("AO", dt=DataType.NUMERIC),
        "usvs": _loc("P", dt=DataType.NUMERIC),
        "inquiries": _loc("Q", dt=DataType.NUMERIC),
        "tours": _loc("R", dt=DataType.NUMERIC),
        "target_usvs": _loc("AP", dt=DataType.NUMERIC),
        "target_inquiries": _loc("AQ", dt=DataType.NUMERIC),
        "target_tours": _loc("AR", dt=DataType.NUMERIC),
    }

    def check_meta(self):
        """
        Validate that the basic contents of our META tab are valid.
        """
        self.check_value(_loc("META!B11", dt=DataType.STRING), "valid")
        baseline_period_count = self.value(_loc("META!B5", dt=DataType.NUMERIC))
        if baseline_period_count <= 0:
            raise ExcelValidationError(_loc("META!B5"), "no baseline periods found")

    def clean(self):
        super().clean()
        self.check_meta()
        start_row = self.value(_loc("META!B1", dt=DataType.NUMERIC))
        end_row = self.value(_loc("META!B4", dt=DataType.NUMERIC))
        self.cleaned_data["periods"] = self.table(
            schema=self.PERIOD_SCHEMA,
            start_row=start_row,
            end_row=end_row,
            sheet=self.PERIOD_SHEET,
        )
        self.cleaned_data["baseline_start_date"] = self.value(
            _loc("META!B7", dt=DataType.DATE)
        )
        self.cleaned_data["baseline_end_date"] = self.value(
            _loc("META!B8", dt=DataType.DATE)
        )

