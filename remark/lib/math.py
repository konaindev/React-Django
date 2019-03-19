from functools import reduce

from decimal import Decimal, ROUND_HALF_UP


def swallow_none(op, default):
    """
    Return a function that safely wraps a binary operation, `op`,
    so that None values are treated as `default` instead.
    """

    def wrapped_op(a, b):
        return op(default if a is None else a, default if b is None else b)

    return wrapped_op


def propagate_none(op):
    """
    Return a function that safely wraps a binary operation, `op`,
    so that None values are propagated outward.
    """

    def wrapped_op(a, b):
        return None if (a is None) or (b is None) else op(a, b)

    return wrapped_op


def op_sum(a, b):
    return a + b


def op_sub(a, b):
    return a - b


def op_mult(a, b):
    return a * b


def sum_or_0(*values):
    """
    Sum all values. If any of them is None, substitute 0 instead.
    """
    return reduce(swallow_none(op_sum, 0), values, 0)


def sum_or_none(*values):
    """
    Sum all values. If any of them is None, return None.
    """
    return reduce(propagate_none(op_sum), values, 0)


def sub_or_0(*values):
    """
    Subtract all values, in order. If any is None, substitute 0 instead.
    """
    return reduce(swallow_none(op_sub, 0), values)


def sub_or_none(*values):
    """
    Subtract all values, in order. If any is None, substitie None instead.
    """
    return reduce(propagate_none(op_sub), values)


def mult_or_0(*values):
    """
    Multiple all values. If any of them is None, substitute 0 instead.
    """
    return reduce(swallow_none(op_mult, 0), values, 1)


def mult_or_1(*values):
    """
    Multiply all values. If any of them is None, substitute 1 instead.
    """
    return reduce(swallow_none(op_mult, 1), values, 1)


def mult_or_none(*values):
    """
    Multiply all values. If any of them is None, return None.
    """
    return reduce(propagate_none(op_mult), values, 1)


def div_or_default(a, b, default):
    """
    Divide a and b. If either is None, or if b is 0, return `default`.
    """
    return default if (a is None) or (b is None) or (b == 0) else a / b


def div_or_0(a, b):
    """
    Divide a and b. If either is None, or if b is 0, return 0.
    """
    return div_or_default(a, b, 0)


def div_or_none(a, b):
    """
    Divide a and b. If either is None, or if b is 0, return None.
    """
    return div_or_default(a, b, None)


def avg_or_0(values):
    return sum(values) / len(values) if values else 0


def avg_or_none(values):
    return sum(values) / len(values) if values else None


def d_div_or_0(a, b):
    """
    Divide a and b as Python decimals. If either is None, or if b is 0, return 0.
    """
    return div_or_0(
        None if a is None else Decimal(a), None if b is None else Decimal(b)
    )


def d_div_or_none(a, b):
    """
    Divide a and b as Python decimals. If either is None, or if b is 0, return None.
    """
    return div_or_default(
        None if a is None else Decimal(a), None if b is None else Decimal(b), None
    )


def round_or_none(v):
    """
    Return the round of a value, or None if the value is None already.
    """
    return None if v is None else round(v)


def d_quant_currency(d):
    """
    Return d as a Python decimal with at most two decimal places.

    Round in a fashion appropriate for currency.

    Propagate None values outward.
    """
    return (
        None
        if d is None
        else Decimal(d).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    )


def d_quant_perc(d):
    """
    Return d as a Python decimal with at most three decimal places.

    Round in a fashion appropriate for percentages.

    Propagate None values outward.
    """
    return (
        None
        if d is None
        else Decimal(d).quantize(Decimal("0.001"), rounding=ROUND_HALF_UP)
    )


def d_quant(d, form, rounding=ROUND_HALF_UP):
    """
    Return d as a Python decimal with arbitrary rounding based on the 
    `form` (a Decimal) and a `rounding` constant.

    If `d` is `None`, propagate `None` outward.
    """
    return None if d is None else Decimal(d).quantize(form, rounding=rounding)

