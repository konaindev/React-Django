from remark.lib.math import d_quant_currency


def date_converter(d):
    """Return a date from a datetime."""
    return d.date()


def currency_converter(v):
    """Return a Decimal currency value."""
    return d_quant_currency(v)
