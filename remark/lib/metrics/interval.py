from decimal import Decimal

from remark.lib.math import sum_or_none

from .metric import MetricBase
from .errors import InvalidMetricOperation
from .timevalue import TimeValue, likely_time_value_type


class IntervalMetricBase(MetricBase):
    """
    Base class for all intervallic metrics. Intervallic metrics
    operate on TimeValues where tv.start != tv.end
    """

    def check_is_interval(self, time_value):
        """Raise an exception if a TimeValue is not intervallic."""
        if time_value.start == time_value.end:
            raise InvalidMetricOperation(
                f"IntervalMetricBase.check_is_interval: {time_value.start} and {time_value.end} are the same"
            )

    def check_merge_preconditions(self, time_values):
        super().check_merge_preconditions(time_values)

        # Ensure that no intervals overlap.
        for i in range(1, len(time_values)):
            if time_values[i - 1].end > time_values[i].start:
                raise InvalidMetricOperation(
                    f"IntervalMetricBase.check_merge_preconditions: {time_values[i-1]} and {time_values[i]}: intervals overlap."
                )

    def check_separate_preconditions(self, when, time_value):
        super().check_separate_preconditions(when, time_value)

        self.check_is_interval(time_value)

        # Ensure that the split point is within the time_value's span
        if when < time_value.start or when >= time_value.end:
            raise InvalidMetricOperation(
                f"IntervalMetricBase.check_separate_preconditions: {time_value} at {when.isoformat()}: separate time is not within value timeframe."
            )


class SumIntervalMetric(IntervalMetricBase):
    """
    A SumIntervalMetric sums values across time intervals when merging and
    assumes uniform distribution when separating.
    
    This is the simpliest, and probably most commonly needed, implementation of 
    an Interval metric. If you wish to implement different behavior (like, for
    instance, weighted averaging while merging, or a different distribution 
    function when separating), you can derive from IntervalMetricBase.
    """

    def perform_merge(self, time_values):
        """
        Merge two values by summing them. If metrics are non-contiguous,
        we treat the missing timeframes as zero-valued.
        """
        return TimeValue(
            start=time_values[0].start,
            end=time_values[-1].end,
            value=sum_or_none(*[time_value.value for time_value in time_values]),
        )

    def perform_separate(self, when, time_value):
        """
        Separate a TimeValue by assuming it is distributed uniformly over a given
        timeframe. We resolve values at a per-second granularity.
        """
        # Compute the number of seconds for each timeframe.
        total_seconds = (time_value.end - time_value.start).total_seconds()
        left_seconds = (when - time_value.start).total_seconds()

        # Separate the value, weighting for each timeframe. Ensure that
        # the sum of the resultant values is the original value.
        kind = likely_time_value_type(time_value)
        if kind == int:
            left_value = round(time_value.value * (left_seconds / total_seconds))
        elif kind == float:
            left_value = time_value.value * (left_seconds / total_seconds)
        elif kind == Decimal:
            left_value = time_value.value * (
                Decimal(left_seconds) / Decimal(total_seconds)
            )
        else:
            left_value = None

        right_value = time_value.value - left_value if left_value is not None else None

        left = TimeValue(start=time_value.start, end=when, value=left_value)
        right = TimeValue(start=when, end=time_value.end, value=right_value)

        return (left, right)

    def perform_unify(self, start, end, time_values):
        # Under unification, we must (1) find all time values that intersect the
        # target span, (2) suture the first and last, (3) merge what remains.
        # There are a few special cases here, particularly if there's only
        # one period the overlaps.
        time_values = time_values.overlaps(start, end).order_by_start()

        merge_time_values = []

        if len(time_values) == 1:
            # Zero, one, or both ends of our single value may need to be separated.
            time_value = time_values[0]
            if start >= time_value.start and start < time_value.end:
                _, time_value = self.separate(start, time_value)
            if end >= time_value.start and end < time_value.end:
                time_value, _ = self.separate(end, time_value)
            merge_time_values = [time_value]
        elif len(time_values) > 1:
            # Zero or one ends of our first value may need to be separated.
            first_time_value = time_values.first()
            if start >= first_time_value.start and start < first_time_value.end:
                _, first_time_value = self.separate(start, first_time_value)

            # Zero or one ends of our last value may need to be separated.
            last_time_value = time_values.last()
            if end >= last_time_value.start and end < last_time_value.end:
                last_time_value, _ = self.separate(end, last_time_value)

            merge_time_values = (
                [first_time_value] + time_values[1:-1] + [last_time_value]
            )

        time_value = self.merge(*merge_time_values)
        return time_value.value if time_value else None
