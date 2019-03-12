from decimal import Decimal
from enum import Enum, auto

from remark.lib.math import sum_or_none

from .errors import InvalidMetricOperation
from .timevalue import TimeValue, TimeValueCollection


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
    INTERVAL_SUM_AMORTIZE = auto()

    def describe(self):
        if self == self.POINT_IN_TIME_EARLIEST_KEEP:
            return "pit/early"
        elif self == self.INTERVAL_SUM_AMORTIZE:
            return "i/sum/amort"

    def is_point_in_time(self):
        """
        Return True if the value should be interpreted as meaningful at a specific point in time.
        """
        return self == self.POINT_IN_TIME_EARLIEST_KEEP

    def is_interval(self):
        """
        Return True if the value should be interpreted as meaningful across a time span.
        """
        return self == self.INTERVAL_SUM_AMORTIZE

    def is_merge_earliest(self):
        """
        Return True if, when two values are merged, the earliest should win.
        """
        return self == self.POINT_IN_TIME_EARLIEST_KEEP

    def is_merge_sum(self):
        """
        Return True if, when two values are merged, they should be summed.
        """
        return self == self.INTERVAL_SUM_AMORTIZE

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


class Metric:
    """
    A Metric is an object that provides manipualtions for values in time.

    In this library, values in time are represented by TimeValue, which is simply
    a tuple that contains a start date (inclusive), an end date (exclusive), 
    and a raw value that applies to that time span. If the start and end dates
    are the same, the TimeValue is considered to be point-in-time rather than
    intervallic.

    Every Metric must provide implementations of two key operations on TimeValues:

        merge(time_values):

            Given a potentially unordered collection of time_values, return a single
            time_value whose extents are determined by the earliest and latest of
            the included time values, and whose value is determined by the Metric's
            merge technique.

            The default Metric class implements two merge techniques for
            point-in-time values: either pick the earliest, or pick the latest.

            The default Metric class implements two merge techniques for
            intervallic values: either add them together, or average them. 
            Addition is irrespective of time frames; averages are weighted equally by
            the relative amount of time each TimeValue represents.

            The choice of merge behavior comes from the underlying Metric.behavior value.

            If you'd like to define your own behaviors, you can derive from
            Metric and override merge(...). You might do this for special value
            types (Metric only handles int, float, and Decimal by default). You
            might also do this if you want to implement more sophisticated 
            assumptions about the distribution of a given TimeValue in time:
            the base class makes an assumption that values are distributed
            evenly over their time span, but a smarter Metric might implement
            daily, weekly, or seasonal assumptions. The sky is the limit for
            what a Metric, in the abstract, can do.
        
        separate(when, time_value):

            Given a single TimeValue and a time within that time value,
            split the time_value into two.

            The default Metric class implements a single separate technique
            for point-in-time values: it simply leaves them untouched.

            The default Metric class implements two techniques for intervallic
            values: either it leaves them untouched, or it splits them evenly
            across the split timeframe.

            The choice of separate behavior comes from the underlying Metric.behavior value.

            Like merge(...), derived Metrics classes can implement separation
            however they please.

    There is a third critical operation on Metric that builds on *top*
    of merge(...) and separate(...):

        unify(start, end, time_values):

            Given a desired start and end date, and a (potentially unordered)
            collection of TimeValues, return a *single* value for the requested
            span.

            Under the hood, this simply makes multiple calls to merge(...)
            and separate(...) as necessary.

            Derived Metrics can certainly bring their own implementation, 
            although it may not be necessary in the common case.

    The MultiPeriod classes use unify(...) extensively in order to generate
    successive periods with precisely determined start and end points.
    """

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

        If sorted is True, we assume the time_values are already sorted by their start time;
        otherwise, we may internally sort ourselves.

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        time_value_collection = TimeValueCollection(time_values)
        return self.merge_collection(time_value_collection)

    def merge_collection(self, time_value_collection):
        # Return nothing if there are no values...
        if len(time_value_collection) == 0:
            return None

        # Nothing to merge if there's only one value...
        if len(time_value_collection) == 1:
            return time_value_collection[0]

        # Ensure a sort order by start. (This is a no-op if the collection is
        # already so ordered).
        time_values = time_value_collection.order_by_start()

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
        elif self.behavior.is_merge_sum():
            result_time_value = self._merge_sum(time_values)

        return result_time_value

    def _merge_earliest(self, time_values):
        """
        Merge two values by choosing the earliest. (That's easy!)
        """
        return TimeValue(*time_values[0])

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

    def unify(self, start, end, *time_values):
        """
        Combine an arbitrary set of TimeValues according to the metric's behavior.

        Returns a raw value, which corresponds with the *precise* specified 
        start and end date. (Compare with merge(...), whose start and end dates
        are implicitly determined by the provided time_values, and which returns
        a TimeValue rather than a raw value).

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        time_value_collection = TimeValueCollection(time_values)
        return self.unify_collection(start, end, time_value_collection)

    def unify_collection(self, start, end, time_value_collection):
        """
        See definition of unify above; this method expects a TimeValueCollection.
        """
        if self.behavior.is_point_in_time():
            result = self._unify_pit(start, end, time_value_collection)
        else:
            result = self._unify_interval(start, end, time_value_collection)
        return result

    def _unify_pit(self, start, end, time_value_collection):
        # Under unification, the PIT TimeValue is the value that occurs
        # at or immediately before the timespan.
        time_value = (
            time_value_collection.filter(start__lte=start)
            .order_by_start()
            .last_non_null()
        )
        return time_value.value if time_value else None

    def _unify_interval(self, start, end, time_value_collection):
        # Under unification, we must (1) find all time values that intersect the
        # target span, (2) suture the first and last, (3) merge what remains.
        # There are a few special cases here, particularly if there's only
        # one period the overlaps.
        time_value_collection = time_value_collection.overlaps(
            start, end
        ).order_by_start()

        merge_time_values = []

        if len(time_value_collection) == 1:
            # Zero, one, or both ends of our single value may need to be separated.
            time_value = time_value_collection[0]
            if start >= time_value.start and start < time_value.end:
                _, time_value = self.separate(start, time_value)
            if end >= time_value.start and end < time_value.end:
                time_value, _ = self.separate(end, time_value)
            merge_time_values = [time_value]
        elif len(time_value_collection) > 1:
            # Zero or one ends of our first value may need to be separated.
            first_time_value = time_value_collection.first()
            if start >= first_time_value.start and start < first_time_value.end:
                _, first_time_value = self.separate(start, first_time_value)

            # Zero or one ends of our last value may need to be separated.
            last_time_value = time_value_collection.last()
            if end >= last_time_value.start and end < last_time_value.end:
                last_time_value, _ = self.separate(end, last_time_value)

            merge_time_values = (
                [first_time_value] + time_value_collection[1:-1] + [last_time_value]
            )

        time_value = self.merge(*merge_time_values)
        return time_value.value if time_value else None
