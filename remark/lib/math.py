from decimal import localcontext, Context, Decimal, ROUND_HALF_EVEN, ROUND_HALF_UP

# TODO this is a grab bag of trivial tools. They probably belong elsewhere,
# or should be entirely redesigned, etc. YMMV. -Dave


def d_div(a, b):
    """
    Return a/b as a Python decimal.

    Operations are applied in the default Decimal context for this thread.

    Example: d_div(6, 3) = Decimal("2")

    Safety: if b is 0 or None, returns Decimal(0)
    """
    return Decimal(a) / Decimal(b) if b else Decimal(0)


def d_quant_currency(d):
    """
    Return d as a Python decimal with at most two decimal places.

    Round in a fashion appropriate for currency.
    """
    return Decimal(d).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def d_quant_perc(d):
    """
    Return d as a Python decimal with at most three decimal places.

    Round in a fashion appropriate for percentages.
    """
    return Decimal(d).quantize(Decimal("0.001"), rounding=ROUND_HALF_EVEN)
