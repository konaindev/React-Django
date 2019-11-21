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

    def __str__(self):
        return f"{type(self).__name__}: {self.get_start()} - {self.get_end()}"


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
