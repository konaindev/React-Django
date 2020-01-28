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
    var_low_performing_kpi,
    var_below_average_kpi,
    var_high_performing_kpi,
    var_above_average_kpi,
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
        kpis = {"inqs": 24.21, "inq_tou": 0.6}
        benchmark_kpis = var_benchmark_kpis(kpis, self.project, self.start, self.end)

        expected = [
            {
                "start": datetime.date(year=2019, month=9, day=21),
                "end": datetime.date(year=2019, month=9, day=28),
                "country_id": 233,
                "category": 1,
                "kpi": "inqs",
                "threshold_0": 1,
                "threshold_1": 2,
                "threshold_2": 6,
                "threshold_3": 10,
                "property_count_0": 2,
                "property_count_1": 1,
                "property_count_2": 2,
                "property_count_3": 2,
                "property_count_4": 21,
                "total_property_count": 28,
            },
            {
                "start": datetime.date(year=2019, month=9, day=21),
                "end": datetime.date(year=2019, month=9, day=28),
                "country_id": 233,
                "category": 1,
                "kpi": "inq_tou",
                "threshold_0": 0.2,
                "threshold_1": 0.3,
                "threshold_2": 0.4,
                "threshold_3": 0.5,
                "property_count_0": 2,
                "property_count_1": 3,
                "property_count_2": 8,
                "property_count_3": 6,
                "property_count_4": 7,
                "total_property_count": 26,
            },
        ]
        for kpi in benchmark_kpis:
            del kpi["last_updated"]
            del kpi["public_id"]
        self.assertListEqual(benchmark_kpis, expected)

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
            "app_exe": 8,
            "retention_rate": 9,
        }
        computed_kpis = {
            "usv_cost": 1,
            "usv_inq": 2,
            "inq_cost": 3,
            "inq_tou": 4,
            "tou_cost": 5,
            "tou_app": 6,
            "app_cost": 7,
            "app_exe": 8,
            "renewal_rate": 9,
            "exe_cost": 10,
            "usv_exe": 11,
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
            "app_exe": 8,
            "retention_rate": 9,
        }
        computed_kpis = {
            "usv_cost": 1,
            "usv_inq": 2,
            "inq_cost": 3,
            "inq_tou": 4,
            "tou_cost": 5,
            "app_cost": 7,
            "app_exe": 8,
            "renewal_rate": 9,
            "exe_cost": 10,
            "usv_exe": 11,
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
    def setUp(self) -> None:
        self.kpis = {"usvs": 2.01, "usv_inq": 0.01, "inqs": 0.9}
        self.benchmark_kpis = [
            {"kpi": "usvs", "threshold_0": 7.02},
            {"kpi": "usv_inq", "threshold_0": 0.03},
            {"kpi": "inqs", "threshold_0": 1},
        ]

    def test_have_kpi(self):
        result = var_low_performing_kpi(self.benchmark_kpis, self.kpis)
        self.assertEqual(result, "usvs")

    def test_no_kpi(self):
        result = var_low_performing_kpi(self.benchmark_kpis, {})
        self.assertIsNone(result)

    def test_no_benchmark_kpi(self):
        result = var_low_performing_kpi([], self.kpis)
        self.assertIsNone(result)

    def test_benchmark_kpi_is_none(self):
        result = var_low_performing_kpi(None, self.kpis)
        self.assertIsNone(result)


class BelowAverageKPITestCase(TestCase):
    def setUp(self) -> None:
        self.kpis = {"inqs": 1.01, "inq_tou": 0.25, "tous": 1, "tou_app": 0.5}
        self.benchmark_kpis = [
            {"kpi": "inqs", "threshold_0": 1, "threshold_1": 2},
            {"kpi": "inq_tou", "threshold_0": 0.2, "threshold_1": 0.3},
            {"kpi": "tous", "threshold_0": 0.01, "threshold_1": 0.25},
            {"kpi": "tou_app", "threshold_0": 0.25, "threshold_1": 0.3},
        ]

    def test_have_kpi(self):
        result = var_below_average_kpi(self.benchmark_kpis, self.kpis)
        self.assertEqual(result, "inqs")

    def test_not_triggered(self):
        kpis = self.kpis.copy()
        kpis["tou_app"] = 0.2
        result = var_below_average_kpi(self.benchmark_kpis, kpis)
        self.assertIsNone(result)

    def test_no_kpi(self):
        result = var_below_average_kpi(self.benchmark_kpis, {})
        self.assertIsNone(result)

    def test_no_benchmark_kpi(self):
        result = var_below_average_kpi([], self.kpis)
        self.assertIsNone(result)

    def test_benchmark_kpi_is_none(self):
        result = var_below_average_kpi(None, self.kpis)
        self.assertIsNone(result)


class VarHighPerformingKPITestCase(TestCase):
    def setUp(self) -> None:
        self.kpis = {"inqs": 1.01, "inq_tou": 0.75, "tous": 1, "tou_app": 0.5}
        self.benchmark_kpis = [
            {"kpi": "inqs", "threshold_3": 10},
            {"kpi": "inq_tou", "threshold_3": 0.5},
            {"kpi": "tous", "threshold_3": 5},
            {"kpi": "tou_app", "threshold_3": 0.5},
        ]

    def test_have_kpi(self):
        result = var_high_performing_kpi(self.benchmark_kpis, self.kpis)
        self.assertEqual(result, "inq_tou")

    def test_no_kpi(self):
        result = var_high_performing_kpi(self.benchmark_kpis, {})
        self.assertIsNone(result)

    def test_no_benchmark_kpi(self):
        result = var_high_performing_kpi([], self.kpis)
        self.assertIsNone(result)

    def test_benchmark_kpi_is_none(self):
        result = var_high_performing_kpi(None, self.kpis)
        self.assertIsNone(result)


class VarAboveAverageKPITestCase(TestCase):
    def setUp(self) -> None:
        self.kpis = {"inq_tou": 0.45, "tous": 1, "tou_app": 0.4}
        self.benchmark_kpis = [
            {"kpi": "inq_tou", "threshold_2": 0.4, "threshold_3": 0.5},
            {"kpi": "tous", "threshold_2": 3, "threshold_3": 5},
            {"kpi": "tou_app", "threshold_2": 0.41, "threshold_3": 0.5},
        ]

    def test_have_kpi(self):
        result = var_above_average_kpi(self.benchmark_kpis, self.kpis)
        self.assertEqual(result, "inq_tou")

    def test_not_triggered(self):
        kpis = self.kpis.copy()
        kpis["inq_tou"] = 0.75
        result = var_above_average_kpi(self.benchmark_kpis, kpis)
        self.assertIsNone(result)

    def test_no_kpi(self):
        result = var_above_average_kpi(self.benchmark_kpis, {})
        self.assertIsNone(result)

    def test_no_benchmark_kpi(self):
        result = var_above_average_kpi([], self.kpis)
        self.assertIsNone(result)

    def test_benchmark_kpi_is_none(self):
        result = var_above_average_kpi(None, self.kpis)
        self.assertIsNone(result)

