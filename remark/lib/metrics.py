import datetime

from collections import namedtuple
from enum import Enum, auto
from decimal import Decimal

from dateutil import relativedelta

from remark.lib.collections import SortedList
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


class TimeValueCollection:
    """
    Holds on to a collection of time values and provides efficient in-memory 
    operations for idnexing them.
    """

    # TODO Pandas provides a number of useful time series utilities, including
    # indexing data structures, but they do not appear to deal well with
    # *non*regular periods of time, which we definitely *do* have to think about
    # here. Worth investigating in the near future. -Dave

    def __init__(self, time_values=None, starts=None, ends=None):
        """
        Construct a collection. For efficiency, there are multiple ways
        to supply collection content:

        - time_values: a (possibly unordered) list of time values
        - starts: a remark.lib.collections.SortedList keyed by start
        - ends: a remark.lib.collections.SortedList keyed by end

        You *must* supply at least one parameter. You *may* supply more
        than one, provided that they agree. (No attempt is made to check
        that they agree!)
        """
        if (time_values is None) and (starts is None) and (ends is None):
            raise InvalidMetricOperation(
                "Cannot construct a TimeValueCollection without time_values."
            )
        self._time_values = list(time_values) if time_values is not None else None
        self._starts = starts
        self._ends = ends

    def _any_list(self):
        """
        Return whichever of _time_values, _starts, and _ends is available.

        Typically used by callers that want to perfom basic operations without
        calling _ensure_...
        """
        if self._starts is not None:
            return self._starts
        if self._ends is not None:
            return self._ends
        if self._time_values is not None:
            return self._time_values
        return []

    def __len__(self):
        """Return length of collection without doing further work."""
        return len(self._any_list())

    def __eq__(self, other):
        """Return true if the collections are equivalent."""
        if not isinstance(other, TimeValueCollection):
            return False
        return self._any_list().__eq__(other._any_list())

    def __contains__(self, value):
        """Return True if value is in our collection."""
        return value in self._any_list()

    def __iter__(self):
        """Return an iterator over the default ordering."""
        self._ensure_time_values()
        return self._time_values.__iter__()

    def __getitem__(self, val):
        """Return items based on the default ordering."""
        self._ensure_time_values()
        return self._time_values.__getitem__(val)

    def _ensure_time_values(self):
        """Ensure we have a local default ordering."""
        if self._time_values is None:
            # Create the _time_values list from one of our lists; prefer the _starts
            # if it was provided.
            self._time_values = (
                list(self._starts) if self._starts is not None else list(self._ends)
            )

    def _ensure_starts(self):
        """Ensure we have a local start-first ordering."""
        if self._starts is None:
            self._ensure_time_values()
            # Create the _starts index from our time_values list.
            self._starts = SortedList(
                self._time_values, key=lambda time_value: time_value.start
            )

    def _ensure_ends(self):
        """Ensure we have a local end-first ordering."""
        if self._ends is None:
            self._ensure_time_values()
            # Create the _ends index from our time_values list.
            self._ends = SortedList(
                self._time_values, key=lambda time_value: time_value.end
            )

    def first(self):
        """Return first item in collection, or None if collection is empty."""
        return self[0] if len(self) > 0 else None

    def last(self):
        """Return last item in collection, or None if collection is empty."""
        return self[-1] if len(self) > 0 else None

    def order_by_start(self):
        """
        Return a TimeValueCollection whose default ordering is by start.
        """
        self._ensure_starts()
        return TimeValueCollection(starts=self._starts)

    def order_by_end(self):
        """
        Return a TimeValueCollection whose default ordering is by end.
        """
        self._ensure_ends()
        return TimeValueCollection(ends=self._ends)

    def _process_filter_kwargs(self, kwargs):
        """
        Break out filter kwargs of the form accepted by filter(...) into
        the start/end param dicts for SortedList.irange_key()   

        Returns a tuple of start_filters and end_filters
        """
        start_filters = []
        end_filters = []

        # Break out filters into start/end param dicts for SortedList.irange_key()
        for arg, v in kwargs.items():
            a = arg

            # Determine which side of the date range we're filtering.
            if a.startswith("start__"):
                target_filters = start_filters
                a = a[len("start__") :]
            elif a.startswith("end__"):
                target_filters = end_filters
                a = a[len("end__") :]
            else:
                raise TypeError(
                    f"TimeValueCollection.filter() got an unexpected keyword argument '{arg}'"
                )

            if a == "gt":
                target_filters.append(dict(min_key=v, inclusive=(False, None)))
            elif a == "gte":
                target_filters.append(dict(min_key=v, inclusive=(True, None)))
            elif a == "lt":
                target_filters.append(dict(max_key=v, inclusive=(None, False)))
            elif a == "lte":
                target_filters.append(dict(max_key=v, inclusive=(None, True)))
            elif a == "eq":
                target_filters.append(
                    dict(min_key=v, max_key=v, inclusive=(True, True))
                )
            else:
                raise TypeError(
                    f"TimeValueCollection.filter() got an unexpected keyword argument '{arg}'"
                )

        return (start_filters, end_filters)

    def _filter_values(self, filters, sorted_list):
        """
        Execute multiple filters on a SortedList.
        """
        filtered = sorted_list
        for f in filters:
            filtered = SortedList(filtered.irange_key(**f), key=sorted_list.key)
        return filtered

    def filter(self, **kwargs):
        """
        Provide a queryset-like filtering interface that allows for the following
        keywords: 

        start__gt, start__gte, start__lt, start__lte, start__eq,
        end__gt, end__gte, end__lt, end__lte, end__eq,

        Returns a new TimeValueCollection filtered to just the matching values.
        """
        start_filters, end_filters = self._process_filter_kwargs(kwargs)

        # Filter starts if requested
        starts = None
        if start_filters:
            self._ensure_starts()
            starts = self._filter_values(start_filters, self._starts)

        # Filter ends if requested
        ends = None
        if end_filters:
            self._ensure_ends()
            ends = self._filter_values(end_filters, self._ends)

        # If necessary, join the results across filters.
        # Attempt to preserve ordering if already established.
        if (starts is not None) and (ends is not None):
            result = TimeValueCollection(time_values=set(starts) & set(ends))
        elif starts is not None:
            result = TimeValueCollection(starts=starts)
        elif ends is not None:
            result = TimeValueCollection(ends=ends)
        else:
            self._ensure_time_values()
            result = TimeValueCollection(self._time_values)

        return result

    def overlaps(self, start, end):
        """
        Return a TimeValueCollection filtered down to just those time values
        whose span overlaps the given date range; that is, any time value
        that has part or all of its date range within the requested range.

        This is morally equivalent to postgres's notion of OVERLAPS for 
        half-open ranges.
        """
        return self.filter(start__lt=end, end__gt=start)


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
        # possible computation for the type. (CONSIDER make this explicit?)
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
        # at or immediately before (EARLIEST), or immediately after (LATEST)
        # the timespan.
        if self.behavior.is_merge_earliest():
            time_value = (
                time_value_collection.filter(start__lte=start).order_by_start().last()
            )
        else:
            time_value = (
                time_value_collection.filter(start__gte=end).order_by_start().first()
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

    def get_metrics(self):
        """
        Return a dictionary mapping all metric names to Metrics.
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

        If no such Value exists for this period, raise an exception.
        """
        raise NotImplementedError()


class BarePeriod(PeriodBase):
    """
    A Period implementation that holds its values in memory.
    """

    def __init__(self, start, end, metrics, values):
        """
        Construct a BarePeriod with explicit start and end date,
        a mapping from metric names to Metric instances, and a separate
        mapping from metric names to underlying values.
        """
        self._start = start
        self._end = end
        self._metrics = metrics
        self._values = values

    def get_start(self):
        return self._start

    def get_end(self):
        return self._end

    def get_metric_names(self):
        return list(self._metrics.keys())

    def get_metrics(self):
        return self._metrics

    def get_metric(self, name):
        return self._metrics.get(name)

    def get_values(self):
        return dict(self._values)

    def get_value(self, name):
        return self._values[name]


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
        return list(self._metrics.keys())

    def get_metrics(self):
        self._ensure_metrics()
        return self._metrics

    def get_metric(self, name):
        self._ensure_metrics()
        return self._metrics.get(name)

    def get_values(self):
        return {name: self.get_value(name) for name in self.get_metric_names()}

    def get_value(self, name):
        return getattr(self, name)


class Weekday:
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6


class DateSequence:
    """
    A simple generator of date sequences based on specified criterion.
    """

    # NOTE that pandas has a *very* sophisticated set of tools for generating
    # date sequences. We may wish to adopt it wholesale. Pandas is a heavyweight
    # deependency, so I'm punting for now. This... is simpler;
    # it's also more directly in line with our needs now. That may change. -Dave

    @classmethod
    def for_time_delta(cls, start, end, time_delta, after_end=True):
        """
        Return an iterable of dates spaced apart by time_delta.

        The first date will be start; if after_end is 0, the last date will
        be the 
        """
        d = start
        while d < end:
            yield d
            d += time_delta
        if after_end:
            yield d

    @classmethod
    def for_weeks(cls, start, end, weekday=None, before_start=True, after_end=True):
        """
        Return an iterable of dates spaced apart by a week.

        If no weekday is specified, the first date will be the start; otherwise,
        it will be the first date (agreeing with before_start)

        The last date will be the earliest date that occurs at or after 
        the end. (If after_end is false, all dates will be within range.)
        """
        week = datetime.timedelta(days=7)

        d = start

        # Adjust starting date to match desired weekday, if provided
        if weekday is not None:
            days = weekday - start.weekday()
            days = days if days <= 0 else days - 7
            d = start + datetime.timedelta(days=days)

        # Drop first week if it's before bounds
        if d < start and not before_start:
            d += week

        return cls.for_time_delta(d, end, week, after_end=after_end)

    @classmethod
    def for_calendar_months(cls, start, end, before_start=True, after_end=True):
        """
        Return an iterable of the first days of calendar months.

        The first date will be the latest 1st date that occurs at or before
        the start. (After it, if before_start is False)

        The last date will be the latest 1st date that occurs at or after
        the end. (Before it, if after_end is False)
        """
        month = relativedelta.relativedelta(months=1)

        # Adjust starting date to be start of month
        d = start.replace(day=1)

        # Drop first month if it's before bounds
        if d < start and not before_start:
            d += month

        return cls.for_time_delta(d, end, month, after_end=after_end)


class MultiPeriodBase:
    """
    A MultiPeriod represents a set of named values whose timespans
    intersect with the MultiPeriod's timespan. In each MultiPeriod, there
    may be multiple values, represented as a TimeValueCollection, for a given Metric.
    """

    def get_start(self):
        """
        Return the start time (inclusive) for this MultiPeriod.

        Derived classes can implement this as they see fit.
        """
        raise NotImplementedError()

    def get_end(self):
        """
        Return the end time (exclusive) for this MultiPeriod.

        Derived classes can implement this as they see fit.
        """
        raise NotImplementedError()

    def get_metric_names(self):
        """
        Return an iterable of all metric names in this multiperiod.
        """
        raise NotImplementedError()

    def get_metrics(self):
        """
        Return a dictionary mapping names to (capital) Metrics
        """
        raise NotImplementedError()

    def get_metric(self, name):
        """
        Return a (capital) Metric for the specified name.

        If no such Metric applies to the multiperiod, return None.
        """
        raise NotImplementedError()

    def get_all_time_value_collections(self):
        """
        Return an dictionary mapping each known metric names to a
        TimeValueCollection.
        """
        raise NotImplementedError()

    def get_time_value_collection(self, name):
        """
        Return a TimeValueCollection for the specified metric name.

        If no such TimeValueCollection exists for this multiperiod, raise an exception.
        """
        raise NotImplementedError()

    def get_periods(self, *break_times):
        """
        Return a time-ordered list of (non-multi) periods based on the provided
        break times.

        The provided break_times must be ordered from earliest to latest. 
        There must be at least two break_times, indicating a single period's duration.
        """
        # Use the MultiPeriodBase accessors to grab our fundamentals;
        # CONSIDER I'm not sure if we need to have the divide between
        # MultiPeriodBase and (say) BareMultiPeriod, since probably all of
        # this will live in memory for now. -Dave
        metrics = self.get_metrics()
        time_value_collections = self.get_all_time_value_collections()

        # Check precondition: at lease two break times must be supplied.
        if len(break_times) < 2:
            raise InvalidMetricOperation("You must supply a minimum of 2 break times.")

        def _unify_for_metric(start, end, name, metric):
            time_value_collection = time_value_collections[name]
            return metric.unify_collection(start, end, time_value_collection)

        def _bare_period(start, end):
            period_values = {
                name: _unify_for_metric(start, end, name, metric)
                for name, metric in metrics.items()
            }
            return BarePeriod(start, end, metrics, period_values)

        # Build our periods list; this could also be done as a generator.
        periods = []
        start = break_times[0]
        for break_time in break_times[1:]:
            end = break_time
            periods.append(_bare_period(start, end))
            start = end

        return periods

    def get_delta_periods(self, time_delta, after_end=True):
        """
        Return an iterable of (non-multi) periods with each period exactly
        time_delta in length.
        """
        break_times = DateSequence.for_time_delta(
            self.get_start(), self.get_end(), time_delta, after_end=after_end
        )
        return self.get_periods(*list(break_times))

    def get_week_periods(self, weekday=None, before_start=True, after_end=True):
        """
        Return an iterable of (non-multi) periods with each period spaced
        a week apart, optionally aligned to the weekday.
        """
        break_times = DateSequence.for_weeks(
            self.get_start(),
            self.get_end(),
            weekday=weekday,
            before_start=before_start,
            after_end=after_end,
        )
        return self.get_periods(*list(break_times))

    def get_calendar_month_periods(self, before_start=True, after_end=True):
        """
        Return an iterable of (non-multi) periods with each period starting
        at the beginning of the month.
        """
        break_times = DateSequence.for_calendar_months(
            self.get_start(),
            self.get_end(),
            before_start=before_start,
            after_end=after_end,
        )
        return self.get_periods(*list(break_times))

    def get_cumulative_period(self):
        """
        Return a single (non-multi) period that summarizes all values across
        this period's timespan.
        """
        return self.get_periods(self.get_start(), self.get_end())[0]


class BareMultiPeriod(MultiPeriodBase):
    """
    An in-memory implementation of a MultiPeriod
    """

    @classmethod
    def from_periods(cls, periods):
        """
        Construct a BareMultiPeriod with a collection of periods.
        """

        # All periods are presumed parallel; grab their metrics
        metric_names = periods[0].get_metric_names()
        metrics = {
            metric_name: periods[0].get_metric(metric_name)
            for metric_name in metric_names
        }

        # Build a mapping from metric name to a list of time values
        values = {}

        earliest_start = None
        latest_end = None

        for period in periods:
            start = period.get_start()
            end = period.get_end()
            period_values = period.get_values()
            period_time_values = {
                metric_name: TimeValue(start, end, value)
                for metric_name, value in period_values.items()
            }
            for metric_name, time_value in period_time_values.items():
                value_list = values.get(metric_name, [])
                values[metric_name] = value_list + [time_value]
            if (earliest_start is None) or (start < earliest_start):
                earliest_start = start
            if (latest_end is None) or (end > latest_end):
                latest_end = end

        return cls(earliest_start, latest_end, metrics, values)

    def __init__(self, start, end, metrics, time_values):
        """
        Construct a BareMultiPeriod with a:

            - start date (inclusive) 
            - end date (exclusive)
            - dictionary mapping metric name to Metric instance
            - dictionary mapping metric name to iterable of TimeValues

        As a general rule, you should let other code, like the MultiPeriodManagerMixin,
        handle the actual construction of BareMultiPeriod.
        """
        self._start = start
        self._end = end
        self._metrics = dict(metrics)
        self._time_values = {
            name: TimeValueCollection(value_list)
            for name, value_list in time_values.items()
        }

    def get_start(self):
        return self._start

    def get_end(self):
        return self._end

    def get_metric_names(self):
        return list(self._metrics.keys())

    def get_metrics(self):
        return self._metrics

    def get_metric(self, name):
        return self._metrics.get(name)

    def get_all_time_value_collections(self):
        return self._time_values

    def get_time_value_collection(self, name):
        return self._time_values[name]


class MultiPeriodQuerySetMixin:
    """
    A utility mixin for Django models.QuerySet instances to provide the ability
    to produce a MultiPeriod from a current queryset.

    In order to be useful, the QuerySet instances must surface a Model that derives
    from ModelPeriod.
    """

    def multi_period(self):
        """
        Return a MultiPeriod for the current queryset. The start date of the
        multiperiod will be the start date of the earliest value; the end 
        date will be the end date of the latest value.

        Returns None if there are no periods. (CONSIDER: maybe return empty?)
        """
        # XXX TODO this isn't the `metrics` branch; for now, we have to load
        # all applicable periods into memory because we don't know which
        # period will have meaningful PIT_EARLIEST or PIT_LATEST values.
        # (The `metrics` branch can easily solve this dilemma since each
        # value is broken out separately; I suppose we *could* query to
        # limit how far back/forward in time we go outside of the specified
        # date range, but given the small size of our data at the moment and
        # the likely need for us to revisit this very soon, I'm punting for now.)
        # -Dave

        # Grab the underlying periods
        periods = list(self.order_by("start"))
        if not periods:
            return None

        return BareMultiPeriod.from_periods(periods)
