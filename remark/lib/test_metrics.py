import datetime
import decimal

from django.test import TestCase

from .metrics import (
    Metric,
    TimeValue,
    TimeValueCollection,
    Behavior,
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
        self.assertEqual(value, v1)

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
        self.assertEqual(value, v2)

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
        self.assertEqual(value.start, DATE_B)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 1)

    def test_interval_2(self):
        # Single value, ends within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_B, DATE_C, 10)
        value = metric.unify(DATE_BC, DATE_D, v1)
        self.assertEqual(value.start, DATE_BC)
        self.assertEqual(value.end, DATE_C)
        self.assertEqual(value.value, 4)

    def test_interval_3(self):
        # Single value, starts within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_C, DATE_E, 10)
        value = metric.unify(DATE_BC, DATE_D, v1)
        self.assertEqual(value.start, DATE_C)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 5)

    def test_interval_4(self):
        # Single value, contained within timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_C, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_DE, v1)
        self.assertEqual(value.start, DATE_C)
        self.assertEqual(value.end, DATE_D)
        self.assertEqual(value.value, 10)

    def test_interval_5(self):
        # Single value, starts before and ends after timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_CD, v1)
        self.assertEqual(value.start, DATE_BC)
        self.assertEqual(value.end, DATE_CD)
        self.assertEqual(value.value, 4)

    def test_interval_6(self):
        # Single value, starts before and ends after timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_D, 10)
        value = metric.unify(DATE_BC, DATE_CD, v1)
        self.assertEqual(value.start, DATE_BC)
        self.assertEqual(value.end, DATE_CD)
        self.assertEqual(value.value, 4)

    def test_interval_7(self):
        # Multiple values, intersecting timeframe
        metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)
        v1 = TimeValue(DATE_A, DATE_B, 10)
        v2 = TimeValue(DATE_B, DATE_C, 10)
        v3 = TimeValue(DATE_C, DATE_D, 10)
        value = metric.unify(DATE_AB, DATE_CD, v1, v2, v3)
        self.assertEqual(value.start, DATE_AB)
        self.assertEqual(value.end, DATE_CD)
        self.assertEqual(value.value, 22)


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

