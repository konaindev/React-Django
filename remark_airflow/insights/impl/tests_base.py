import datetime
from decimal import Decimal

from django.test import TestCase

from remark.factories.periods import create_periods
from remark.factories.projects import create_project
from remark_airflow.insights.impl.vars_base import var_base_kpis, var_base_targets


class VarBaseKPIsTestCase(TestCase):
    def setUp(self) -> None:
        self.start = datetime.date(year=2020, month=2, day=4)
        self.end = datetime.date(year=2020, month=2, day=11)
        self.project = create_project()

    def test_no_kpi(self):
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=1, day=27),
            end=datetime.date(year=2020, month=2, day=3),
        )
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=2, day=3),
            end=datetime.date(year=2020, month=2, day=10),
        )
        result = var_base_kpis(self.project, self.start, self.end)
        self.assertIsNone(result)

    def test_have_kpi(self):
        create_periods(
            self.project,
            start=datetime.date(year=2020, month=2, day=3),
            end=datetime.date(year=2020, month=2, day=12),
        )
        result = var_base_kpis(self.project, self.start, self.end)
        self.assertIsNotNone(result)


class VarBaseTargetsTestCase(TestCase):
    def setUp(self) -> None:
        self.start = datetime.date(year=2020, month=2, day=4)
        self.end = datetime.date(year=2020, month=2, day=11)
        self.project = create_project()

    def test_no_kpi(self):
        result = var_base_targets(self.project, self.start, self.end)
        expected = {
            "acq_investment": None,
            "delta_leases": None,
            "inquiries": None,
            "lease_applications": None,
            "lease_cds": None,
            "lease_renewal_notices": None,
            "lease_renewals": None,
            "lease_vacation_notices": None,
            "leased_rate": None,
            "leases_executed": None,
            "move_ins": None,
            "move_outs": None,
            "occupied_units": None,
            "ret_investment": None,
            "tours": None,
            "usvs": None,
        }
        self.assertDictEqual(result, expected)

    def test_have_kpi(self):
        create_periods(self.project, start=self.start, end=self.end)
        result = var_base_targets(self.project, self.start, self.end)
        expected = {
            "acq_investment": Decimal("1998.43"),
            "delta_leases": 4,
            "inquiries": 35,
            "lease_applications": 7,
            "lease_cds": 1,
            "lease_renewal_notices": 3,
            "lease_renewals": 0,
            "lease_vacation_notices": 2,
            "leased_rate": Decimal("0.940"),
            "leases_executed": 6,
            "move_ins": 6,
            "move_outs": 2,
            "occupied_units": 150,
            "ret_investment": Decimal("790.00"),
            "tours": 13,
            "usvs": 480,
        }
        self.assertDictEqual(result, expected)

    def test_kpi_wrong_date(self):
        create_periods(
            self.project,
            start=self.start - datetime.timedelta(weeks=1),
            end=self.end - datetime.timedelta(weeks=1),
        )
        result = var_base_targets(self.project, self.start, self.end)
        expected = {
            "acq_investment": None,
            "delta_leases": None,
            "inquiries": None,
            "lease_applications": None,
            "lease_cds": None,
            "lease_renewal_notices": None,
            "lease_renewals": None,
            "lease_vacation_notices": None,
            "leased_rate": Decimal("0.940"),
            "leases_executed": None,
            "move_ins": None,
            "move_outs": None,
            "occupied_units": 150,
            "ret_investment": None,
            "tours": None,
            "usvs": None,
        }
        self.assertDictEqual(result, expected)
