import datetime

from django.test import TestCase

from remark.factories.periods import create_periods
from remark.factories.projects import create_project
from remark_airflow.insights.impl.vars_base import var_base_kpis


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
