import functools
from decimal import Decimal

from django.db.models.fields import IntegerField, DecimalField, FloatField

from remark.lib.math import sum_or_none, mult_or_none


class InvalidMetricOperation(Exception):
    pass


# NOTE We intentionally do *not* use Python 3's Enum for these classes, so that
# their values are trivially compatible with django model fields.


class Kind:
    """
    Defines the expected type for a Metric's Value.
    """

    INTEGER = 0
    FLOAT = 1
    DECIMAL = 2

    @classmethod
    def description(cls, kind):
        if kind == cls.INTEGER:
            return "int"
        elif kind == cls.FLOAT:
            return "float"
        elif kind == cls.DECIMAL:
            return "Decimal"


class Behavior:
    """
    Defines the behavior of a Metric's Value in time, and under operations
    that both split and merge multiple Values of the same metric across time
    spans.

    Conceptually, each behavior combines three separate pieces of information:

    - Disposition
    
      Whether a Value should be considered to apply to a specific point in time
      ("number of occupied units") or to a time interval ("change in occupied units")

    - Merge method

      What to do with two Values of a given Metric when combining time intervals

    - Separate method

      What to do with a single Value of a given Metric when splitting a
      time interval into two

    See the underlying (private) definitions of Disposition, MergeMethod, and SplitMethod
    for details.

    The reason to collect these *three* things together in one Enum is because
    only a small subset of underlying combinations of Disposition/Merge/Separate
    really make sense in practice. Under the hood, we have flexibility; outwardly,
    Behavior limits this to just what is sane.
    """

    POINT_IN_TIME_EARLIEST_KEEP = 0
    POINT_IN_TIME_LATEST_KEEP = 1
    INTERVAL_SUM_AMORTIZE = 2
    INTERVAL_AVERAGE_KEEP = 3

    @classmethod
    def description(cls, behavior):
        if behavior == cls.POINT_IN_TIME_EARLIEST_KEEP:
            return "pit/early"
        elif behavior == cls.POINT_IN_TIME_LATEST_KEEP:
            return "pit/late"
        elif behavior == cls.INTERVAL_SUM_AMORTIZE:
            return "i/sum/amort"
        elif behavior == cls.INTERVAL_AVERAGE_KEEP:
            return "i/avg"


class Disposition:
    """
    Determines whether values apply to a specific point in time,
    or across a time interval.
    """

    POINT_IN_TIME = 0
    INTERVAL = 1


class MergeMethod:
    """
    Defines what should happen when two values for the same metric are combined 
    -- for instance, when trying to determine the "value" of a metric over an 
    arbitrary time span that includes multiple data points for that metric.
    """

    EARLIEST = 0  # Keep the earliest value in the combined timespan
    LATEST = 1  # Keep the latest value in the combined timespan
    SUM = (
        2
    )  # Sum the values in each timespan; assume missing timespans are zero-valued.
    AVERAGE = (
        3
    )  # Compute a time-weighted average of values in each timespan; ignore missing timespans.


class SeparateMethod:
    """
    Defines what should happen when a single value for a metric is split -- 
    for instance, when trying to determine the "value" of a metric over an 
    arbitrary time span that subdivides a single data point for that metric.
    """

    KEEP = 0  # Keep the value the same for both sides of the separation
    AMORTIZE = 1  # Compute a time-based amortization of the value for each side


class MetricBase:
    """
    Defines a single metric (like `lease_expirations`) along with information about
    both the type of its value, and the behavior of the metric under merged and separated
    timeframes.
    """

    @property
    def disposition(self):
        """
        Return the underlying temporal disposition based on the specified behavior.
        """
        if self.behavior in [
            Behavior.POINT_IN_TIME_EARLIEST_KEEP,
            Behavior.POINT_IN_TIME_LATEST_KEEP,
        ]:
            disposition = Disposition.POINT_IN_TIME
        else:
            disposition = Disposition.INTERVAL
        return disposition

    @property
    def merge_method(self):
        """
        Return the underlying merge method based on the specified behavior.
        """
        if self.behavior == Behavior.POINT_IN_TIME_EARLIEST_KEEP:
            method = MergeMethod.EARLIEST
        elif self.behavior == Behavior.POINT_IN_TIME_LATEST_KEEP:
            method = MergeMethod.LATEST
        elif self.behavior == Behavior.INTERVAL_SUM_AMORTIZE:
            method = MergeMethod.SUM
        else:
            method = MergeMethod.AVERAGE
        return method

    @property
    def separate_method(self):
        """
        Return the underlying separate method based on the specified behavior.
        """
        if self.behavior == Behavior.INTERVAL_SUM_AMORTIZE:
            method = SeparateMethod.AMORTIZE
        else:
            method = SeparateMethod.KEEP
        return method

    def __str__(self):
        return f"{self.name} {Kind.description(self.kind)} {Behavior.description(self.behavior)}"


class ValueBase:
    """
    A single value for a metric.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.metric.disposition == Disposition.POINT_IN_TIME:
            if self.start != self.end:
                raise InvalidMetricOperation(
                    "Values with Disposition.POINT_IN_TIME must have equivalent start and end dates."
                )
        else:
            if self.start == self.end:
                raise InvalidMetricOperation(
                    "Values with Disposition.INTERVAL must have distinct start and end dates."
                )

    @classmethod
    def merge(cls, *values):
        """
        Merge an arbitrary set of Values of the same Metric according to their 
        desired merge behavior.

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        # Precondition: ensure we're merging like metrics only
        metric_names = set((v.metric.name for v in values))
        if len(metric_names) != 1:
            raise InvalidMetricOperation(
                "Cannot merge: metrics disagree (or none were provided)."
            )

        # Sort the values based on their start dates
        values = list(sorted(values, key=lambda v: v.start))

        # Nothing to merge if there's only one value...
        if len(values) == 1:
            return values[0]

        metric = values[0].metric

        # CONSIDER: semantically, it probably makes sense for merge(...) to enforce
        # that date ranges are contiguous for intervallic merges. In practice,
        # though, I think that's probably too much to ask of Remarkably's
        # actual dataq. So, for now, I won't enforce this. -Dave
        # Precondition: date ranges must not overlap for intervallic merges
        if metric.disposition == Disposition.INTERVAL:
            for i in range(1, len(values)):
                if values[i - 1].end > values[i].start:
                    raise InvalidMetricOperation(
                        f"Cannot merge {values[i-1]} and {values[i]}: intervals overlap."
                    )

        if metric.merge_method == MergeMethod.EARLIEST:
            return cls._merge_earliest(metric, values)
        elif metric.merge_method == MergeMethod.LATEST:
            return cls._merge_latest(metric, values)
        elif metric.merge_method == MergeMethod.SUM:
            return cls._merge_add(metric, values)
        elif metric.merge_method == MergeMethod.AVERAGE:
            return cls._merge_average(metric, values)

    @classmethod
    def _merge_earliest(cls, metric, values):
        """
        Merge two values by choosing the earliest. (That's easy!)
        """
        return values[0]

    @classmethod
    def _merge_latest(cls, metric, values):
        """
        Merge two values by choosing the latest. (Also easy!)
        """
        return values[-1]

    @classmethod
    def _merge_add(cls, metric, values):
        """
        Merge two values by summing them.
        """
        # CONSIDER if the values are non-contiguous, we'll treat the metric
        # as zero-valued during the missing time. -Dave
        return cls(
            metric=metric,
            start=values[0].start,
            end=values[-1].end,
            value=sum_or_none(*[v.value for v in values]),
        )

    @classmethod
    def _merge_average(cls, metric, values):
        """
        Merge an arbitrary list of values by averaging them.

        Weight the average based on the percentage of total time each value
        spans.
        """
        # CONSIDER if the values are non-contiguous, we'll ignore the missing
        # time entirely. -Dave
        seconds = [(v.end - v.start).total_seconds() for v in values]
        total_seconds = sum(seconds)

        # Precondition: there needs to be time!
        if not total_seconds:
            raise InvalidMetricOperation("Cannot merge: zero length timeframes.")

        # Time-weighted average.
        if metric.kind == Kind.INTEGER:
            total = sum_or_none(
                *[mult_or_none(v.value, s) for (v, s) in zip(values, seconds)]
            )
            merge_value = None if total is None else round(total / total_seconds)
        elif metric.kind == Kind.FLOAT:
            total = sum_or_none(
                *[mult_or_none(v.value, float(s)) for (v, s) in zip(values, seconds)]
            )
            merge_value = None if total is None else (total / total_seconds)
        elif metric.kind == Kind.DECIMAL:
            total = sum_or_none(
                *[mult_or_none(v.value, Decimal(s)) for (v, s) in zip(values, seconds)]
            )
            merge_value = None if total is None else (total / Decimal(total_seconds))

        return cls(
            metric=metric, start=values[0].start, end=values[-1].end, value=merge_value
        )

    @classmethod
    def separate(cls, when, v):
        """
        Separate a single Value into two based on an intervening time.

        Returns a tuple of Values (v1, v2) where v1 ends at when and v2 begins
        then.

        Raises InvalidMetricOperation if the value is not separatble at the
        requested time.
        """
        if v.metric.disposition == Disposition.INTERVAL:
            if when < v.start or when >= v.end:
                raise InvalidMetricOperation(
                    f"Cannot separate {v} at {when.isoformat()}: separate time is not within value timeframe."
                )

        if v.metric.separate_method == SeparateMethod.KEEP:
            return cls._separate_keep(when, v)
        else:
            return cls._separate_amortize(when, v)

    @classmethod
    def _separate_keep(cls, when, v):
        """
        Separate a value by doing nothing.
        """
        if v.metric.disposition == Disposition.INTERVAL:
            return cls._separate_keep_interval(when, v)
        else:
            return cls._separate_keep_point_in_time(when, v)

    @classmethod
    def _separate_keep_interval(cls, when, v):
        left = cls(metric=v.metric, start=v.start, end=when, value=v.value)
        right = cls(metric=v.metric, start=when, end=v.end, value=v.value)
        return (left, right)

    @classmethod
    def _separate_keep_point_in_time(cls, when, v):
        left = cls(metric=v.metric, start=when, end=when, value=v.value)
        return (left, left)

    @classmethod
    def _separate_amortize(cls, when, v):
        """
        Separate a value by assuming it is distributed uniformly over a given
        timeframe. We resolve values at a per-second granularity.
        """
        total_seconds = (v.end - v.start).total_seconds()
        left_seconds = (when - v.start).total_seconds()

        if not total_seconds:
            raise InvalidMetricOperation(
                f"Cannot separate {v} at {when.isoformat()}: zero length timeframes."
            )

        # Separate the value, weighting for each timeframe. Ensure that
        # the sum of the resultant values is the original value.
        if v.value is not None:
            if v.metric.kind == Kind.INTEGER:
                left_value = round(v.value * (left_seconds / total_seconds))
            elif v.metric.kind == Kind.FLOAT:
                left_value = v.value * (left_seconds / total_seconds)
            elif v.metric.kind == Kind.DECIMAL:
                left_value = v.value * (Decimal(left_seconds) / Decimal(total_seconds))
            right_value = v.value - left_value
        else:
            right_value = left_value = None

        left = cls(metric=v.metric, start=v.start, end=when, value=left_value)
        right = cls(metric=v.metric, start=when, end=v.end, value=right_value)

        return (left, right)

    def __str__(self):
        return f"{self.metric.name} {self.start.isoformat() if self.start else None} {self.end.isoformat() if self.end else None} {self.value}"


class Metric(MetricBase):
    """
    A Metric implementation with no backing store.
    (One could imagine deriving a models.Model from MetricBase, too.)
    """

    def __init__(self, name, kind, behavior):
        self.behavior = behavior
        self.name = name
        self.kind = kind
        super().__init__()

    def __repr__(self):
        return f"<Metric: {self}>"


class Value(ValueBase):
    """
    A Value implementation with no backing store.
    (One could imagine deriving a models.Model from ValueBase, too.)
    """

    def __init__(self, metric, start, end, value):
        self.metric = metric
        self.start = start
        self.end = end
        self.value = value
        super().__init__()

    def __repr__(self):
        return f"<Value: {self}>"


class PeriodBase:
    """
    A Period represents a set of Values (and therefore a related set of metrics)
    that share a common time span.
    """

    def name_from_metric_or_name(self, metric_or_name):
        """
        Given a metric *or* the name of a metric, return just the name
        """
        # Use a clever little hack to accomplish this in one fell swoop.
        return getattr(metric_or_name, "name", metric_or_name)

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

    def get_metric(self, metric_name):
        """
        Return a (capital) Metric that has the specified name.

        If no such Metric applies to the period, return None.
        """
        raise NotImplementedError()

    def get_values(self):
        """
        Return a dictionary mapping from metric name to (capital) Value.
        """
        raise NotImplementedError()

    def get_value(self, metric_or_name):
        """
        Return a (capital) Value for the specified Metric (or name).

        If no such Value exists for this period, return None
        """
        raise NotImplementedError()

    def get_raw_values(self):
        """
        Return a dictionary mapping from metric name to (lowercase) value.
        """
        return {
            metric_name: value.value for metric_name, value in self.get_values().items()
        }

    def get_raw_value(self, metric_or_name):
        """
        Return a (lowercase) value for the specified Metric (or name).

        If no Value exists for this period, return None
        """
        value = self.get_value(metric_or_name)
        return value.value if value else None


class BarePeriod(PeriodBase):
    def __init__(self, start, end, values):
        """
        Construct a period with a set of values that 'impact' the given 
        time span.
        """
        self.start = start
        self.end = end
        self._all_values = values

    def _build_metrics(self):
        """
        Build a mapping from metric name to Metric.
        """
        self._metrics = {value.metric.name: value.metric for value in self._all_values}

    def _ensure_metrics(self):
        if not hasattr(self, "_metrics"):
            self._build_metrics()

    def _build_values(self):
        """
        Build a mapping from metric name to the Value for that name.
        """
        self._ensure_metrics()
        self._values = {value.metric.name: value for value in self._all_values}

    def _ensure_values(self):
        if not hasattr(self, "_values"):
            self._build_values()

    def get_start(self):
        return self.start

    def get_end(self):
        return self.end

    def get_metric_names(self):
        self._ensure_metrics()
        return self._metrics.keys()

    def get_metric(self, metric_name):
        self._ensure_metrics()
        return self._metrics.get(metric_name)

    def get_values(self):
        self._ensure_values()
        return dict(self._values)

    def get_value(self, metric_or_name):
        self._ensure_values()
        return self._values.get(self.name_from_metric_or_name(metric_or_name))


class ModelPeriod(PeriodBase):
    def _build_metrics(self):
        """
        Build a mapping from field name to Metric.

        We assume that any field that has been annotated with a `behavior`
        attribute wants to have an affiliated Metric.
        """

        def metric_for_field(field):
            if isinstance(field, IntegerField):
                kind = Kind.INTEGER
            elif isinstance(field, DecimalField):
                kind = Kind.DECIMAL
            elif isinstance(field, FloatField):
                kind = Kind.FLOAT
            return Metric(name=field.name, kind=kind, behavior=field.behavior)

        self._metrics = {
            field.name: metric_for_field(field)
            for field in self._meta.get_fields()
            if hasattr(field, "behavior")
        }

    def _ensure_metrics(self):
        if not hasattr(self, "_metrics"):
            self._build_metrics()

    def _build_values(self):
        """
        Build a mapping from field name to Value.
        """
        self._ensure_metrics()

        def value_for_field_name(name):
            metric = self._metrics[name]
            if metric.behavior == Behavior.POINT_IN_TIME_EARLIEST_KEEP:
                start = end = self.get_start()
            elif metric.behavior == Behavior.POINT_IN_TIME_LATEST_KEEP:
                start = end = self.get_end()
            else:
                start = self.get_start()
                end = self.get_end()
            return Value(
                metric=self._metrics[name],
                start=start,
                end=end,
                value=getattr(self, name),
            )

        self._values = {
            name: value_for_field_name(name) for name in self._metrics.keys()
        }

    def _ensure_values(self):
        if not hasattr(self, "_values"):
            self._build_values()

    def get_start(self):
        return self.start

    def get_end(self):
        return self.end

    def get_metric_names(self):
        self._ensure_metrics()
        return self._metrics.keys()

    def get_metric(self, metric_name):
        self._ensure_metrics()
        return self._metrics.get(metric_name)

    def get_values(self):
        self._ensure_values()
        return dict(self._values)

    def get_value(self, metric_or_name):
        self._ensure_values()
        return self._values.get(self.name_from_metric_or_name(metric_or_name))


class PeriodSetBase:
    """
    A PeriodSet represents a collection of Periods that are contiguous in time.
    """

    pass


class BarePeriodSet(PeriodSetBase):
    pass


class ModelPeriodSet(PeriodSetBase):
    pass

