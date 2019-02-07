import functools


def computed_property(f):
    """
    If the wrapped function raises an Attribute error, replace that with
    a RuntimeError instead.

    This is useful for our various report classes: typically, they
    delegate to other underlying classes via __getattr__(...). But
    it turns out that if you have an @property with a bug in it, the
    @property decorator will raise an AttributeError on your behalf;
    as a result, __getattr__(...) will be invoked even if you'd
    prefer it wasn't!
    """

    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except AttributeError as e:
            raise RuntimeError(
                "{} failed with an AttributeError: {}".format(f.__name__, e)
            )

    return property(wrapped)

