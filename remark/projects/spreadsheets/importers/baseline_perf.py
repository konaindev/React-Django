from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    find_row,
    find_col,
    DataType,
    ChoiceCell,
    IntCell,
    DateCell,
    CurrencyCell,
    StrCell,
    SchemaCell,
    ExcelValidationError,
)

from .base import ProjectExcelImporter


def find_meta(predicate):
    """Return a locator that scans the META!A column for header values and returns values in META!B."""
    return find_row("META!A", predicate, target="B")


def find_period(predicate):
    """Return a locator that scans the second row of output_periods for header values."""
    return find_col("output_periods!2", predicate)


def get_lease_stages():
    """
    TODO: If it will do a lot of queries and will work too slow in future
        we can use caching here (for example `beaker` https://github.com/bbangert/beaker)
    """
    from remark.projects.models import LeaseStage
    return list(LeaseStage.objects.values_list("full_name", flat=True))


def LeaseStagesCell(locator=None, label=None):
    def str_or_convertible_or_null_data_type(cell):
        return cell.data_type in frozenset(
            [DataType.STRING, DataType.NUMERIC, DataType.NULL]
        )

    def choice_or_fail_converter(value):
        value = str(value) if value else None
        choices = get_lease_stages()
        if value not in get_lease_stages():
            raise ExcelValidationError(
                f"Unexpected value '{value}' found; expected one of '{choices}'"
            )
        return value

    return SchemaCell(locator, str_or_convertible_or_null_data_type, choice_or_fail_converter, label=None)


class BaselinePerfImporter(ProjectExcelImporter):
    expected_type = "baseline_perf"
    expected_version = 1

    DATES_VALID = ChoiceCell(find_meta("dates_valid"), choices=["valid", "invalid"])
    BASELINE_PERIODS = IntCell(find_meta("baseline_periods"))
    START_ROW = IntCell(find_meta("first_baseline_row"))
    END_ROW = IntCell(find_meta("last_perf_row"))
    BASELINE_START = DateCell(find_meta("baseline_start_date"))
    BASELINE_END = DateCell(find_meta("baseline_end_date"))

    PERIOD_SCHEMA = {
        "start": DateCell(find_period("start date")),
        "end": DateCell(find_period("end date")),
        "lease_stage_str": LeaseStagesCell(find_period("lease stage")),
        "leased_units_start": IntCell(find_period("leased units @ start")),
        "leased_units_end": IntCell(find_period("leased units @ end")),
        "leases_ended": IntCell(find_period("ended")),
        "lease_applications": IntCell(find_period("APPs")),
        "leases_executed": IntCell(find_period("EXEs")),
        "lease_cds": IntCell(find_period("CDs")),
        "lease_renewal_notices": IntCell(find_period("Notices: Renewals")),
        # Use matchp(iexact=...) to disambiguate with "Notices: Renewals"
        "lease_renewals": IntCell(find_period(matchp(iexact="Renewals"))),
        "lease_vacation_notices": IntCell(find_period("Notices: Vacate")),
        "occupiable_units_start": IntCell(find_period("occupiable units")),
        "occupied_units_start": IntCell(find_period("occupied units @ start")),
        "occupied_units_end": IntCell(find_period("occupied units @ end")),
        "move_ins": IntCell(find_period("move ins")),
        "move_outs": IntCell(find_period("move outs")),
        "acq_reputation_building": CurrencyCell(find_period("Reputation ACQ")),
        "acq_demand_creation": CurrencyCell(find_period("Demand ACQ")),
        "acq_leasing_enablement": CurrencyCell(find_period("Leasing ACQ")),
        "acq_market_intelligence": CurrencyCell(find_period("Market ACQ")),
        "ret_reputation_building": CurrencyCell(find_period("Reputation RET")),
        "ret_demand_creation": CurrencyCell(find_period("Demand RET")),
        "ret_leasing_enablement": CurrencyCell(find_period("Leasing RET")),
        "ret_market_intelligence": CurrencyCell(find_period("Market RET")),
        "usvs": IntCell(find_period("USVs")),
        "inquiries": IntCell(find_period("INQs")),
        "tours": IntCell(find_period("TOUs")),
    }

    def check_meta(self):
        """
        Validate that the basic contents of our META tab are valid.
        """
        self.check_value(self.DATES_VALID, expected="valid")
        self.check_value(self.BASELINE_PERIODS, expected=lambda value: value > 0)

    def clean(self, ctx):
        super().clean()
        self.check_meta()
        start_row = self.schema(self.START_ROW)
        end_row = self.schema(self.END_ROW)
        self.cleaned_data["baseline_start"] = self.schema(self.BASELINE_START)
        self.cleaned_data["baseline_end"] = self.schema(self.BASELINE_END)
        self.cleaned_data["periods"] = self.schema_list(
            schema=self.PERIOD_SCHEMA, start=start_row, end=end_row
        )

        # Sanity check that there is at least one period
        if not self.cleaned_data["periods"]:
            raise ExcelValidationError(
                "BaselinePerfImporter.clean: Unable to load any periods from the spreadsheet."
            )

        # Sanity check that our first period has the same start date as the
        # baseline start we pulled from the spreadsheet meta tab; if not, blow up.
        baseline_start = self.cleaned_data["baseline_start"]
        period_start = self.cleaned_data["periods"][0]["start"]
        if baseline_start != period_start:
            raise ExcelValidationError(
                f"BaselinePerfImporter.clean: The spreadsheet looks broken. The first baseline period starts on {baseline_start} but the first period starts on {period_start}."
            )

        # Sanity check that period end dates are always lexically after the start dates
        prev_period = None
        for period in self.cleaned_data["periods"]:
            if period["start"] >= period["end"]:
                raise ExcelValidationError(
                    f"BaselinePerfImporter.clean: The spreadsheet looks broken. There is a period that begins on {period['start']} but ends *at or before* that, on {period['end']}."
                )
            if prev_period is not None and prev_period["end"] > period["start"]:
                raise ExcelValidationError(
                    f"BaselinePerfImporter.clean: The spreadsheet looks broken. There is a period that ends ({prev_period['end']} after the next period begins ({period['start']}"
                )


