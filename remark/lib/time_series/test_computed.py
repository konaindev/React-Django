from django.test import TestCase
from datetime import date
from decimal import Decimal

from .computed import generate_computed_kpis
from .common import KPI

KPI_DATA = {
    "start": date(year=2019, month=5, day=1),
    "end": date(year=2019, month=6, day=1),
    KPI.leased_units_start: 100,
    KPI.leased_units_end: 110,
    KPI.leases_ended: 5,
    KPI.lease_applications: 5,
    KPI.leases_executed: 10,
    KPI.lease_cds: 2,
    KPI.lease_renewal_notices: 10,
    KPI.lease_renewals: 5,
    KPI.lease_vacation_notices: 10,
    KPI.occupiable_units_start: 200,
    KPI.occupied_units_start: 95,
    KPI.occupied_units_end: 101,
    KPI.move_ins: 10,
    KPI.move_outs: 5,

    KPI.acq_reputation_building: Decimal(1000.0),
    KPI.acq_demand_creation: Decimal(500.0),
    KPI.acq_leasing_enablement: Decimal(100.0),
    KPI.acq_market_intelligence: Decimal(50.0),
    KPI.ret_reputation_building: Decimal(2000.0),
    KPI.ret_demand_creation: Decimal(0.0),
    KPI.ret_leasing_enablement: Decimal(0.0),
    KPI.ret_market_intelligence: Decimal(100.0),

    KPI.usvs: 1000,
    KPI.inquiries: 75,
    KPI.tours: 30,

    KPI.average_monthly_rent: Decimal(1000.0),
    KPI.lowest_monthly_rent: Decimal(500.0),
    KPI.highest_monthly_rent: Decimal(1200.0),

    KPI.total_units: 220,
}


class ComputeTestCase(TestCase):

    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def testBasic(self):
        result = generate_computed_kpis(KPI_DATA)
        print(result)

        def g(kpi_name):
            return result[kpi_name]

        self.assertEqual(type(result), dict)

        self.assertEqual(g(KPI.delta_leases), 5)
        self.assertEqual(g(KPI.leased_units), 110)
        self.assertEqual(g(KPI.leased_rate), 110.0/220.0)
        self.assertEqual(g(KPI.occupancy_rate), 101.0/200.0)
        self.assertEqual(g(KPI.usv_exe), 10.0 / 1000.0)
        self.assertEqual(g(KPI.app_cost), 1650.0 / 5.0)
        self.assertEqual(result[KPI.ret_investment], Decimal('2100'))
        self.assertEqual(result[KPI.acq_investment], Decimal('1650'))
        self.assertEqual(result[KPI.romi], 240000.0 / 3750.0)

