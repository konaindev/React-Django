import datetime
import decimal

from django.test import TestCase

from .models import Period, Project
from .reports import Report
from .metrics import (
    BareMetric,
    BareValue,
    Behavior,
    Kind,
    Disposition,
    MergeMethod,
    SeparateMethod,
    InvalidMetricOperation,
)


class DefaultPeriodTestCase(TestCase):
    """
    Test basic period model computed properties on a default Period.
    """

    def setUp(self):
        project = Project.objects.create(name="test")
        self.period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=19),
        )

    def test_net_lease_change(self):
        self.assertEqual(self.period.net_lease_change, 0)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 0)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 0)

    def test_lease_rate(self):
        self.assertEqual(self.period.leased_rate, 0)

    def test_usvs_to_inquiries_percent(self):
        self.assertEqual(self.period.usvs_to_inquiries_percent, 0)

    def test_inquiries_to_tours_percent(self):
        self.assertEqual(self.period.inquiries_to_tours_percent, 0)

    def test_tours_to_lease_applications_percent(self):
        self.assertEqual(self.period.tours_to_lease_applications_percent, 0)

    def test_lease_applications_to_leases_executed_percent(self):
        self.assertEqual(self.period.lease_applications_to_leases_executed_percent, 0)

    def test_marketing_investment(self):
        self.assertEqual(self.period.marketing_investment, 0)

    def test_estimated_monthly_revenue_change(self):
        self.assertEqual(self.period.estimated_monthly_revenue_change, 0)

    def test_estimated_annual_revenue_change(self):
        self.assertEqual(self.period.estimated_annual_revenue_change, 0)

    def test_return_on_marketing_investment(self):
        self.assertEqual(self.period.return_on_marketing_investment, 0)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, 0)

    def test_cost_per_inquiry(self):
        self.assertEqual(self.period.cost_per_inquiry, 0)

    def test_cost_per_tour(self):
        self.assertEqual(self.period.cost_per_tour, 0)

    def test_cost_per_lease_application(self):
        self.assertEqual(self.period.cost_per_lease_application, 0)

    def test_cost_per_lease_execution(self):
        self.assertEqual(self.period.cost_per_lease_execution, 0)


class LincolnTowerPeriodTestCase(TestCase):
    """Test basic period model computed properties."""

    def setUp(self):
        project = Project.objects.create(name="test")
        self.period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=19),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            leasable_units=218,
            target_lease_percent=decimal.Decimal("0.9"),
            leases_ended=3,
            leases_renewed=0,
            investment_reputation_building=decimal.Decimal("28000"),
            investment_demand_creation=decimal.Decimal("21000"),
            investment_leasing_enablement=decimal.Decimal("11000"),
            investment_market_intelligence=decimal.Decimal("7000"),
            monthly_average_rent=decimal.Decimal("7278"),
        )

    def test_net_lease_change(self):
        self.assertEqual(self.period.net_lease_change, 3)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 107)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 196)

    def test_leased_rate(self):
        self.assertEqual(self.period.leased_rate, decimal.Decimal("0.491"))

    def test_usvs_to_inquiries_percent(self):
        self.assertEqual(
            self.period.usvs_to_inquiries_percent, decimal.Decimal("0.012")
        )

    def test_inquiries_to_tours_percent(self):
        self.assertEqual(
            self.period.inquiries_to_tours_percent, decimal.Decimal("0.725")
        )

    def test_tours_to_lease_applications_percent(self):
        self.assertEqual(
            self.period.tours_to_lease_applications_percent, decimal.Decimal("0.216")
        )

    def test_lease_applications_to_leases_executed_percent(self):
        self.assertEqual(
            self.period.lease_applications_to_leases_executed_percent,
            decimal.Decimal("0.750"),
        )

    def test_marketing_investment(self):
        self.assertEqual(self.period.marketing_investment, decimal.Decimal("67000"))

    def test_estimated_monthly_revenue_change(self):
        self.assertEqual(
            self.period.estimated_monthly_revenue_change, decimal.Decimal("21834")
        )

    def test_estimated_annual_revenue_change(self):
        self.assertEqual(
            self.period.estimated_annual_revenue_change, decimal.Decimal("262008")
        )

    def test_return_on_marketing_investment(self):
        self.assertEqual(self.period.return_on_marketing_investment, 4)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, decimal.Decimal("13.71"))

    def test_cost_per_inquiry(self):
        self.assertEqual(self.period.cost_per_inquiry, decimal.Decimal("1098.04"))

    def test_cost_per_tour(self):
        self.assertEqual(self.period.cost_per_tour, decimal.Decimal("1810.81"))

    def test_cost_per_lease_application(self):
        self.assertEqual(
            self.period.cost_per_lease_application, decimal.Decimal("8375.00")
        )

    def test_cost_per_lease_execution(self):
        self.assertEqual(
            self.period.cost_per_lease_execution, decimal.Decimal("11166.67")
        )

    def test_report_jsonable(self):
        # CONSIDER moving this to a separate location
        report = Report(self.period)
        self.assertTrue(report.to_jsonable())


# Reference dates, each a week apart from the last.
DATE_A = datetime.date(year=2019, month=1, day=1)
DATE_AB = datetime.date(year=2019, month=1, day=4)
DATE_B = datetime.date(year=2019, month=1, day=8)
DATE_BC = datetime.date(year=2019, month=1, day=12)
DATE_C = datetime.date(year=2019, month=1, day=15)
DATE_CD = datetime.date(year=2019, month=1, day=19)
DATE_D = datetime.date(year=2019, month=1, day=22)
DATE_DE = datetime.date(year=2019, month=1, day=25)
DATE_E = datetime.date(year=2019, month=1, day=29)


class AssertContainsMixin:
    def assertContains(self, collection, items):
        """
        Assert that all items in 'items' appear in the target collection.
        """
        collection_list = list(collection)
        self.assertTrue(all(item in collection_list for item in items))

    def assertContainsExactly(self, collection, items):
        """
        Assert that all items in 'items' appear in the target collection,
        and that no other items do.
        """
        collection_list = list(collection)
        self.assertEqual(len(collection_list), len(items))
        self.assertContains(collection_list, items)


class BareTestCaseMixin:
    """Utilities to test metrics and values independent of storage."""

    def create_metric(self, name, kind, behavior):
        return BareMetric(name, kind, behavior)

    def create_value(self, metric, start, end, value):
        return BareValue(metric, start, end, value)


class DispositionTestCaseMixin:
    """Test mapping of Behavior to Disposition"""

    def test_disposition_1(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        self.assertEqual(metric.disposition, Disposition.POINT_IN_TIME)

    def test_disposition_2(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        self.assertEqual(metric.disposition, Disposition.POINT_IN_TIME)

    def test_disposition_3(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        self.assertEqual(metric.disposition, Disposition.INTERVAL)

    def test_disposition_4(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        self.assertEqual(metric.disposition, Disposition.INTERVAL)


class BareDispositionTestCase(BareTestCaseMixin, DispositionTestCaseMixin, TestCase):
    pass


class MergeMethodTestCaseMixin:
    """Test mapping of Behavior to MergeMethod"""

    def test_merge_method_1(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        self.assertEqual(metric.merge_method, MergeMethod.EARLIEST)

    def test_merge_method_2(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        self.assertEqual(metric.merge_method, MergeMethod.LATEST)

    def test_merge_method_3(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        self.assertEqual(metric.merge_method, MergeMethod.SUM)

    def test_merge_method_4(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        self.assertEqual(metric.merge_method, MergeMethod.AVERAGE)


class BareMergeMethodTestCase(BareTestCaseMixin, MergeMethodTestCaseMixin, TestCase):
    pass


class SeparateMethodTestCaseMixin:
    """Test mapping of Behavior to SeparateMethod"""

    def test_separate_method_1(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        self.assertEqual(metric.separate_method, SeparateMethod.KEEP)

    def test_separate_method_2(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        self.assertEqual(metric.separate_method, SeparateMethod.KEEP)

    def test_separate_method_3(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        self.assertEqual(metric.separate_method, SeparateMethod.AMORTIZE)

    def test_separate_method_4(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        self.assertEqual(metric.separate_method, SeparateMethod.KEEP)


class BareSeparateMethodTestCaseMixin(
    BareTestCaseMixin, SeparateMethodTestCaseMixin, TestCase
):
    pass


class InvalidDateRangesTestCaseMixin:
    """Test that date ranges are sanity checked during value creation."""

    def test_point_in_time_earliest_incorrectly_spans_interval(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        with self.assertRaises(InvalidMetricOperation):
            self.create_value(metric, DATE_A, DATE_B, 42)

    def test_point_in_time_latest_incorrectly_spans_interval(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        with self.assertRaises(InvalidMetricOperation):
            self.create_value(metric, DATE_A, DATE_B, 42)

    def test_interval_incorrectly_has_no_span(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        with self.assertRaises(InvalidMetricOperation):
            self.create_value(metric, DATE_A, DATE_A, 42)


class BareInvalidDateRangesTestCase(
    BareTestCaseMixin, InvalidDateRangesTestCaseMixin, TestCase
):
    pass


class SeparateKeepTestCaseMixin:
    """Test the implementation of SeparateMethod.KEEP under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        value = self.create_value(metric, DATE_A, DATE_A, 42)
        left, right = value.separate(DATE_B, value)
        self.assertEqual(left, right)
        self.assertEqual(left.metric, metric)
        self.assertEqual(left.value, 42)
        self.assertEqual(left.start, left.end)
        self.assertEqual(left.start, DATE_B)


class BareSeparateKeepTestCase(BareTestCaseMixin, SeparateKeepTestCaseMixin, TestCase):
    pass


class SeparateAmortizeTestCaseMixin:
    """Test the implementation of SeparateMethod.AMORTIZE under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        value = self.create_value(metric, DATE_A, DATE_C, 5)
        left, right = value.separate(DATE_B, value)

        self.assertEqual(left.metric, metric)
        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, 2)

        self.assertEqual(right.metric, metric)
        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, 3)

    def test_float(self):
        metric = self.create_metric("test", Kind.FLOAT, Behavior.INTERVAL_SUM_AMORTIZE)
        value = self.create_value(metric, DATE_A, DATE_C, 5)
        left, right = value.separate(DATE_B, value)

        self.assertEqual(left.metric, metric)
        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, 2.5)

        self.assertEqual(right.metric, metric)
        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, 2.5)

    def test_decimal(self):
        metric = self.create_metric(
            "test", Kind.DECIMAL, Behavior.INTERVAL_SUM_AMORTIZE
        )
        value = self.create_value(metric, DATE_A, DATE_C, decimal.Decimal("5"))
        left, right = value.separate(DATE_B, value)

        self.assertEqual(left.metric, metric)
        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, decimal.Decimal("2.5"))

        self.assertEqual(right.metric, metric)
        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, decimal.Decimal("2.5"))

    def test_invalid_dates(self):
        metric = self.create_metric(
            "test", Kind.DECIMAL, Behavior.INTERVAL_SUM_AMORTIZE
        )
        value = self.create_value(metric, DATE_A, DATE_B, decimal.Decimal("5"))

        with self.assertRaises(InvalidMetricOperation):
            left, right = value.separate(DATE_C, value)

    def test_null_values(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        value = self.create_value(metric, DATE_A, DATE_C, None)
        left, right = value.separate(DATE_B, value)

        self.assertEqual(left.metric, metric)
        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, None)

        self.assertEqual(right.metric, metric)
        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, None)


class BareSeparateAmortizeTestCase(
    BareTestCaseMixin, SeparateAmortizeTestCaseMixin, TestCase
):
    pass


class MergeEarliestTestCaseMixin:
    """Test the implementation of MergeMethod.EARLIEST under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_A, 1)
        v2 = self.create_value(metric, DATE_B, DATE_B, 2)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, 1)

    def test_integer_many(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        v1 = self.create_value(metric, DATE_C, DATE_C, 1)
        v2 = self.create_value(metric, DATE_B, DATE_B, 2)
        v3 = self.create_value(metric, DATE_A, DATE_A, 42)
        value = v1.merge(v1, v2, v3)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, 42)

    def test_integer_none(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_EARLIEST_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_A, None)
        v2 = self.create_value(metric, DATE_B, DATE_B, 2)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, None)


class BareMergeEarliestTestCase(
    BareTestCaseMixin, MergeEarliestTestCaseMixin, TestCase
):
    pass


class MergeLatestTestCaseMixin:
    """Test the implementation of MergeMethod.LATEST under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_A, 1)
        v2 = self.create_value(metric, DATE_B, DATE_B, 2)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_B)
        self.assertEqual(value.end, DATE_B)
        self.assertEqual(value.value, 2)

    def test_integer_many(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_A, 1)
        v2 = self.create_value(metric, DATE_B, DATE_B, 2)
        v3 = self.create_value(metric, DATE_C, DATE_C, 42)
        value = v1.merge(v1, v2, v3)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_C)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 42)

    def test_integer_none(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.POINT_IN_TIME_LATEST_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_A, 1)
        v2 = self.create_value(metric, DATE_B, DATE_B, None)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_B)
        self.assertEqual(value.end, DATE_B)
        self.assertEqual(value.value, None)


class BareMergeLatestTestCaseMixin(
    BareTestCaseMixin, MergeLatestTestCaseMixin, TestCase
):
    pass


class MergeSumTestCaseMixin:
    """Test the implementation of MergeMethod.SUM under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, 1)
        v2 = self.create_value(metric, DATE_B, DATE_C, 2)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 3)

    def test_integer_many(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, 1)
        v2 = self.create_value(metric, DATE_B, DATE_C, 2)
        v3 = self.create_value(metric, DATE_C, DATE_D, 3)
        value = v1.merge(v1, v2, v3)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 6)

    def test_float(self):
        metric = self.create_metric("test", Kind.FLOAT, Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = self.create_value(metric, DATE_A, DATE_B, 1.1)
        v2 = self.create_value(metric, DATE_B, DATE_C, 2.1)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 3.2)

    def test_decimal(self):
        metric = self.create_metric(
            "test", Kind.DECIMAL, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, decimal.Decimal("1.1"))
        v2 = self.create_value(metric, DATE_B, DATE_C, decimal.Decimal("2.1"))
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, decimal.Decimal("3.2"))

    def test_none(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, 1)
        v2 = self.create_value(metric, DATE_B, DATE_C, None)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, None)


class BareMergeSumTestCase(BareTestCaseMixin, MergeSumTestCaseMixin, TestCase):
    pass


class MergeAverageTestCaseMixin:
    """Test the implementation of MergeMethod.AVERAGE under various conditions."""

    def test_integer(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, 0)
        v2 = self.create_value(metric, DATE_B, DATE_C, 10)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 5)

    def test_integer_many(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, 0)
        v2 = self.create_value(metric, DATE_B, DATE_C, 10)
        v3 = self.create_value(metric, DATE_C, DATE_D, 101)
        value = v1.merge(v1, v2, v3)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 37)

    def test_float(self):
        metric = self.create_metric("test", Kind.FLOAT, Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = self.create_value(metric, DATE_A, DATE_B, 0.5)
        v2 = self.create_value(metric, DATE_B, DATE_C, 10.5)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 5.5)

    def test_decimal(self):
        metric = self.create_metric(
            "test", Kind.DECIMAL, Behavior.INTERVAL_AVERAGE_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, decimal.Decimal("0.5"))
        v2 = self.create_value(metric, DATE_B, DATE_C, decimal.Decimal("10.5"))
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, decimal.Decimal("5.5"))

    def test_none(self):
        metric = self.create_metric(
            "test", Kind.INTEGER, Behavior.INTERVAL_AVERAGE_KEEP
        )
        v1 = self.create_value(metric, DATE_A, DATE_B, None)
        v2 = self.create_value(metric, DATE_B, DATE_C, 10)
        value = v1.merge(v1, v2)

        self.assertEqual(value.metric, metric)
        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, None)


class BareMergeAverageTestCase(BareTestCaseMixin, MergeAverageTestCaseMixin, TestCase):
    pass


class MergeErrorsTestCaseMixin:
    """Test various expected preconditions for any merge."""

    def test_mismatched_metrics(self):
        metric1 = self.create_metric(
            "test1", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        metric2 = self.create_metric(
            "test2", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric1, DATE_A, DATE_B, 0)
        v2 = self.create_value(metric2, DATE_B, DATE_C, 10)
        with self.assertRaises(InvalidMetricOperation):
            v1.merge(v1, v2)

    def test_overlapping_date_ranges_interval(self):
        metric = self.create_metric(
            "test1", Kind.INTEGER, Behavior.INTERVAL_SUM_AMORTIZE
        )
        v1 = self.create_value(metric, DATE_A, DATE_D, 0)
        v2 = self.create_value(metric, DATE_C, DATE_D, 10)
        with self.assertRaises(InvalidMetricOperation):
            v1.merge(v1, v2)


class BareMergeErrorsTestCase(BareTestCaseMixin, MergeErrorsTestCaseMixin, TestCase):
    pass

