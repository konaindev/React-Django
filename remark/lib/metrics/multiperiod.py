from .datesequence import DateSequence
from .errors import InvalidMetricOperation
from .period import BarePeriod
from .timevalue import TimeValue, TimeValueCollection


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

    def only(self, *names):
        """
        Return a new MultiPeriodBase that contains *only* the values associated
        with the provided names. This is particularly useful if one is about
        to perform an expensive computation with a multiperiod.
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

    def get_delta_periods(self, time_delta, after_end=True, precise_end=False):
        """
        Return an iterable of (non-multi) periods with each period exactly
        time_delta in length.
        """
        break_times = DateSequence.for_time_delta(
            self.get_start(),
            self.get_end(),
            time_delta,
            after_end=after_end,
            precise_end=precise_end,
        )
        return self.get_periods(*list(break_times))

    def get_week_periods(
        self,
        weekday=None,
        before_start=True,
        after_end=True,
        precise_start=False,
        precise_end=False,
    ):
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
            precise_start=precise_start,
            precise_end=precise_end,
        )
        return self.get_periods(*list(break_times))

    def get_calendar_month_periods(
        self, before_start=True, after_end=True, precise_start=False, precise_end=False
    ):
        """
        Return an iterable of (non-multi) periods with each period starting
        at the beginning of the month.
        """
        break_times = DateSequence.for_calendar_months(
            self.get_start(),
            self.get_end(),
            before_start=before_start,
            after_end=after_end,
            precise_start=precise_start,
            precise_end=precise_end,
        )
        return self.get_periods(*list(break_times))

    def get_cumulative_period(self):
        """
        Return a single (non-multi) period that summarizes all values across
        this period's timespan.
        """
        return self.get_periods(self.get_start(), self.get_end())[0]

    def __str__(self):
        return f"{type(self).__name__}: {self.get_start()} - {self.get_end()}"


class BareMultiPeriod(MultiPeriodBase):
    """
    An in-memory implementation of a MultiPeriod
    """

    @classmethod
    def from_periods(cls, periods):
        """
        Construct a BareMultiPeriod with a collection of periods.

        The 'extent' of the multiperiod will be the discovered extent of the 
        underlying periods.
        """
        # Build a mapping from metric name to metric
        metrics = {}

        # Build a mapping from metric name to a list of time values
        values = {}

        earliest_start = None
        latest_end = None

        for period in periods:
            start = period.get_start()
            end = period.get_end()

            # TODO CONSIDER: what if metric names collide across periods?
            # We should probably detect this and raise an exception. -Dave
            metrics.update(period.get_metrics())
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
            name: value_list
            if isinstance(value_list, TimeValueCollection)
            else TimeValueCollection(value_list)
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

    def only(self, *names):
        """
        Return a new BareMultiPeriod that contains *only* the values associated
        with the provided names. This is particularly useful if one is about
        to perform an expensive computation with a multiperiod.
        """
        # CONSIDER maybe belongs on the MultiPeriodBase? Maybe not? I dunno. -Dave
        names = frozenset(names)
        filtered_metrics = {
            name: metric for name, metric in self.get_metrics().items() if name in names
        }
        filtered_time_value_collections = {
            name: time_value_collection
            for name, time_value_collection in self.get_all_time_value_collections().items()
            if name in names
        }
        return BareMultiPeriod(
            start=self.get_start(),
            end=self.get_end(),
            metrics=filtered_metrics,
            time_values=filtered_time_value_collections,
        )
