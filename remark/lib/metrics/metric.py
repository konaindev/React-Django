from .errors import InvalidMetricOperation
from .timevalue import TimeValueCollection


class MetricBase:
    """
    A Metric is an object that defines how to manipulate a class of values in 
    time. Every metric must implement two operations, merge(...) and separate(...),
    as defined below. Metrics may optionally override the base implementation
    of unify(...) although this is unlikely to be necessary in practice.
    """

    # -------------------------------------------------------------------
    # Public API for a Metric
    # -------------------------------------------------------------------

    def merge(self, *time_values):
        """
        Given a potentially unordered collection of TimeValue, return a single
        TimeValue whose extents are determined by the earliest and latest of
        the included time values, and whose value is determined by the Metric's
        merge technique.

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        time_value_collection = TimeValueCollection(time_values)
        return self.merge_collection(time_value_collection)

    def separate(self, when, time_value):
        """
        Separate a single TimeValue into two based on an intervening time.

        Returns a tuple of TimeValues (tv1, tv2) where tv1.end == when,
        and tv2.start == when.

        Raises InvalidMetricOperation if the value is not separable at the
        requested time.
        """
        self.check_separate_preconditions(when, time_value)
        return self.perform_separate(when, time_value)

    def unify(self, start, end, *time_values):
        """
        Combine an arbitrary set of TimeValues into a single value whose
        boundaries *precisely* correspond to the requested start and end date.

        It's worth comparing this with merge(...), whose start and end dates
        are implicitly determined by the provided time_values, and which returns
        a TimeValue rather than a raw value.

        Raises an InvalidMetricOperation if preconditions are not met.
        """
        time_value_collection = TimeValueCollection(time_values)
        return self.unify_collection(start, end, time_value_collection)

    # -------------------------------------------------------------------
    # Collection ("advanced public") API for Metric
    # -------------------------------------------------------------------

    def merge_collection(self, time_values):
        """
        Check preconditions and invoke the underlying merge implementation.

        For efficiency, we expect time_values to be a TimeValueCollection;
        smart calling methods can skip calling merge(...) and go directly
        to merge_collection(...).
        """
        if not isinstance(time_values, TimeValueCollection):
            raise InvalidMetricOperation(
                "MetricBase.merge_collection: time_values must be a TimeValueCollection"
            )

        # Return nothing if there are no values...
        if len(time_values) == 0:
            return None

        # Nothing to merge if there's only one value...
        if len(time_values) == 1:
            return time_values[0]

        # Ensure a sort order by start. (This is a no-op if the collection is
        # already so ordered).
        time_values = time_values.order_by_start()

        # Ensure preconditions are met
        self.check_merge_preconditions(time_values)

        # Run the merge!
        return self.perform_merge(time_values)

    def unify_collection(self, start, end, time_values):
        """
        Check preconditions and invoke the underlying unify implementation.

        For efficiency, we expect time_values to be a TimeValueCollection;
        smart calling methods can skip calling unify(...) and go directly
        to unify_collection(...).
        """
        if not isinstance(time_values, TimeValueCollection):
            raise InvalidMetricOperation(
                "MetricBase.unify_collection: time_values must be a TimeValueCollection"
            )

        self.check_unify_preconditions(start, end, time_values)

        return self.perform_unify(start, end, time_values)

    # -------------------------------------------------------------------
    # Precondition-checking APIs (derived classes *may* override)
    # -------------------------------------------------------------------

    def check_merge_preconditions(self, time_values):
        """
        Given a TimeValueCollection, raise an InvalidMetricOperation if
        something about the time values prevents merging. Otherwise, return
        silently.

        Derived classes may override this.
        """
        return

    def check_separate_preconditions(self, when, time_value):
        """
        Given a separation time (`when`) and a TimeValue, raise an
        InvalidMetricOperation if separation cannot be performed. Otherwise,
        return silently.

        Derived classes may override this.
        """
        return

    def check_unify_preconditions(self, start, end, time_values):
        """
        Given a start and end time and a TimeValueCollections, raise
        an InvalidMetricOperation if unification cannot be performed. Otherwise,
        return silently.

        Derived classes may override this.
        """
        return

    # -------------------------------------------------------------------
    # Implementations that derived classes *must* override
    # -------------------------------------------------------------------

    def perform_merge(self, time_values):
        """
        The underlying merge implementation. time_values is a TimeValueCollection,
        sorted by start, and all preconditions for merging are checked.

        Derived classes must override this.
        """
        raise NotImplementedError("Derived classes must implement perform_merge")

    def perform_separate(self, when, time_value):
        """
        The underlying separate implementation. 

        Derived classes must override this.
        """
        raise NotImplementedError("Derived classes must implement perform_separate")

    def perform_unify(self, start, end, time_values):
        """
        The underlying unify implementation. time_values is a TimeValueCollection,
        sorted by start, and all preconditions for unification are checked.

        Derived classes must override this.
        """
        raise NotImplementedError("Derived classes must implement perform_unify")

