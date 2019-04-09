from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    find_row,
    find_col,
    ChoiceCell,
    IntCell,
    DateCell,
    CurrencyCell,
)

from .base import ProjectExcelImporter


def find_meta(predicate):
    """Return a getter that scans the META!A column for header values."""
    return find_row("META!A", predicate)


def find_period(predicate):
    """Return a getter that scans the second row of output_periods for header values."""
    return find_col("output_periods!2", predicate)


class BaselinePerfImporter(ProjectExcelImporter):
    expected_type = "baseline_perf"
    expected_version = 1

    DATES_VALID = ChoiceCell(find_meta("dates_valid"), choices=["valid", "invalid"])
    BASELINE_PERIODS = IntCell(find_meta("baseline_periods"))
    START_ROW = IntCell(find_meta("first_baseline_row"))
    END_ROW = IntCell(find_meta("last_perf_row"))
    BASELINE_START = DateCell(find_meta("baseline_start_date"))
    BASELINE_END = DateCell(find_meta("baseline_end_date"))

    PERIOD_ROW_SCHEMA = {
        "start": DateCell(find_period("start date")),
        "end": DateCell(find_period("end date")),
        "leased_units_start": IntCell(find_period("leased units @ start")),
        "leases_ended": IntCell(find_period("ended")),
        "lease_applications": IntCell(find_period("APPs")),
        "leases_executed": IntCell(find_period("EXEs")),
        "lease_cds": IntCell(find_period("CDs")),
        "lease_renewal_notices": IntCell(find_period("Notices: Renewals")),
        # Use matchp(iexact=...) to disambiguate with "Notices: Renewals"
        "lease_renewals": IntCell(find_period(matchp(iexact="Renewals"))),
        "lease_vacation_notices": IntCell(find_period("Notices: Vacate")),
        "occupiable_units_start": IntCell(find_period("occupiable units")),
        "occupied_units_start": IntCell(find_period("occupied units")),
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
        self.check_schema_value(self.DATES_VALID, col="B", expected="valid")
        self.check_schema_value(
            self.BASELINE_PERIODS, col="B", expected=lambda value: value > 0
        )

    def clean(self):
        super().clean()
        self.check_meta()
        start_row = self.schema_value(self.START_ROW, col="B")
        end_row = self.schema_value(self.END_ROW, col="B")
        self.cleaned_data["baseline_start"] = self.schema_value(
            self.BASELINE_START, col="B"
        )
        self.cleaned_data["baseline_end"] = self.schema_value(
            self.BASELINE_END, col="B"
        )
        self.cleaned_data["periods"] = self.row_table(
            schema=self.PERIOD_ROW_SCHEMA, start_row=start_row, end_row=end_row
        )
