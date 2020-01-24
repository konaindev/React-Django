import datetime

from django.test import TestCase

from remark.factories.projects import create_project
from remark.factories.periods import create_periods

from remark.insights.impl.vars import var_prev_health_status


class VarPrevHealthStatusTestCase(TestCase):
    def setUp(self):
        project = create_project()
        create_periods(
            project,
            start=datetime.date(year=2019, month=5, day=31),
            end=datetime.date(year=2019, month=6, day=7),
        )
        create_periods(
            project,
            start=datetime.date(year=2019, month=6, day=7),
            end=datetime.date(year=2019, month=6, day=14),
        )
        create_periods(
            project,
            start=datetime.date(year=2019, month=6, day=14),
            end=datetime.date(year=2019, month=6, day=21),
            period_params={"leased_units_end": 160},
        )
        self.project = project

    def test_dont_have_period(self):
        start = datetime.date(year=2019, month=5, day=19)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, -1)

    def test_first_period(self):
        start = datetime.date(year=2019, month=5, day=31)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, -1)

    def test_last_period(self):
        start = datetime.date(year=2019, month=6, day=14)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, 2)

    def test_after_period(self):
        start = datetime.date(year=2019, month=6, day=21)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, 2)

    def test_health_not_changes(self):
        start = datetime.date(year=2019, month=6, day=7)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, 2)

    def test_multiple_period(self):
        start = datetime.date(year=2019, month=6, day=7)
        result = var_prev_health_status(self.project, start)
        self.assertEqual(result, 2)
