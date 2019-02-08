import datetime
import decimal

from django.test import TestCase

from .metrics import Metric, TimeValue, Behavior, InvalidMetricOperation


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

