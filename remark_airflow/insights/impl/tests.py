import datetime

from django.test import TestCase

from remark.factories.benchmarks import generate_benchmarks
from remark.factories.geo import create_us
from remark.factories.projects import create_project
from remark.factories.periods import create_periods
from remark_airflow.insights.impl.stub_data.benchmark import stub_benchmark_kpis

from remark_airflow.insights.impl.vars import (
    var_prev_health_status,
    var_benchmark_kpis,
    var_kpi_for_benchmark,
    var_low_benchmark_kpi,
)


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


class VarBenchmarkKPIsTestCase(TestCase):
    def setUp(self) -> None:
        create_us()
        generate_benchmarks(stub_benchmark_kpis)
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)
        self.project = create_project(baseline_start=self.start, baseline_end=self.end)

    def test_default(self):
        kpis = {
            "usvs": 184.20,
            "usv_inq": 0.16,
            "inqs": 24.21,
            "inq_tou": 0.6,
            "tous": 13.28,
            "tou_app": 0.31,
            "apps": 3.88,
            "cd_rate": 0.34,
            "exes": 2.53,
        }
        benchmark_kpis = var_benchmark_kpis(kpis, self.project, self.start, self.end)
        self.assertListEqual(benchmark_kpis, [{"name": "cd_rate", "value": 0.4}])

    def test_no_kpi(self):
        kpis = {}
        benchmark_kpis = var_benchmark_kpis(kpis, self.project, self.start, self.end)
        self.assertListEqual(benchmark_kpis, [])

    def test_no_benchmark(self):
        kpis = {
            "usvs": 184.20,
            "usv_inq": 0.16,
            "inqs": 24.21,
            "inq_tou": 0.6,
            "tous": 13.28,
            "tou_app": 0.31,
            "apps": 3.88,
            "cd_rate": 0.34,
            "exes": 2.53,
        }
        start = datetime.date(year=2019, month=10, day=21)
        end = datetime.date(year=2019, month=10, day=28)
        benchmark_kpis = var_benchmark_kpis(kpis, self.project, start, end)
        self.assertListEqual(benchmark_kpis, [])


class KPIForBenchmarkTestCase(TestCase):
    def test_normal(self):
        expected = {
            "usvs": 1,
            "usv_inq": 2,
            "inqs": 3,
            "inq_tou": 4,
            "tous": 5,
            "tou_app": 6,
            "apps": 7,
            "cd_rate": 8,
            "exes": 9,
        }
        computed_kpis = {
            "usv_cost": 1,
            "usv_inq": 2,
            "inq_cost": 3,
            "inq_tou": 4,
            "tou_cost": 5,
            "tou_app": 6,
            "app_cost": 7,
            "lease_cd_rate": 8,
            "exe_cost": 9,
            "usv_exe": 10,
            "app_exe": 11,
        }
        result = var_kpi_for_benchmark(computed_kpis)
        self.assertDictEqual(result, expected)

    def test_kpi_not_full(self):
        expected = {
            "usvs": 1,
            "usv_inq": 2,
            "inqs": 3,
            "inq_tou": 4,
            "tous": 5,
            "apps": 7,
            "cd_rate": 8,
            "exes": 9,
        }
        computed_kpis = {
            "usv_cost": 1,
            "usv_inq": 2,
            "inq_cost": 3,
            "inq_tou": 4,
            "tou_cost": 5,
            "app_cost": 7,
            "lease_cd_rate": 8,
            "exe_cost": 9,
            "usv_exe": 10,
            "app_exe": 11,
        }
        result = var_kpi_for_benchmark(computed_kpis)
        self.assertDictEqual(result, expected)

    def test_no_kpi(self):
        result = var_kpi_for_benchmark({})
        self.assertIsNone(result)

    def test_kpi_none(self):
        result = var_kpi_for_benchmark(None)
        self.assertIsNone(result)


class LowBenchmarkKPITestCase(TestCase):
    def test_have_kpi(self):
        kpi = [
            {"name": "usvs", "value": 1},
            {"name": "usv_inq", "value": 2},
            {"name": "inqs", "value": 3},
        ]
        result = var_low_benchmark_kpi(kpi)
        self.assertEqual(result, "usvs")

    def test_no_kpi(self):
        result = var_low_benchmark_kpi([])
        self.assertEqual(result, None)

    def test_is_none(self):
        result = var_low_benchmark_kpi(None)
        self.assertEqual(result, None)
