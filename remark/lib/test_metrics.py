import datetime
import decimal

from django.test import TestCase

from .metrics import (
    Metric,
    Value,
    Behavior,
    Kind,
    Disposition,
    MergeMethod,
    SeparateMethod,
    InvalidMetricOperation,
)


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
        return Metric(name, kind, behavior)

    def create_value(self, metric, start, end, value):
        return Value(metric, start, end, value)


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

