from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    currency_converter,
    DataType,
    date_converter,
    find_col,
    loc,
    SchemaCell,
    SchemaRow,
)

from .base import ProjectExcelImporter


class BaselinePerfImporter(ProjectExcelImporter):
    expected_type = "baseline_perf"
    expected_version = 1

    DATES_VALID = SchemaCell(loc("META!B11"), DataType.STRING, str)
    BASELINE_PERIODS = SchemaCell(loc("META!B5"), DataType.NUMERIC, int)
    START_ROW = SchemaCell(loc("META!B1"), DataType.NUMERIC, int)
    END_ROW = SchemaCell(loc("META!B4"), DataType.NUMERIC, int)
    BASELINE_START_DATE = SchemaCell(loc("META!B7"), DataType.DATETIME, date_converter)
    BASELINE_END_DATE = SchemaCell(loc("META!B8"), DataType.DATETIME, date_converter)

    HEADER_ROW = 2

    PERIOD_SHEET = "output_periods"

    PERIOD_SROW = SchemaRow(
        {
            "start": SchemaCell(
                find_col(HEADER_ROW, "start date"), DataType.DATETIME, date_converter
            ),
            "end": SchemaCell(
                find_col(HEADER_ROW, "end date"), DataType.DATETIME, date_converter
            ),
            "leased_units_start": SchemaCell(
                find_col(HEADER_ROW, "leased units @ start"), DataType.NUMERIC, int
            ),
            "leases_ended": SchemaCell(
                find_col(HEADER_ROW, "ended"), DataType.NUMERIC, int
            ),
            "lease_applications": SchemaCell(
                find_col(HEADER_ROW, "APPs"), DataType.NUMERIC, int
            ),
            "leases_executed": SchemaCell(
                find_col(HEADER_ROW, "EXEs"), DataType.NUMERIC, int
            ),
            "lease_cds": SchemaCell(find_col(HEADER_ROW, "CDs"), DataType.NUMERIC, int),
            "lease_renewal_notices": SchemaCell(
                find_col(HEADER_ROW, "Notices: Renewals"), DataType.NUMERIC, int
            ),
            "lease_renewals": SchemaCell(
                # Use matchp(iexact=...) to disambiguate with "Notices: Renewals"
                find_col(HEADER_ROW, matchp(iexact="Renewals")),
                DataType.NUMERIC,
                int,
            ),
            "lease_vacation_notices": SchemaCell(
                find_col(HEADER_ROW, "Notices: Vacate"), DataType.NUMERIC, int
            ),
            "occupiable_units_start": SchemaCell(
                find_col(HEADER_ROW, "occupiable units"), DataType.NUMERIC, int
            ),
            "occupied_units_start": SchemaCell(
                find_col(HEADER_ROW, "occupied units"), DataType.NUMERIC, int
            ),
            "move_ins": SchemaCell(
                find_col(HEADER_ROW, "move ins"), DataType.NUMERIC, int
            ),
            "move_outs": SchemaCell(
                find_col(HEADER_ROW, "move outs"), DataType.NUMERIC, int
            ),
            "acq_reputation_building": SchemaCell(
                find_col(HEADER_ROW, "Reputation ACQ"),
                DataType.NUMERIC,
                currency_converter,
            ),
            "acq_demand_creation": SchemaCell(
                find_col(HEADER_ROW, "Demand ACQ"), DataType.NUMERIC, currency_converter
            ),
            "acq_leasing_enablement": SchemaCell(
                find_col(HEADER_ROW, "Leasing ACQ"),
                DataType.NUMERIC,
                currency_converter,
            ),
            "acq_market_intelligence": SchemaCell(
                find_col(HEADER_ROW, "Market ACQ"), DataType.NUMERIC, currency_converter
            ),
            "ret_reputation_building": SchemaCell(
                find_col(HEADER_ROW, "Reputation RET"),
                DataType.NUMERIC,
                currency_converter,
            ),
            "ret_demand_creation": SchemaCell(
                find_col(HEADER_ROW, "Demand RET"), DataType.NUMERIC, currency_converter
            ),
            "ret_leasing_enablement": SchemaCell(
                find_col(HEADER_ROW, "Leasing RET"),
                DataType.NUMERIC,
                currency_converter,
            ),
            "ret_market_intelligence": SchemaCell(
                find_col(HEADER_ROW, "Market RET"), DataType.NUMERIC, currency_converter
            ),
            "usvs": SchemaCell(find_col(HEADER_ROW, "USVs"), DataType.NUMERIC, int),
            "inquiries": SchemaCell(
                find_col(HEADER_ROW, "INQs"), DataType.NUMERIC, int
            ),
            "tours": SchemaCell(find_col(HEADER_ROW, "TOUs"), DataType.NUMERIC, int),
        }
    )

    def check_meta(self):
        """
        Validate that the basic contents of our META tab are valid.
        """
        self.check_schema_value(self.DATES_VALID, expected="valid")
        self.check_schema_value(self.BASELINE_PERIODS, expected=lambda value: value > 0)

    def clean(self):
        super().clean()
        self.check_meta()
        start_row = self.schema_value(self.START_ROW)
        end_row = self.schema_value(self.END_ROW)
        self.cleaned_data["baseline_start_date"] = self.schema_value(
            self.BASELINE_START_DATE
        )
        self.cleaned_data["baseline_end_date"] = self.schema_value(
            self.BASELINE_END_DATE
        )
        self.cleaned_data["periods"] = self.row_table(
            schema=self.PERIOD_SROW,
            start_row=start_row,
            end_row=end_row,
            sheet=self.PERIOD_SHEET,
        )
