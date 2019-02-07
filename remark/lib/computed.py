import functools


COMPUTED_PROPERTY = "__computed_property__"


def computed_property(f):
    """
    Decorator used to declare a computed @property.

    Classes that use @computed can also use ComputedPropertyMixin to 
    get an implementation of get_computed_properties() that returns a 
    dictionary from names to values.
    """

    # Under the hood, wrap f with property(...). Just to make life a little
    # easier, we also turn AttributeErrors that are raised by the underlying
    # implementation into RuntimeErrors; this prevents __getattr__(...)
    # from getting invoked on classes where there's a bug in the underlying
    # computed metric implementation. (Ask me how I learned this!)
    setattr(f, COMPUTED_PROPERTY, True)

    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except AttributeError as e:
            raise RuntimeError(
                "{} failed with an AttributeError: {}".format(f.__name__, e)
            )

    return property(wrapped)


class ComputedPropertyMixin:
    """
    Provides an implementation that exposes all @computed_property on the class.
    """

    def _is_computed_property(self, name):
        """
        Return true if a given attribute name is a computed_property.
        """
        dict_entry = self.__class__.__dict__.get(name)
        return (
            getattr(getattr(dict_entry, "fget", None), COMPUTED_PROPERTY, False) is True
        )

    def get_computed_properties(self):
        """
        Return a dictionary mapping from name to computed property value.
        """
        return {
            name: getattr(self, name)
            for name in dir(self)
            if self._is_computed_property(name)
        }
