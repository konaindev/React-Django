import decimal


def d_div(a, b):
    """
    Return a/b as a Python decimal.

    Example: d_div(6, 3) = Decimal("2")

    Safety: if b is 0 or None, returns Decimal(0)
    """
    return decimal.Decimal(a) / decimal.Decimal(b) if b else decimal.Decimal(0)
