from collections import namedtuple
from decimal import Decimal


def merge(merge_document, split_document, ts, start, end):
    """
    This code can be minimized but it would obfuscate the logic for future engineers that have to read it.
    Leave the branching logic expanded for the time being.
    -TPC
    """
    length = len(ts)
    if length == 0:
        return None

    reduced_ts = []
    for t in ts:
        print("Evaluating t")
        print(t)
        if t["start"] == start:
            # both start at the same time
            if t["end"] <= end:
                # nothing to do here
                reduced_ts.append(t)
            elif t["end"] > end:
                left, right = split(split_document, t, end)
                reduced_ts.append(left)
            else:
                raise Exception("This exception should never be thrown")

        elif t["start"] < start:
            # The period starts before the selection period starts
            if t["end"] <= end:
                # strip off the overflow from front of period
                left, right = split(split_document, t, start)
                reduced_ts.append(right)
            elif t["end"] > end:
                # strip off the overflow from the front and end of period
                _, right = split(split_document, t, start)
                left, _ = split(split_document, right, end)
                reduced_ts.append(left)
            else:
                raise Exception("This exception should never be thrown")

        elif t["start"] > start:
            # The period starts after the selection period starts
            if t["end"] <= end:
                reduced_ts.append(t)
            elif t["end"] > end:
                left, right = split(split_document, t, end)
                reduced_ts.append(left)
            else:
                raise Exception("This exception should never be thrown")

        else:
            raise Exception("This exception should never be thrown")

        print("Result TS")
        print(reduced_ts)

    result = _merge(merge_document, reduced_ts)
    # make sure start and end times are set properly
    result["start"] = start
    result["end"] = end
    return result


# Merge Strategies
SUM = "sum"


def _merge(merge_document, ts):
    length = len(ts)
    if ts == 1:
        return ts

    result = ts[0]
    for x in range(1, length):
        print(f"_merge: x:{x}")
        for prop in merge_document:
            if merge_document[prop] == "sum":
                value = _merge_sum(result, ts[x], prop)
                print(f"value: {value}")
                result[prop] = value
            elif callable(merge_document[prop]):
                value = merge_document[prop](result, ts[x], prop, length)
                result[prop] = value
            else:
                raise Exception("Invalid merge strategy supplied")
    return result


def _merge_sum(p1, p2, prop):
    a = p1[prop]
    b = p2[prop]

    if a is None:
        a = 0
    if b is None:
        b = 0

    return a + b


# Split Strategies
LINEAR = "linear"
LINEAR_INT = "linear_int"


def split(split_document, p, when):
    result_left = {
        "start": p["start"],
        "end": when
    }
    result_right = {
        "start": when,
        "end": p["end"]
    }
    for prop in split_document.keys():
        method = split_document[prop]
        if method == "linear":
            left, right = split_linear(p, prop, when)
        elif method == "noop":
            left, right = p[prop], p[prop]
        elif callable(method):
            left, right = method(p, prop, when)
        else:
            raise Exception(f"Split method not found: {method}")
        result_right[prop] = right
        result_left[prop] = left
    return result_left, result_right


def split_linear(p, prop, when):
    total_seconds = (p["end"] - p["start"]).total_seconds()
    left_seconds = (when - p["start"]).total_seconds()

    print(p)
    value = p[prop]
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


def create_wrapper(fields):
    return namedtuple("TimePeriodWrapper", fields)


