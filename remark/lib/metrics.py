from collections import namedtuple
from enum import Enum, auto
from decimal import Decimal

from remark.lib.math import sum_or_none, mult_or_none


class InvalidMetricOperation(Exception):
    pass


class Behavior(Enum):
    """
    Defines the behavior of a value in time.

    Conceptually, each Behavior combines three separate pieces of information:

    - Disposition
    
      Whether a Value should be considered to apply to a specific point in time
      ("number of occupied units") or to a time interval ("change in occupied units")

    - Merge method

      What to do with two values when combining time intervals

    - Separate method

      What to do with a single value when splitting a time interval into two

    See the underlying (private) definitions of Disposition, MergeMethod, and SplitMethod
    for details.

    The reason to collect these *three* things together in one Enum is because
    only a small subset of underlying combinations of Disposition/Merge/Separate
    really make sense in practice. Under the hood, we have flexibility; outwardly,
    Behavior limits this to just what is sane.
    """

    POINT_IN_TIME_EARLIEST_KEEP = auto()
    POINT_IN_TIME_LATEST_KEEP = auto()
    INTERVAL_SUM_AMORTIZE = auto()
    INTERVAL_AVERAGE_KEEP = auto()

    def describe(self):
        if self == self.POINT_IN_TIME_EARLIEST_KEEP:
            return "pit/early"
        elif self == self.POINT_IN_TIME_LATEST_KEEP:
            return "pit/late"
        elif self == self.INTERVAL_SUM_AMORTIZE:
            return "i/sum/amort"
        elif self == self.INTERVAL_AVERAGE_KEEP:
            return "i/avg"

    def is_point_in_time(self):
        """
        Return True if the value should be interpreted as meaningful at a specific point in time.
        """
        return (
            self == self.POINT_IN_TIME_EARLIEST_KEEP
            or self == self.POINT_IN_TIME_LATEST_KEEP
        )

    def is_interval(self):
        """
        Return True if the value should be interpreted as meaningful across a time span.
        """
        return self == self.INTERVAL_SUM_AMORTIZE or self == self.INTERVAL_AVERAGE_KEEP

    def is_merge_earliest(self):
        """
        Return True if, when two values are merged, the earliest should win.
        """
        return self == self.POINT_IN_TIME_EARLIEST_KEEP

    def is_merge_latest(self):
        """
        Return True if, when two values are merged, the latest should win.
        """
        return self == self.POINT_IN_TIME_LATEST_KEEP

    def is_merge_sum(self):
        """
        Return True if, when two values are merged, they should be summed.
        """
        return self == self.INTERVAL_SUM_AMORTIZE

    def is_merge_average(self):
        """
        Return True if, when two values are merged, they should be averaged
        weighted on their relative timeframes.
        """
        return self == self.INTERVAL_AVERAGE_KEEP

    def is_separate_keep(self):
        """
        Return True if, when a value is separated in time, it should be kept
        on both sides of the separation.
        """
        return self != self.INTERVAL_SUM_AMORTIZE

    def is_separate_amortize(self):
        """
        Return True if, when a value is separated in time, the two sides should
        be relative to 
        """
        return self == self.INTERVAL_SUM_AMORTIZE


# Defines a value that applies to a specific timeframe.
TimeValue = namedtuple("TimeValue", ["start", "end", "value"])


class Metric:
    def __init__(self, behavior):
        self.behavior = behavior

    def _get_likely_type(self, time_values):
        """
        Take a guess at the type of the underlying value for a set of
        time_values, if possible.

        Returns the type of the first value that isn't None; return None
        if no type can be determined.
        """
        first_value = next(
            (
                time_value.value
                for time_value in time_values
                if time_value.value is not None
            ),
            None,
        )
        return None if first_value is None else type(first_value)

    def merge(self, *time_values):
        """
        Merge an arbitrary set of TimeValues according to the metric's behavior.

        Returns a TimeValue, which contains a start and end date along with the
        raw underlying value.

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        # Sort the values based on their start dates
        time_values = list(sorted(time_values, key=lambda time_value: time_value.start))

        # Nothing to merge if there's only one value...
        if len(time_values) == 1:
            return time_values[0]

        # CONSIDER: semantically, it probably makes sense for merge(...) to enforce
        # that date ranges are contiguous for intervallic merges. In practice,
        # though, I think that's probably too much to ask of Remarkably's
        # actual dataq. So, for now, I won't enforce this. -Dave
        # Precondition: date ranges must not overlap for intervallic merges
        if self.behavior.is_interval():
            for i in range(1, len(time_values)):
                if time_values[i - 1].end > time_values[i].start:
                    raise InvalidMetricOperation(
                        f"Cannot merge {time_values[i-1]} and {time_values[i]}: intervals overlap."
                    )

        result_time_value = None

        if self.behavior.is_merge_earliest():
            result_time_value = self._merge_earliest(time_values)
        elif self.behavior.is_merge_latest():
            result_time_value = self._merge_latest(time_values)
        elif self.behavior.is_merge_sum():
            result_time_value = self._merge_sum(time_values)
        elif self.behavior.is_merge_average():
            result_time_value = self._merge_average(time_values)

        return result_time_value

    def _merge_earliest(self, time_values):
        """
        Merge two values by choosing the earliest. (That's easy!)
        """
        return TimeValue(*time_values[0])

    def _merge_latest(self, time_values):
        """
        Merge two values by choosing the latest. (Also easy!)
        """
        return TimeValue(*time_values[-1])

    def _merge_sum(self, time_values):
        """
        Merge two values by summing them.
        """
        # CONSIDER if the values are non-contiguous, we'll treat the metric
        # as zero-valued during the missing time. -Dave
        return TimeValue(
            start=time_values[0].start,
            end=time_values[-1].end,
            value=sum_or_none(*[time_value.value for time_value in time_values]),
        )

    def _merge_average(self, time_values):
        """
        Merge an arbitrary list of values by averaging them.

        Weight the average based on the percentage of total time each value
        spans.
        """
        # CONSIDER if the values are non-contiguous, we'll ignore the missing
        # time entirely. -Dave
        seconds = [
            (time_value.end - time_value.start).total_seconds()
            for time_value in time_values
        ]
        total_seconds = sum(seconds)

        # Precondition: there needs to be time!
        if total_seconds <= 0:
            raise InvalidMetricOperation("Cannot merge: zero length timeframes.")

        # Time-weighted average.
        merge_value = None

        # Sniff the underlying value type to ensure we perform the best
        # possible computation for the type.
        kind = self._get_likely_type(time_values)
        if kind == int:
            total = sum_or_none(
                *[
                    mult_or_none(time_value.value, s)
                    for time_value, s in zip(time_values, seconds)
                ]
            )
            merge_value = None if total is None else round(total / total_seconds)
        elif kind == float:
            total = sum_or_none(
                *[
                    mult_or_none(time_value.value, float(s))
                    for time_value, s in zip(time_values, seconds)
                ]
            )
            merge_value = None if total is None else (total / total_seconds)
        elif kind == Decimal:
            total = sum_or_none(
                *[
                    mult_or_none(time_value.value, Decimal(s))
                    for time_value, s in zip(time_values, seconds)
                ]
            )
            merge_value = None if total is None else (total / Decimal(total_seconds))

        return TimeValue(
            start=time_values[0].start, end=time_values[-1].end, value=merge_value
        )

    def separate(self, when, time_value):
        """
        Separate a single TimeValue into two based on an intervening time.

        Returns a tuple of TimeValues (v1, v2) where v1 ends at `when` and v2 
        begins then.

        Raises InvalidMetricOperation if the value is not separable at the
        requested time.
        """
        if self.behavior.is_interval():
            if when < time_value.start or when >= time_value.end:
                raise InvalidMetricOperation(
                    f"Cannot separate {time_value} at {when.isoformat()}: separate time is not within value timeframe."
                )

        if self.behavior.is_separate_keep():
            time_values = self._separate_keep(when, time_value)
        else:
            time_values = self._separate_amortize(when, time_value)

        return time_values

    def _separate_keep(self, when, time_value):
        """
        Separate a TimeValue by doing nothing.
        """
        if self.behavior.is_interval():
            time_values = self._separate_keep_interval(when, time_value)
        else:
            time_values = self._separate_keep_point_in_time(when, time_value)
        return time_values

    def _separate_keep_interval(self, when, time_value):
        left = TimeValue(start=time_value.start, end=when, value=time_value.value)
        right = TimeValue(start=when, end=time_value.end, value=time_value.value)
        return (left, right)

    def _separate_keep_point_in_time(self, when, time_value):
        left = TimeValue(start=when, end=when, value=time_value.value)
        right = TimeValue(start=when, end=when, value=time_value.value)
        return (left, right)

    def _separate_amortize(self, when, time_value):
        """
        Separate a TimeValue by assuming it is distributed uniformly over a given
        timeframe. We resolve values at a per-second granularity.
        """
        total_seconds = (time_value.end - time_value.start).total_seconds()
        left_seconds = (when - time_value.start).total_seconds()

        if not total_seconds:
            raise InvalidMetricOperation(
                f"Cannot separate {time_value} at {when.isoformat()}: zero length timeframes."
            )

        # Separate the value, weighting for each timeframe. Ensure that
        # the sum of the resultant values is the original value.
        kind = self._get_likely_type([time_value])
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


class PeriodBase:
    """
    A Period represents a set of named values that share a common
    time span. In each Period, there is exactly one value per name.
    """

    def get_start(self):
        """
        Return the start time (inclusive) for this Period.

        Derived classes can implement this as they see fit.
        """
        raise NotImplementedError()

    def get_end(self):
        """
        Return the end time (exclusive) for this Period.

        Derived classes can implement this as they see fit.
        """
        raise NotImplementedError()

    def get_metric_names(self):
        """
        Return an iterable of all metric names in this period.
        """
        raise NotImplementedError()

    def get_metric(self, name):
        """
        Return a (capital) Metric for the specified name.

        If no such Metric applies to the period, return None.
        """
        raise NotImplementedError()

    def get_values(self):
        """
        Return a dictionary mapping from metric name to values.
        """
        raise NotImplementedError()

    def get_value(self, name):
        """
        Return a value for the specified name.

        If no such Value exists for this period, return None.
        """
        raise NotImplementedError()


class ModelPeriod(PeriodBase):
    """
    A Period implementation that Django models.Model can derive from.
    """

    def _build_metrics(self):
        """
        Build a mapping from fields to Metrics.

        We assume that any field that has been annotated with a `metric`
        attribute wants to have an affiliated Metric.
        """
        self._metrics = {
            field.name: getattr(field, "metric")
            for field in self._meta.get_fields()
            if hasattr(field, "metric")
        }

    def _ensure_metrics(self):
        if not hasattr(self, "_metrics"):
            self._build_metrics()

    def get_start(self):
        return self.start

    def get_end(self):
        return self.end

    def get_metric_names(self):
        self._ensure_metrics()
        return self._metrics.keys()

    def get_metric(self, name):
        self._ensure_metrics()
        return self._metrics.get(name)

    def get_values(self):
        return {name: self.get_value(name) for name in self.get_metric_names()}

    def get_value(self, name):
        return getattr(self, name)


class PeriodSetBase:
    """
    A PeriodSet represents a collection of Periods that are contiguous in time.
    """

    @classmethod
    def from_equal_periods(cls, period, length):
        """
        Given a period that spans *at least* the length specified, split it
        into a set of periods of equal length (provided as a timedelta)
        """
        raise NotImplementedError()


class BarePeriodSet(PeriodSetBase):
    def __init__(self, periods):
        self.periods = periods

    @classmethod
    def from_equal_periods(cls, period, length):

        pass


class ModelPeriodSet(PeriodSetBase):
    pass

