import datetime

from django.test import TestCase

from remark.factories.benchmarks import generate_benchmarks
from remark.factories.geo import create_us
from remark.factories.projects import create_project
from remark.factories.periods import create_periods
from remark.projects.constants import HEALTH_STATUS
from remark_airflow.insights.impl.stub_data.benchmark import stub_benchmark_kpis
from remark_airflow.insights.impl.stub_data.kpi import (
    all_base_kpis,
    all_computed_kpis,
    all_target_kpis,
    all_target_computed_kpis,
    kpis_trends,
)

from remark_airflow.insights.impl.vars import (
    var_prev_health_status,
    var_benchmark_kpis,
    var_kpi_for_benchmark,
    var_low_performing_kpi,
    var_below_average_kpi,
    var_high_performing_kpi,
    var_above_average_kpi,
    var_kpis_healths_statuses,
    var_kpi_mitigation,
    var_kpi_health_weeks,
    var_unpack_kpi,
    var_kpi_without_mitigated,
    var_kpis_trends,
    var_predicting_change_health,
    var_all_base_kpis,
    var_all_target_kpis,
    var_all_computed_kpis,
    var_all_target_computed_kpis,
    var_predicted_kpi,
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


class VarKPIsHealthsStatusesTestCase(TestCase):
    def setUp(self) -> None:
        self.computed_kpis = {"usvs": 6, "usv_inq": None, "inquiries": 0, "inq_tou": 2}
        self.target_computed_kpis = {
            "usvs": 8,
            "usv_inq": 3,
            "inquiries": 3,
            "inq_tou": 1,
        }
        self.kpis_names = ["usvs", "usv_inq", "inquiries", "inq_tou"]

    def test_kpi_is_none(self):
        result = var_kpis_healths_statuses(
            None, self.target_computed_kpis, self.kpis_names
        )
        self.assertIsNone(result)

    def test_target_kpi_is_none(self):
        result = var_kpis_healths_statuses(self.computed_kpis, None, self.kpis_names)
        self.assertIsNone(result)

    def test_all_kpi_is_none(self):
        result = var_kpis_healths_statuses(None, None, self.kpis_names)
        self.assertIsNone(result)

    def test_kpi_is_empty(self):
        result = var_kpis_healths_statuses(
            {}, self.target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, {})

    def test_target_kpi_is_empty(self):
        result = var_kpis_healths_statuses(self.computed_kpis, {}, self.kpis_names)
        self.assertDictEqual(result, {})

    def test_all_kpi_is_empty(self):
        result = var_kpis_healths_statuses({}, {}, self.kpis_names)
        self.assertDictEqual(result, {})

    def test_kpi_name_is_empty(self):
        result = var_kpis_healths_statuses(
            self.computed_kpis, self.target_computed_kpis, []
        )
        self.assertDictEqual(result, {})

    def test_have_kpi(self):
        expected = {"usvs": 1, "usv_inq": -1, "inquiries": 0, "inq_tou": 2}
        result = var_kpis_healths_statuses(
            self.computed_kpis, self.target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, expected)

    def test_kpi_not_full(self):
        expected = {"usv_inq": -1, "inquiries": 0, "inq_tou": 2}
        computed_kpis = self.computed_kpis.copy()
        del computed_kpis["usvs"]
        result = var_kpis_healths_statuses(
            computed_kpis, self.target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, expected)

    def test_target_kpi_not_full(self):
        expected = {"usv_inq": -1, "inquiries": 0, "inq_tou": 2}
        target_computed_kpis = self.target_computed_kpis.copy()
        del target_computed_kpis["usvs"]
        result = var_kpis_healths_statuses(
            self.computed_kpis, target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, expected)


class VarKPIMitigationTestCase(TestCase):
    def setUp(self) -> None:
        self.computed_kpis = {
            "usvs": 6,
            "usv_inq": None,
            "inquiries": 0,
            "inq_tou": 2,
            "tours": 13,
        }
        self.target_computed_kpis = {
            "usvs": 8,
            "usv_inq": 3,
            "inquiries": 3,
            "inq_tou": 1,
            "tours": 14,
        }
        self.kpis_healths = {
            "usvs": 2,
            "usv_inq": -1,
            "inquiries": 0,
            "inq_tou": 2,
            "tours": 2,
        }

    def test_kpi_is_none(self):
        result = var_kpi_mitigation(
            self.kpis_healths,
            None,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_target_kpi_is_none(self):
        result = var_kpi_mitigation(
            self.kpis_healths, self.computed_kpis, None, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_all_kpi_is_none(self):
        result = var_kpi_mitigation(
            self.kpis_healths, None, None, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_kpi_is_empty(self):
        result = var_kpi_mitigation(
            self.kpis_healths, {}, self.target_computed_kpis, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_target_kpi_is_empty(self):
        result = var_kpi_mitigation(
            self.kpis_healths, self.computed_kpis, {}, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_all_kpi_is_empty(self):
        result = var_kpi_mitigation(
            self.kpis_healths, {}, {}, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_kpis_healths_is_none(self):
        result = var_kpi_mitigation(
            None,
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_kpis_healths_is_empty(self):
        result = var_kpi_mitigation(
            {},
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_have_kpi(self):
        result = var_kpi_mitigation(
            self.kpis_healths,
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertTupleEqual(result, ("inquiries", "inq_tou", "tours"))

    def test_have_many_mitigation_kpi(self):
        computed_kpis = self.computed_kpis.copy()
        computed_kpis["tou_app"] = 0
        computed_kpis["lease_applications"] = 5
        computed_kpis["tours"] = 14
        target_computed_kpis = self.target_computed_kpis.copy()
        target_computed_kpis["tou_app"] = 13
        target_computed_kpis["lease_applications"] = 5
        target_computed_kpis["tours"] = 13
        kpis_healths = self.kpis_healths.copy()
        kpis_healths["tou_app"] = 0
        kpis_healths["lease_applications"] = 2
        result = var_kpi_mitigation(
            kpis_healths, computed_kpis, target_computed_kpis, 0
        )
        self.assertTupleEqual(result, ("inquiries", "inq_tou", "tours"))


class VarKPIHealthWeeksTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)

    def test_no_kpi(self):
        result = var_kpi_health_weeks("usvs", self.project, self.start, -1)
        self.assertEqual(result, 0)

    def test_kpi_is_none(self):
        result = var_kpi_health_weeks(None, self.project, self.start, -1)
        self.assertEqual(result, 0)

    def test_two_week(self):
        start = self.start
        end = self.start - datetime.timedelta(weeks=1)
        create_periods(self.project, start=start, end=end)
        start = end
        end = start - datetime.timedelta(weeks=1)
        create_periods(self.project, start=start, end=end)
        result = var_kpi_health_weeks("usv_inq", self.project, self.start, 2)
        self.assertEqual(result, 2)


class VarUnpackKPITestCase(TestCase):
    def test_kpi_is_none(self):
        result = var_unpack_kpi(None, 1)
        self.assertIsNone(result)

    def test_kpi_is_empty(self):
        result = var_unpack_kpi([], 1)
        self.assertIsNone(result)

    def test_index_out_of_range(self):
        result = var_unpack_kpi(["usv_inq"], 2)
        self.assertIsNone(result)


class VarKPIWithoutMitigated(TestCase):
    def setUp(self) -> None:
        self.computed_kpis = {
            "usvs": 6,
            "usv_inq": None,
            "inquiries": 0,
            "inq_tou": 2,
            "tours": 13,
        }
        self.target_computed_kpis = {
            "usvs": 8,
            "usv_inq": 3,
            "inquiries": 3,
            "inq_tou": 1,
            "tours": 14,
        }
        self.kpis_healths = {
            "usvs": 2,
            "usv_inq": -1,
            "inquiries": 0,
            "inq_tou": 2,
            "tours": 2,
        }

    def test_kpi_is_none(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths,
            None,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_target_kpi_is_none(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths, self.computed_kpis, None, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_all_kpi_is_none(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths, None, None, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_kpi_is_empty(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths, {}, self.target_computed_kpis, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_target_kpi_is_empty(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths, self.computed_kpis, {}, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_all_kpi_is_empty(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths, {}, {}, HEALTH_STATUS["OFF_TRACK"]
        )
        self.assertIsNone(result)

    def test_kpis_healths_is_none(self):
        result = var_kpi_without_mitigated(
            None,
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_kpis_healths_is_empty(self):
        result = var_kpi_without_mitigated(
            {},
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertIsNone(result)

    def test_have_kpi(self):
        result = var_kpi_without_mitigated(
            self.kpis_healths,
            self.computed_kpis,
            self.target_computed_kpis,
            HEALTH_STATUS["OFF_TRACK"],
        )
        self.assertEqual(result, "inquiries")

    def test_have_many_mitigation_kpi(self):
        computed_kpis = self.computed_kpis.copy()
        computed_kpis["tou_app"] = 0
        computed_kpis["lease_applications"] = 5
        computed_kpis["tours"] = 14
        target_computed_kpis = self.target_computed_kpis.copy()
        target_computed_kpis["tou_app"] = 13
        target_computed_kpis["lease_applications"] = 5
        target_computed_kpis["tours"] = 13
        kpis_healths = self.kpis_healths.copy()
        kpis_healths["tou_app"] = 0
        kpis_healths["lease_applications"] = 2
        result = var_kpi_without_mitigated(
            kpis_healths, computed_kpis, target_computed_kpis, 0
        )
        self.assertEqual(result, "inquiries")


class VarAllBaseKPIsTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def test_one_period(self):
        create_periods(self.project, start=self.start, end=self.end)
        result = var_all_base_kpis(self.project, self.start, self.end)
        self.assertEqual(len(result), 1)
        self.assertListEqual(result, all_base_kpis[:1])

    def test_many_periods(self):
        create_periods(
            self.project, start=self.start - datetime.timedelta(weeks=1), end=self.start
        )
        create_periods(self.project, start=self.start, end=self.end)
        result = var_all_base_kpis(self.project, self.start, self.end)
        self.assertEqual(len(result), 2)
        self.assertListEqual(result, all_base_kpis)

    def test_no_periods(self):
        result = var_all_base_kpis(self.project, self.start, self.end)
        self.assertIsNone(result)


class VarAllTargetKPIsTestCase(TestCase):
    def setUp(self) -> None:
        self.project = create_project()
        self.start = datetime.date(year=2019, month=9, day=21)
        self.end = datetime.date(year=2019, month=9, day=28)

    def test_one_target_period(self):
        create_periods(self.project, start=self.start, end=self.end)
        result = var_all_target_kpis(self.project, self.start, self.end)
        self.assertEqual(len(result), 1)
        self.assertListEqual(result, all_target_kpis[:1])

    def test_many_periods(self):
        create_periods(
            self.project, start=self.start - datetime.timedelta(weeks=1), end=self.start
        )
        create_periods(self.project, start=self.start, end=self.end)
        result = var_all_target_kpis(self.project, self.start, self.end)
        self.assertEqual(len(result), 2)
        self.assertListEqual(result, all_target_kpis)

    def test_no_target_periods(self):
        result = var_all_target_kpis(self.project, self.start, self.end)
        self.assertIsNone(result)


class VarAllComputedKPIsTestCase(TestCase):
    def test_kpi_is_none(self):
        result = var_all_computed_kpis(None)
        self.assertIsNone(result)

    def test_kpi_is_empty(self):
        result = var_all_computed_kpis([])
        self.assertListEqual(result, [])

    def test_one_kpi(self):
        result = var_all_computed_kpis(all_base_kpis)
        self.assertListEqual(result, all_computed_kpis)


class VarAllTargetComputedKPIsTestCase(TestCase):
    def test_(self):
        result = var_all_target_computed_kpis(all_base_kpis, all_target_kpis)
        self.assertListEqual(result, all_target_computed_kpis)

    def test_base_kpi_is_none(self):
        result = var_all_target_computed_kpis(None, all_target_kpis)
        self.assertIsNone(result)

    def test_base_kpi_is_empty(self):
        result = var_all_target_computed_kpis([], all_target_kpis)
        self.assertListEqual(result, [])

    def test_base_target_kpi_is_none(self):
        result = var_all_target_computed_kpis(all_base_kpis, None)
        self.assertIsNone(result)

    def test_base_target_kpi_is_empty(self):
        result = var_all_target_computed_kpis(all_base_kpis, [])
        self.assertListEqual(result, [])


class VarKPIsTrendsTestCase(TestCase):
    def setUp(self) -> None:
        self.computed_kpis = [
            {"usvs": 6, "usv_inq": None, "inquiries": 0, "inq_tou": 2, "tous": 7},
            {"usvs": 5, "usv_inq": 1, "inquiries": 0, "inq_tou": 3, "tous": 4},
            {"usvs": 4, "usv_inq": 4, "inquiries": 0, "inq_tou": 4, "tous": 5},
        ]
        self.target_computed_kpis = [
            {"usvs": 8, "usv_inq": 3, "inquiries": 3, "inq_tou": 4, "tous": 8},
            {"usvs": 7, "usv_inq": 6, "inquiries": 3, "inq_tou": 3, "tous": 6},
            {"usvs": 6, "usv_inq": 5, "inquiries": 3, "inq_tou": 5, "tous": 6},
        ]
        self.kpis_names = ["usvs", "usv_inq", "inquiries", "inq_tou", "tous"]

    def test_default(self):
        result = var_kpis_trends(
            self.computed_kpis, self.target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, kpis_trends)

    def test_computed_kpi_is_none(self):
        result = var_kpis_trends(None, self.target_computed_kpis, self.kpis_names)
        self.assertIsNone(result)

    def test_computed_kpi_is_empty(self):
        result = var_kpis_trends([], self.target_computed_kpis, self.kpis_names)
        self.assertIsNone(result)

    def test_target_computed_kpis_is_none(self):
        result = var_kpis_trends(self.computed_kpis, None, self.kpis_names)
        self.assertIsNone(result)

    def test_target_computed_kpis_is_empty(self):
        result = var_kpis_trends(self.computed_kpis, {}, self.kpis_names)
        self.assertIsNone(result)

    def test_different_number_kpi(self):
        target_computed_kpis = self.target_computed_kpis.copy()
        target_computed_kpis.append(
            {"usvs": 6, "usv_inq": 5, "inquiries": 3, "inq_tou": 5, "tous": 6}
        )

        result = var_kpis_trends(
            self.computed_kpis, target_computed_kpis, self.kpis_names
        )
        self.assertDictEqual(result, kpis_trends)

    def test_kpi_not_full(self):
        kpis_names = self.kpis_names.copy()
        kpis_names.append("test_kpi")
        result = var_kpis_trends(
            self.computed_kpis, self.target_computed_kpis, kpis_names
        )
        self.assertDictEqual(result, kpis_trends)


class VarPredictingChangeHealth(TestCase):
    def setUp(self) -> None:
        self.kpis_names = ["usvs", "usv_inq", "inquiries", "inq_tou", "tous"]
        self.kpis_healths = {
            "inq_tou": -1,
            "inquiries": 0,
            "usv_inq": 2,
            "usvs": 0,
            "tous": 1,
        }

    def test_default(self):
        result = var_predicting_change_health(
            kpis_trends, self.kpis_healths, self.kpis_names
        )
        expected = {"usvs": {"health": 1, "weeks": 1}}
        self.assertDictEqual(result, expected)

    def test_kpis_trends_is_none(self):
        result = var_predicting_change_health(None, self.kpis_healths, self.kpis_names)
        self.assertIsNone(result)

    def test_kpis_trends_is_empty(self):
        result = var_predicting_change_health({}, self.kpis_healths, self.kpis_names)
        self.assertDictEqual(result, {})

    def test_kpis_healths_is_none(self):
        result = var_predicting_change_health(kpis_trends, None, self.kpis_names)
        self.assertIsNone(result)

    def test_kpis_healths_is_empty(self):
        result = var_predicting_change_health(kpis_trends, {}, self.kpis_names)
        self.assertDictEqual(result, {})


class VarPredictedKPITestCase(TestCase):
    def setUp(self) -> None:
        self.predicting_change_health = {"usvs": {"health": 1, "weeks": 2}}

    def test_one_prediction(self):
        result = var_predicted_kpi(self.predicting_change_health, kpis_trends)
        expected = {
            "name": "usvs",
            "trend": "up",
            "weeks": 3,
            "predicted_weeks": 2,
            "predicted_health": 1,
        }
        self.assertDictEqual(result, expected)

    def test_many_prediction(self):
        predicting_change_health = self.predicting_change_health.copy()
        predicting_change_health["usv_inq"] = {"health": 0, "weeks": 1}
        result = var_predicted_kpi(predicting_change_health, kpis_trends)
        expected = {
            "name": "usv_inq",
            "trend": "down",
            "weeks": 3,
            "predicted_weeks": 1,
            "predicted_health": 0,
        }
        self.assertDictEqual(result, expected)

    def test_prediction_is_none(self):
        result = var_predicted_kpi(None, kpis_trends)
        self.assertIsNone(result)

    def test_prediction_is_empty(self):
        result = var_predicted_kpi({}, kpis_trends)
        self.assertIsNone(result)

    def test_kpis_trends_is_none(self):
        result = var_predicted_kpi(self.predicting_change_health, None)
        self.assertIsNone(result)

    def test_kpis_trends_is_empty(self):
        result = var_predicted_kpi(self.predicting_change_health, {})
        self.assertIsNone(result)
