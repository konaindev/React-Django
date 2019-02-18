import datetime
import decimal
import json
import os.path

from django.test import TestCase

from .metrics import (
    BareMultiPeriod,
    BarePeriod,
    Behavior,
    DateSequence,
    InvalidMetricOperation,
    Metric,
    TimeValue,
    TimeValueCollection,
    Weekday
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
DATE_F = datetime.date(year=2019, month=2, day=3)


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


class DispositionTestCase(TestCase):
    """Test mapping of Behavior to time disposition"""

    def test_disposition_1(self):
        behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP
        self.assertTrue(behavior.is_point_in_time())
        self.assertFalse(behavior.is_interval())

    def test_disposition_2(self):
        behavior = Behavior.POINT_IN_TIME_LATEST_KEEP
        self.assertTrue(behavior.is_point_in_time())
        self.assertFalse(behavior.is_interval())

    def test_disposition_3(self):
        behavior = Behavior.INTERVAL_SUM_AMORTIZE
        self.assertFalse(behavior.is_point_in_time())
        self.assertTrue(behavior.is_interval())

    def test_disposition_4(self):
        behavior = Behavior.INTERVAL_AVERAGE_KEEP
        self.assertFalse(behavior.is_point_in_time())
        self.assertTrue(behavior.is_interval())


class MergeMethodTestCase(TestCase):
    """Test mapping of Behavior to merge method"""

    def test_merge_method_1(self):
        behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP
        self.assertTrue(behavior.is_merge_earliest())
        self.assertFalse(behavior.is_merge_latest())
        self.assertFalse(behavior.is_merge_sum())
        self.assertFalse(behavior.is_merge_average())

    def test_merge_method_2(self):
        behavior = Behavior.POINT_IN_TIME_LATEST_KEEP
        self.assertFalse(behavior.is_merge_earliest())
        self.assertTrue(behavior.is_merge_latest())
        self.assertFalse(behavior.is_merge_sum())
        self.assertFalse(behavior.is_merge_average())

    def test_merge_method_3(self):
        behavior = Behavior.INTERVAL_SUM_AMORTIZE
        self.assertFalse(behavior.is_merge_earliest())
        self.assertFalse(behavior.is_merge_latest())
        self.assertTrue(behavior.is_merge_sum())
        self.assertFalse(behavior.is_merge_average())

    def test_merge_method_4(self):
        behavior = Behavior.INTERVAL_AVERAGE_KEEP
        self.assertFalse(behavior.is_merge_earliest())
        self.assertFalse(behavior.is_merge_latest())
        self.assertFalse(behavior.is_merge_sum())
        self.assertTrue(behavior.is_merge_average())


class SeparateMethodTestCase(TestCase):
    """Test mapping of Behavior to separate method"""

    def test_separate_method_1(self):
        behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP
        self.assertTrue(behavior.is_separate_keep())
        self.assertFalse(behavior.is_separate_amortize())

    def test_separate_method_2(self):
        behavior = Behavior.POINT_IN_TIME_LATEST_KEEP
        self.assertTrue(behavior.is_separate_keep())
        self.assertFalse(behavior.is_separate_amortize())

    def test_separate_method_3(self):
        behavior = Behavior.INTERVAL_SUM_AMORTIZE
        self.assertFalse(behavior.is_separate_keep())
        self.assertTrue(behavior.is_separate_amortize())

    def test_separate_method_4(self):
        behavior = Behavior.INTERVAL_AVERAGE_KEEP
        self.assertTrue(behavior.is_separate_keep())
        self.assertFalse(behavior.is_separate_amortize())


class SeparateKeepTestCase(TestCase):
    """Test the implementation of separate_keep under various conditions."""

    def test_separate_keep(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        value = TimeValue(DATE_A, DATE_A, 42)
        left, right = metric.separate(DATE_B, value)
        self.assertEqual(left, right)
        self.assertEqual(left.value, 42)
        self.assertEqual(left.start, left.end)
        self.assertEqual(left.start, DATE_B)


class SeparateAmortizeTestCase(TestCase):
    """Test the implementation of SeparateMethod.AMORTIZE under various conditions."""

    def test_integer(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = TimeValue(DATE_A, DATE_C, 5)
        left, right = metric.separate(DATE_B, value)

        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, 2)

        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, 3)

    def test_float(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = TimeValue(DATE_A, DATE_C, 5.0)
        left, right = metric.separate(DATE_B, value)

        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, 2.5)

        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, 2.5)

    def test_decimal(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = TimeValue(DATE_A, DATE_C, decimal.Decimal("5"))
        left, right = metric.separate(DATE_B, value)

        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, decimal.Decimal("2.5"))

        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, decimal.Decimal("2.5"))

    def test_invalid_dates(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = TimeValue(DATE_A, DATE_B, decimal.Decimal("5"))

        with self.assertRaises(InvalidMetricOperation):
            left, right = metric.separate(DATE_C, value)

    def test_null_values(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = TimeValue(DATE_A, DATE_C, None)
        left, right = metric.separate(DATE_B, value)

        self.assertEqual(left.start, DATE_A)
        self.assertEqual(left.end, DATE_B)
        self.assertEqual(left.value, None)

        self.assertEqual(right.start, DATE_B)
        self.assertEqual(right.end, DATE_C)
        self.assertEqual(right.value, None)


class MergeEarliestTestCase(TestCase):
    """Test the implementation of MergeMethod.EARLIEST under various conditions."""

    def test_integer(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        v1 = TimeValue(DATE_A, DATE_A, 1)
        v2 = TimeValue(DATE_B, DATE_B, 2)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, 1)

    def test_integer_many(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        v1 = TimeValue(DATE_C, DATE_C, 1)
        v2 = TimeValue(DATE_B, DATE_B, 2)
        v3 = TimeValue(DATE_A, DATE_A, 42)
        value = metric.merge(v1, v2, v3)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, 42)

    def test_integer_none(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        v1 = TimeValue(DATE_A, DATE_A, None)
        v2 = TimeValue(DATE_B, DATE_B, 2)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_A)
        self.assertEqual(value.value, None)


class MergeLatestTestCase(TestCase):
    """Test the implementation of MergeMethod.LATEST under various conditions."""

    def test_integer(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        v1 = TimeValue(DATE_A, DATE_A, 1)
        v2 = TimeValue(DATE_B, DATE_B, 2)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_B)
        self.assertEqual(value.end, DATE_B)
        self.assertEqual(value.value, 2)

    def test_integer_many(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        v1 = TimeValue(DATE_A, DATE_A, 1)
        v2 = TimeValue(DATE_B, DATE_B, 2)
        v3 = TimeValue(DATE_C, DATE_C, 42)
        value = metric.merge(v1, v2, v3)

        self.assertEqual(value.start, DATE_C)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 42)

    def test_integer_none(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        v1 = TimeValue(DATE_A, DATE_A, 1)
        v2 = TimeValue(DATE_B, DATE_B, None)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_B)
        self.assertEqual(value.end, DATE_B)
        self.assertEqual(value.value, None)


class MergeSumTestCase(TestCase):
    """Test the implementation of MergeMethod.SUM under various conditions."""

    def test_integer(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 3)

    def test_integer_many(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        value = metric.merge(v1, v2, v3)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 6)

    def test_float(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 1.1)
        v2 = TimeValue(DATE_B, DATE_C, 2.1)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 3.2)

    def test_decimal(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, decimal.Decimal("1.1"))
        v2 = TimeValue(DATE_B, DATE_C, decimal.Decimal("2.1"))
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, decimal.Decimal("3.2"))

    def test_none(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, None)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, None)


class MergeAverageTestCase(TestCase):
    """Test the implementation of MergeMethod.AVERAGE under various conditions."""

    def test_integer(self):
        metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = TimeValue(DATE_A, DATE_B, 0)
        v2 = TimeValue(DATE_B, DATE_C, 10)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 5)

    def test_integer_many(self):
        metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = TimeValue(DATE_A, DATE_B, 0)
        v2 = TimeValue(DATE_B, DATE_C, 10)
        v3 = TimeValue(DATE_C, DATE_D, 101)
        value = metric.merge(v1, v2, v3)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 37)

    def test_float(self):
        metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = TimeValue(DATE_A, DATE_B, 0.5)
        v2 = TimeValue(DATE_B, DATE_C, 10.5)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 5.5)

    def test_decimal(self):
        metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = TimeValue(DATE_A, DATE_B, decimal.Decimal("0.5"))
        v2 = TimeValue(DATE_B, DATE_C, decimal.Decimal("10.5"))
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, decimal.Decimal("5.5"))

    def test_none(self):
        metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)
        v1 = TimeValue(DATE_A, DATE_B, None)
        v2 = TimeValue(DATE_B, DATE_C, 10)
        value = metric.merge(v1, v2)

        self.assertEqual(value.start, DATE_A)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, None)


class MergeErrorsTestCase(TestCase):
    """Test various expected preconditions for any merge."""

    def test_overlapping_date_ranges_interval(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_D, 0)
        v2 = TimeValue(DATE_C, DATE_D, 10)
        with self.assertRaises(InvalidMetricOperation):
            metric.merge(v1, v2)


class UnifyTestCase(TestCase):
    """Test the implementation of Metric.unify()"""

    def test_pit_earliest_1(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        v1 = TimeValue(DATE_B, DATE_B, 1)
        v2 = TimeValue(DATE_C, DATE_C, 2)
        value = metric.unify(DATE_BC, DATE_CD, v1, v2)
        self.assertEqual(value, 1)

    def test_pit_earliest_2(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        v1 = TimeValue(DATE_B, DATE_B, 1)
        v2 = TimeValue(DATE_C, DATE_C, 2)
        value = metric.unify(DATE_A, DATE_C, v1, v2)
        self.assertEqual(value, None)

    def test_pit_earliest_no_values(self):
        metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        value = metric.unify(DATE_A, DATE_C)
        self.assertEqual(value, None)

    def test_pit_latest_1(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        v1 = TimeValue(DATE_B, DATE_B, 1)
        v2 = TimeValue(DATE_C, DATE_C, 2)
        value = metric.unify(DATE_BC, DATE_CD, v1, v2)
        self.assertEqual(value, None)

    def test_pit_latest_2(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        v1 = TimeValue(DATE_B, DATE_B, 1)
        v2 = TimeValue(DATE_C, DATE_C, 2)
        value = metric.unify(DATE_A, DATE_BC, v1, v2)
        self.assertEqual(value, 2)

    def test_pit_latest_no_values(self):
        metric = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        value = metric.unify(DATE_A, DATE_C)
        self.assertEqual(value, None)

    def test_interval_no_values(self):
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        value = metric.unify(DATE_A, DATE_C)
        self.assertEqual(value, None)

    def test_interval_1(self):
        # Single value, fully within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_B, DATE_C, 1)
        value = metric.unify(DATE_A, DATE_D, v1)
        self.assertEqual(value, 1)

    def test_interval_2(self):
        # Single value, ends within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_B, DATE_C, 10)
        value = metric.unify(DATE_BC, DATE_D, v1)
        self.assertEqual(value, 4)

    def test_interval_3(self):
        # Single value, starts within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_C, DATE_E, 10)
        value = metric.unify(DATE_BC, DATE_D, v1)
        self.assertEqual(value, 5)

    def test_interval_4(self):
        # Single value, contained within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_C, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_DE, v1)
        self.assertEqual(value, 10)

    def test_interval_5(self):
        # Single value, starts before and ends after timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_CD, v1)
        self.assertEqual(value, 4)

    def test_interval_6(self):
        # Single value, starts before and ends after timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_CD, v1)
        self.assertEqual(value, 4)

    def test_interval_7(self):
        # Multiple values, intersecting timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 10)
        v2 = TimeValue(DATE_B, DATE_C, 10)
        v3 = TimeValue(DATE_C, DATE_D, 10)
        value = metric.unify(DATE_AB, DATE_CD, v1, v2, v3)
        self.assertEqual(value, 22)


class TimeValueCollectionTestCase(TestCase):
    def test_content(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        tvc = TimeValueCollection([v1, v2])
        self.assertEqual(list(tvc), [v1, v2])

    def test_len(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        tvc = TimeValueCollection([v1, v2])
        self.assertEqual(len(tvc), 2)

    def test_getitem(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(tvc[0], v1)
        self.assertEqual(tvc[-1], v3)
        self.assertEqual(tvc[1:-1], [v2])
        self.assertEqual(tvc[1:], [v2, v3])

    def test_first(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(tvc.first(), v1)

    def test_first_none(self):
        tvc = TimeValueCollection([])
        self.assertEqual(tvc.first(), None)

    def test_last(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(tvc.last(), v3)

    def test_last_none(self):
        tvc = TimeValueCollection([])
        self.assertEqual(tvc.last(), None)

    def test_order_by_start(self):
        v1 = TimeValue(DATE_B, DATE_C, 2)
        v2 = TimeValue(DATE_C, DATE_D, 3)
        v3 = TimeValue(DATE_A, DATE_B, 1)
        tvc = TimeValueCollection([v1, v2, v3])
        tvc = tvc.order_by_start()
        self.assertEqual(list(tvc), [v3, v1, v2])

    def test_order_by_end(self):
        v1 = TimeValue(DATE_B, DATE_C, 2)
        v2 = TimeValue(DATE_C, DATE_B, 3)
        v3 = TimeValue(DATE_A, DATE_D, 1)
        tvc = TimeValueCollection([v1, v2, v3])
        tvc = tvc.order_by_end()
        self.assertEqual(list(tvc), [v2, v1, v3])

    def test_filter_start_single(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(list(tvc.filter(start__gt=DATE_B)), [v3])
        self.assertEqual(list(tvc.filter(start__gte=DATE_B)), [v2, v3])
        self.assertEqual(list(tvc.filter(start__gt=DATE_C)), [])
        self.assertEqual(list(tvc.filter(start__lt=DATE_B)), [v1])
        self.assertEqual(list(tvc.filter(start__lte=DATE_B)), [v1, v2])
        self.assertEqual(list(tvc.filter(start__lt=DATE_A)), [])

    def test_filter_end_single(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(list(tvc.filter(end__gt=DATE_B)), [v2, v3])
        self.assertEqual(list(tvc.filter(end__gte=DATE_B)), [v1, v2, v3])
        self.assertEqual(list(tvc.filter(end__gt=DATE_C)), [v3])
        self.assertEqual(list(tvc.filter(end__lt=DATE_B)), [])
        self.assertEqual(list(tvc.filter(end__lte=DATE_B)), [v1])
        self.assertEqual(list(tvc.filter(end__lt=DATE_A)), [])

    def test_filter_start_multiple(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(list(tvc.filter(start__gt=DATE_B, start__lt=DATE_D)), [v3])
        self.assertEqual(list(tvc.filter(start__gt=DATE_B, start__gte=DATE_D)), [])

    def test_filter_end_multiple(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(list(tvc.filter(end__gt=DATE_B, end__lt=DATE_D)), [v2])
        self.assertEqual(list(tvc.filter(end__gt=DATE_B, end__gte=DATE_E)), [])

    def test_filter_start_and_end(self):
        v1 = TimeValue(DATE_A, DATE_B, 1)
        v2 = TimeValue(DATE_B, DATE_C, 2)
        v3 = TimeValue(DATE_C, DATE_D, 3)
        tvc = TimeValueCollection([v1, v2, v3])
        self.assertEqual(list(tvc.filter(start__gt=DATE_A, end__lt=DATE_D)), [v2])
        self.assertEqual(
            list(tvc.filter(start__gte=DATE_A, end__lte=DATE_D).order_by_start()),
            [v1, v2, v3],
        )

    def test_overlaps(self):
        start = DATE_BC
        end = DATE_DE
        # For overlaps, there are six cases to consider
        v1 = TimeValue(DATE_A, DATE_B, 1)  # starts before; ends before
        v2 = TimeValue(DATE_B, DATE_C, 2)  # starts before; ends within
        v3 = TimeValue(DATE_C, DATE_D, 3)  # starts within; ends within
        v4 = TimeValue(DATE_D, DATE_E, 4)  # starts within; ends after
        v5 = TimeValue(DATE_E, DATE_F, 5)  # starts after ; ends after
        v6 = TimeValue(DATE_A, DATE_E, 6)  # starts before; ends after
        tvc = TimeValueCollection([v1, v2, v3, v4, v5, v6])
        tvc_overlaps = tvc.overlaps(start, end).order_by_start()
        self.assertEqual(list(tvc_overlaps), [v6, v2, v3, v4])


class BareMultiPeriodTestCase(TestCase):
    """Test basic aspects of BareMultiPeriod"""

    def test_start(self):
        mp = BareMultiPeriod(start=1, end=None, metrics={}, time_values={})
        self.assertEqual(mp.get_start(), 1)

    def test_end(self):
        mp = BareMultiPeriod(start=None, end=2, metrics={}, time_values={})
        self.assertEqual(mp.get_end(), 2)

    def test_get_metric_names(self):
        mp = BareMultiPeriod(start=None, end=None, metrics={"a": 1}, time_values={})
        self.assertEqual(mp.get_metric_names(), ["a"])

    def test_get_metrics(self):
        mp = BareMultiPeriod(start=None, end=None, metrics={"a": 1}, time_values={})
        self.assertEqual(mp.get_metrics(), {'a': 1})

    def test_get_metric(self):
        mp = BareMultiPeriod(start=None, end=None, metrics={"a": 1}, time_values={})
        self.assertEqual(mp.get_metric("a"), 1)

    def test_get_metric_none(self):
        mp = BareMultiPeriod(start=None, end=None, metrics={"a": 1}, time_values={})
        self.assertEqual(mp.get_metric("b"), None)

    def test_get_all_time_value_collections(self):
        mp = BareMultiPeriod(
            start=None, end=None, metrics={}, time_values={"a": [1, 2]}
        )
        self.assertEqual(
            mp.get_all_time_value_collections(), {"a": TimeValueCollection([1, 2])}
        )

    def test_get_time_value_collection(self):
        mp = BareMultiPeriod(
            start=None, end=None, metrics={}, time_values={"a": [1, 2]}
        )
        self.assertEqual(mp.get_time_value_collection("a"), TimeValueCollection([1, 2]))

    def test_get_time_value_collection_none(self):
        mp = BareMultiPeriod(
            start=None, end=None, metrics={}, time_values={"a": [1, 2]}
        )
        with self.assertRaises(Exception):
            mp.get_time_value_collection("b")

    def test_only(self):
        mp = BareMultiPeriod(
            start=None, end=None, metrics={"a": "a metric", "b": "b metric", "c": "c metric"}, time_values={"a": [1, 2], "b": [10, 20], "c": [100, 200]}
        )
        mp_only = mp.only("a", "c")
        self.assertEquals(set(mp_only.get_metric_names()), set(["a", "c"]))


class DateSequenceTestCase(TestCase):
    def test_for_time_delta(self):
        dates = DateSequence.for_time_delta(DATE_B, DATE_BC, datetime.timedelta(days=3))
        dates = list(dates)
        self.assertEqual(len(dates), 3)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=8), datetime.date(year=2019, month=1, day=11), datetime.date(year=2019, month=1, day=14)])

    def test_for_time_delta_no_after_end(self):
        dates = DateSequence.for_time_delta(DATE_B, DATE_BC, datetime.timedelta(days=3), after_end=False)
        dates = list(dates)
        self.assertEqual(len(dates), 2)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=8), datetime.date(year=2019, month=1, day=11)])

    def test_for_weeks(self):
        dates = DateSequence.for_weeks(DATE_B, DATE_D)
        dates = list(dates)
        self.assertEqual(len(dates), 3)
        self.assertEqual(dates, [DATE_B, DATE_C, DATE_D])
    
    def test_for_weeks_no_after_end(self):
        dates = DateSequence.for_weeks(DATE_B, DATE_D, after_end=False)
        dates = list(dates)
        self.assertEqual(len(dates), 2)
        self.assertEqual(dates, [DATE_B, DATE_C])
    
    def test_for_weeks_weekday(self):
        dates = DateSequence.for_weeks(DATE_B, DATE_C, weekday=Weekday.SUNDAY)
        dates = list(dates)
        self.assertEqual(len(dates), 3)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=6), datetime.date(year=2019, month=1, day=13), datetime.date(year=2019, month=1, day=20)])

    def test_for_weeks_weekday_no_before_start(self):
        dates = DateSequence.for_weeks(DATE_B, DATE_C, weekday=Weekday.SUNDAY, before_start=False)
        dates = list(dates)
        self.assertEqual(len(dates), 2)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=13), datetime.date(year=2019, month=1, day=20)])

    def test_for_calendar_months(self):
        dates = DateSequence.for_calendar_months(DATE_B, DATE_F)
        dates = list(dates)
        self.assertEqual(len(dates), 3)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=1), datetime.date(year=2019, month=2, day=1), datetime.date(year=2019, month=3, day=1)])
    
    def test_for_calendar_months_no_after_end(self):
        dates = DateSequence.for_calendar_months(DATE_B, DATE_F, after_end=False)
        dates = list(dates)
        self.assertEqual(len(dates), 2)
        self.assertEqual(dates, [datetime.date(year=2019, month=1, day=1), datetime.date(year=2019, month=2, day=1)])
    
    def test_for_calendar_months_no_before_start(self):
        dates = DateSequence.for_calendar_months(DATE_B, DATE_F, before_start=False)
        dates = list(dates)
        self.assertEqual(len(dates), 2)
        self.assertEqual(dates, [datetime.date(year=2019, month=2, day=1), datetime.date(year=2019, month=3, day=1)])


class MultiPeriodTestCase(TestCase):
    """Test basic functionality in the MultiPeriodBase implementation."""

    def setUp(self):
        """
        Craft a bunch of useful test data.
        """
        super().setUp()

        self.start = DATE_AB
        self.end = DATE_DE

        self.m_e = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)
        self.v_e1 = TimeValue(DATE_A, DATE_A, 1)
        self.v_e2 = TimeValue(DATE_C, DATE_C, 2)
        self.v_e3 = TimeValue(DATE_E, DATE_E, 3)

        self.m_l = Metric(Behavior.POINT_IN_TIME_LATEST_KEEP)
        self.v_l1 = TimeValue(DATE_A, DATE_A, 10)
        self.v_l2 = TimeValue(DATE_C, DATE_C, 20)
        self.v_l3 = TimeValue(DATE_E, DATE_E, 30)

        self.m_i = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        self.v_i1 = TimeValue(DATE_A, DATE_B, 100)
        self.v_i2 = TimeValue(DATE_B, DATE_C, 200)
        self.v_i3 = TimeValue(DATE_C, DATE_D, 300)
        self.v_i4 = TimeValue(DATE_D, DATE_E, 400)

        self.metrics = {"m_e": self.m_e, "m_l": self.m_l, "m_i": self.m_i}
        self.values = {
            "m_e": [self.v_e1, self.v_e2, self.v_e3],
            "m_l": [self.v_l1, self.v_l2, self.v_l3],
            "m_i": [self.v_i1, self.v_i2, self.v_i3, self.v_i4],
        }

        self.mp = BareMultiPeriod(self.start, self.end, self.metrics, self.values)

    def test_get_periods_too_few_breaks(self):
        with self.assertRaises(InvalidMetricOperation):
            self.mp.get_periods(DATE_C)

    def test_get_periods_before_start(self):
        periods = self.mp.get_periods(DATE_A, DATE_B)
        self.assertEqual(len(periods), 1)

    def test_get_periods_after_end(self):
        periods = self.mp.get_periods(DATE_B, DATE_E)
        self.assertEqual(len(periods), 1)

    def test_get_periods_single(self):
        periods = self.mp.get_periods(self.start, self.end)
        self.assertEqual(len(periods), 1)
        self.assertEqual(periods[0].get_start(), self.start)
        self.assertEqual(periods[0].get_end(), self.end)
        self.assertEqual(periods[0].get_value('m_e'), 1)
        self.assertEqual(periods[0].get_value('m_l'), 30)
        self.assertEqual(periods[0].get_value('m_i'), 728)

    def test_get_periods_multiple(self):
        periods = self.mp.get_periods(DATE_AB, DATE_BC, DATE_CD, DATE_DE)
        self.assertEqual(len(periods), 3)
        # The sum of the m_i values should be 728
        self.assertEqual(periods[0].get_start(), DATE_AB)
        self.assertEqual(periods[0].get_end(), DATE_BC)
        self.assertEqual(periods[0].get_value('m_e'), 1)
        self.assertEqual(periods[0].get_value('m_l'), 20)
        self.assertEqual(periods[0].get_value('m_i'), 171)
        self.assertEqual(periods[1].get_start(), DATE_BC)
        self.assertEqual(periods[1].get_end(), DATE_CD)
        self.assertEqual(periods[1].get_value('m_e'), 1)
        self.assertEqual(periods[1].get_value('m_l'), 30)
        self.assertEqual(periods[1].get_value('m_i'), 257)
        self.assertEqual(periods[2].get_start(), DATE_CD)
        self.assertEqual(periods[2].get_end(), DATE_DE)
        self.assertEqual(periods[2].get_value('m_e'), 2)
        self.assertEqual(periods[2].get_value('m_l'), 30)
        self.assertEqual(periods[2].get_value('m_i'), 300)

    def test_get_delta_periods(self):
        periods = self.mp.get_delta_periods(time_delta=datetime.timedelta(days=2))
        self.assertEqual(len(periods), 11)
        
    def test_get_week_periods(self):
        periods = self.mp.get_week_periods()
        self.assertEqual(len(periods), 3)

    def test_get_calendar_month_periods(self):
        periods = self.mp.get_calendar_month_periods()
        self.assertEqual(len(periods), 1)
    
    def test_get_cumulative_period(self):
        period = self.mp.get_cumulative_period()
        self.assertEqual(period.get_start(), self.start)
        self.assertEqual(period.get_end(), self.end)


class TestDataTestCase(TestCase):
    """
    A set of test cases that look much closer to 'integration'-style
    tests than they do to unit tests. They typically load a large body
    of data across a wide timespan and then perform complex manipulations
    to ensure sanity prevails.
    """
    # These tests are all based on the content found in metrics_test_data.json.
    #
    # The metrics_test_data file is a custom format: it's not a dumpdata, 
    # because we want our data to remain independent of the database
    # (the metrics library is quite happy as an in-memory-only library);
    # it's not pickle because I feel that things are still shifting underfoot.
    TEST_DATA_FILE_NAME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "metrics_test_data.json")

    def _load_test_data(self, file_name=TEST_DATA_FILE_NAME):
        # CONSIDER whether we want to promote this, or something like it,
        # out of test and into lib/metrics itself?
        from pydoc import locate
        with open(file_name, "rt") as test_data_file:
            jsonable = json.load(test_data_file)
        metrics = {name: Metric(behavior=Behavior[behavior_name]) for name, behavior_name in jsonable.get("metrics", {}).items()}
        metric_types = {name: locate(type_name) for name, type_name in jsonable.get("metric_types", {}).items()}

        def _make_period(period_jsonable):
            start = datetime.datetime.strptime(period_jsonable["start"], "%Y-%m-%d").date()
            end = datetime.datetime.strptime(period_jsonable["end"], "%Y-%m-%d").date()
            values = {name: metric_types[name](jsonable_value) if jsonable_value is not None else None for name, jsonable_value in period_jsonable.get("values", {}).items()}
            return BarePeriod(start, end, metrics, values)
        
        # Remember the 'original' periods for test purposes
        periods = [_make_period(period_jsonable) for period_jsonable in jsonable.get("periods", [])]
        self.periods = sorted(periods, key=lambda period: period.get_start())
        
        # Create a multiperiod with the baseline and all updates
        self.mp = BareMultiPeriod.from_periods(self.periods)

        # Create a multiperiod without the baseline
        self.mp2 = BareMultiPeriod.from_periods(self.periods[1:])

    def setUp(self):
        super().setUp()
        self._load_test_data()
    
    def test_week_preservation(self):
        """
        Ensure that, when requesting week periods from the multiperiod,
        we get the precise values that went *into* the multiperiod.

        This requires us to know something about the underlying test data
        (namely, that it contains a bunch of week periods starting on a Monday)
        but I've decided that's kosher in the context of these tests.
        """
        week_periods = self.mp2.get_week_periods(weekday=Weekday.MONDAY)
        self.assertEqual(len(week_periods), len(self.periods) - 1)
        for bare_period, week_period in zip(self.periods[1:], week_periods):
            self.assertEqual(bare_period.get_start(), week_period.get_start())
            self.assertEqual(bare_period.get_end(), week_period.get_end())
            self.assertEqual(bare_period.get_values(), week_period.get_values())
    
    def test_months(self):
        """
        Ensure that we get the expected number of month periods.
        """
        month_periods = self.mp.get_calendar_month_periods()
        self.assertEqual(len(month_periods), 24)
    
    def test_cumulative(self):
        """
        Ensure that we can build a cumulative period that makes sense.
        """
        cumulative_period = self.mp.get_cumulative_period()
        self.assertEqual(cumulative_period.get_start(), self.mp.get_start())
        self.assertEqual(cumulative_period.get_end(), self.mp.get_end())


