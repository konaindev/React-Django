from collections import namedtuple
from remark.lib.collections import SortedList

from .errors import InvalidMetricOperation

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

    def first_non_null(self):
        """Return first non-null value in collection, or first if all are None."""
        for i in range(0, len(self)):
            if self[i].value is not None:
                return self[i]
        return self[0] if len(self) > 0 else None

    def last(self):
        """Return last item in collection, or None if collection is empty."""
        return self[-1] if len(self) > 0 else None

    def last_non_null(self):
        """Return first non-null value in collection, or last if all are None."""
        for i in range(len(self), 0, -1):
            if self[i - 1].value is not None:
                return self[i - 1]
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
