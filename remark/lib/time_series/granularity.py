from decimal import Decimal

from .query import select

def merge(merge_document, base_query, start, end, hydrater=None):
    query = select(base_query, start, end)
    ts = list(query)
    length = len(ts)
    if length == 0:
        return None
    elif length == 1:
        pass
    elif length == 2:
        pass
    else:
        pass


LEFT = 0
RIGHT = 1

def split(merge_document, p, when):
    result_left = {}
    result_right = {}
    for property in merge_document.keys():
        method = merge_document[property]
        if method == "linear":
            result_left[property], result_right[property] = split_linear(p, property, when)
        elif callable(method):
            result_left[property], result_right[property] = method(p, property, when)
        else:
            raise Exception(f"Split method not found: {method}")
    return result_left, result_right


def split_linear(p, property, when):
    total_seconds = (p.end - p.start).total_seconds()
    left_seconds = (when - p.start).total_seconds()

    value = getattr(p, property)
    kind = time_value_type(value)
    if kind == int:
        left_value = round(value * (left_seconds / total_seconds))
    elif kind == float:
        left_value = value * (left_seconds / total_seconds)
    elif kind == Decimal:
        left_value = value * (
            Decimal(left_seconds) / Decimal(total_seconds)
        )
    else:
        left_value = None

    right_value = value - left_value if left_value is not None else None

    return left_value, right_value

def time_value_type(value=None):
    """
    Take a guess at the type of the underlying value for a set of
    time_values, if possible.

    Returns the type of the first value that isn't None; return None
    if no type can be determined.
    """
    return (
        None
        if (value is None)
        else type(value)
    )
