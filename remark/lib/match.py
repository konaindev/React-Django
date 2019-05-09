"""
A simple utility library that allows us to match values against flexible queries.

The test_match.py implementation should give a good flavor of the utility here.
"""


def _str(v):
    return str(v) if v is not None else ""


_MATCHERS = {
    "eq": lambda v, t: v == t,
    "gt": lambda v, t: v > t,
    "gte": lambda v, t: v >= t,
    "lt": lambda v, t: v < t,
    "lte": lambda v, t: v <= t,
    "exact": lambda v, t: v == t,  # synonym for eq
    "iexact": lambda v, t: _str(v).casefold() == t.casefold(),
    "startswith": lambda v, t: _str(v).startswith(t),
    "istartswith": lambda v, t: _str(v).casefold().startswith(t.casefold()),
    "contains": lambda v, t: t in _str(v),
    "icontains": lambda v, t: t.casefold() in _str(v).casefold(),
    "endswith": lambda v, t: v.endswith(t),
    "iendswith": lambda v, t: v.casefold().endswith(t.casefold()),
}

_DESCRIPTIONS = {
    "eq": lambda l, r: f"{l} == {r}",
    "gt": lambda l, r: f"{l} > {r}",
    "gte": lambda l, r: f"{l} >= {r}",
    "lt": lambda l, r: f"{l} < {r}",
    "lte": lambda l, r: f"{l} <= {r}",
    "exact": lambda l, r: f"{l} == {r}",
    "iexact": lambda l, r: f"{l} == {r} (case insensitive)",
    "startswith": lambda l, r: f"{l}.starts_with({r})",
    "istartswith": lambda l, r: f"{l}.starts_with({r}) (case insensitive)",
    "contains": lambda l, r: f"{l}.contains({r})",
    "icontains": lambda l, r: f"{l}.contains({r}) (case insensitive)",
    "endswith": lambda l, r: f"{l}.ends_with({r})",
    "iendswith": lambda l, r: f"{l}.ends_with({r}) (case insensitive)",
}


def query_description(**query):
    """Given a query dictionary, provide a human-readable description."""

    def _description(k, v):
        if isinstance(v, str):
            v = f'"{v}"'
        return _DESCRIPTIONS[k]("cell", v)

    components = [_description(k, v) for k, v in query.items()]
    return " and ".join(components)


def match(v, **query):
    """
    Returns True if the `v` matches the constraints provided in `query`.

    The `query` parameters provide a set of simple but flexible matching options,
    including:

        eq, gt, gte, lt, lte, 
        exact, iexact, startswith, istartswith, contains, icontains, endswith, iendswith

    These are similar to value filters in Django querysets.
    """
    return all((_MATCHERS[k](v, t) for k, t in query.items()))


def matchp(**query):
    """
    Returns a predicate that invokes match(...) on the supplied value
    """
    predicate = lambda v: match(v, **query)  # noqa
    predicate.description = query_description(**query)
    return predicate
