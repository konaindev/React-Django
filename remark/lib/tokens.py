import string
from django.utils.crypto import get_random_string


alphabet = string.ascii_lowercase + string.digits


def token(length=16):
    """Returns a new randomly generated token."""
    # Tokens are from an alphabet of length 36.
    # So the default token of length 16 is log_2(36^16) =~ 82.718 bits in size
    if length < 1:
        raise ValueError("invalid length")
    return get_random_string(length=length, allowed_chars=alphabet)


def public_id(prefix):
    """
    Return a string suitable as a unique identifier (primary key) for one of
    our data types. We generally assume these are going to be exposed to the
    client side, used in URLs, etc.

    This is intended to mimic how Stripe API objects are identified, because
    I like Stripe. :-)

    Example: public_id("usr") -> "usr_paow83jz"
    """
    return "{}_{}".format(prefix, token())
