import datetime
from decimal import Decimal

from django.test import TestCase

from .baseline_perf import BaselinePerfImporter
from .test_base import SpreadsheetFileTestCaseMixin


class BaselinePerfTestCase(SpreadsheetFileTestCaseMixin, TestCase):
    importer_class = BaselinePerfImporter
    spreadsheet_file_name = "baseline-perf.xlsx"
    schema_file_name = "baseline-perf.schema.json"

    EXPECTED_FIRST_PERIOD = {
        "start": datetime.date(year=2018, month=8, day=1),
        "end": datetime.date(year=2018, month=9, day=1),
        "lease_stage_str": "performance",
        "leased_units_start": 153,
        "leased_units_end": 136,
        "leases_ended": 17,
        "lease_applications": 1,
        "leases_executed": 0,
        "lease_cds": 1,
        "lease_renewal_notices": 6,
        "lease_renewals": 5,
        "lease_vacation_notices": 19,
        "occupiable_units_start": 156,
        "occupied_units_start": 153,
        "occupied_units_end": 148,
        "move_ins": 12,
        "move_outs": 17,
        "acq_reputation_building": Decimal(0),
        "acq_demand_creation": Decimal("3688.81"),
        "acq_leasing_enablement": Decimal(0),
        "acq_market_intelligence": Decimal(0),
        "ret_reputation_building": Decimal(0),
        "ret_demand_creation": Decimal(0),
        "ret_leasing_enablement": Decimal(0),
        "ret_market_intelligence": Decimal(0),
        "usvs": 990,
        "inquiries": 78,
        "tours": 4,
    }

    def test_example_data(self):
        """
        An integration test that ensures that both our checked-in
        example baseline/perf spreadsheet *and* our importer are in
        agreement. If they aren't... boom!
        """
        super().test_example_data()

        self.assertEqual(
            self.importer.cleaned_data["baseline_start"],
            datetime.date(year=2018, month=8, day=1),
        )
        self.assertEqual(
            self.importer.cleaned_data["baseline_end"],
            datetime.date(year=2019, month=3, day=1),
        )
        self.assertEqual(len(self.importer.cleaned_data["periods"]), 9)

        first_period = self.importer.cleaned_data["periods"][0]
        self.assertEqual(first_period, self.EXPECTED_FIRST_PERIOD)
