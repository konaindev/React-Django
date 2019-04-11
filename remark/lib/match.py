"""
A simple utility library that allows us to match values against flexible queries.

The test_match.py implementation should give a good flavor of the utility here.
"""


_MATCHERS = {
    "eq": lambda v, t: v == t,
    "gt": lambda v, t: v > t,
    "gte": lambda v, t: v >= t,
    "lt": lambda v, t: v < t,
    "lte": lambda v, t: v <= t,
    "exact": lambda v, t: v == t,  # synonym for eq
    "iexact": lambda v, t: v.casefold() == t.casefold(),
    "startswith": lambda v, t: v.startswith(t),
    "istartswith": lambda v, t: v.casefold().startswith(t.casefold()),
    "contains": lambda v, t: t in v,
    "icontains": lambda v, t: t.casefold() in v.casefold(),
    "endswith": lambda v, t: v.endswith(t),
    "iendswith": lambda v, t: v.casefold().endswith(t.casefold()),
}


def match(v, **query):
    """
    Returns True if the `v` matches the constraints provided in `query`.

    The `query` parameters provide a set of simple but flexible matching options,
    including:

        eq, gt, gte, lt, lte, 
        exact, iexact, startswith, istartswith, contains, icontains, endswith, iendswith

    These are similar to value filters in Django querysets.
    """
    return all((_MATCHERS[k](v or "", t) for k, t in query.items()))


def matchp(**query):
    """
    Returns a predicate that invokes match(...) on the supplied value
    """
    return lambda v: match(v, **query)
