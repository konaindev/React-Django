from .errors import InvalidMetricOperation
from .metric import MetricBase
from .timevalue import TimeValue


class PointMetricBase(MetricBase):
    """
    Base class for all point-in-time metrics. Point-in-time metrics
    operate on TimeValues where tv.start == tv.end.
    """

    def check_is_point_in_time(self, time_value):
        """Raise an exception if a TimeValue is not point-in-time."""
        if time_value.start != time_value.end:
            raise InvalidMetricOperation(
                f"PointMetricBase.check_is_point_in_time: {time_value.start} and {time_value.end} differ"
            )


class PointMetric(MetricBase):
    """
    The default metric implementation for point-in-time values. 

    This class generally assumes that the 'value' for a metric at an arbitrary
    point in time `t` is whichever declared time value that comes at, or
    immediately preceeding, `t`.
    """

    def perform_merge(self, time_values):
        """
        Return the earliest time_value from the merge.
        """
        return TimeValue(*time_values[0])

    def perform_separate(self, when, time_value):
        """
        Keep the same value on both sides of the split.
        """
        left = TimeValue(start=when, end=when, value=time_value.value)
        right = TimeValue(start=when, end=when, value=time_value.value)
        return (left, right)

    def perform_unify(self, start, end, time_values):
        """
        Return the value that occurs at, or immediately before, the timespan.
        """
        time_value = (
            time_values.filter(start__lte=start).order_by_start().last_non_null()
        )
        return time_value.value if time_value else None
