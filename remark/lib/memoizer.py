import functools
import os
import pickle
import tempfile
import time

from .logging import getLogger


logger = getLogger(__name__)


class Memoizer:
    """An abstract base decorator that implements generic memoization."""

    def __init__(self):
        """Initialize a memoizer, possibly with arguments in derived classes."""
        pass

    def get_key(self, args, kwargs):
        """Get the cache key for a given func invocation."""
        raise NotImplementedError()

    def contains(self, key):
        """Return True if key is in memoized cache."""
        raise NotImplementedError()

    def read(self, key):
        """Return data for key if in cache, otherwise raise an exception."""
        raise NotImplementedError()

    def write(self, key, data):
        """Write data for key to cache, overwriting extant data."""
        raise NotImplementedError()

    def memoize(self, func, args, kwargs):
        """Return cached data, or invoke the underlying func if not."""
        key = self.get_key(args, kwargs)
        if self.contains(key):
            data = self.read(key)
        else:
            logger.info(f"Invoking {func.__name__} {args} {kwargs}")
            data = func(*args, **kwargs)
            self.write(key, data)
        return data

    def __call__(self, func):
        # Since this class takes __init__ parameters, __call__ must wrap.
        self.func = func

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return self.memoize(func, args, kwargs)

        return wrapper


class file_memoize(Memoizer):
    """Memoizer that writes to a cache files directory."""

    def __init__(self, cache_dir=None):
        """
        Initialize a memoizer with a given cache directory.
        """
        super().__init__()
        self.cache_dir = cache_dir or tempfile.mkdtemp()

    def get_key(self, args, kwargs):
        # The key is the file path
        args_key = "_".join([f"{arg}" for arg in args])
        kwargs_key = "_".join([f"{k}-{v}" for k, v in kwargs.items()])
        file_name = f"{self.func.__name__}{'_' if args_key else ''}{args_key}{'_' if kwargs_key else ''}{kwargs_key}.pkl"
        path = os.path.join(self.cache_dir, file_name)
        return path

    def contains(self, key):
        return os.path.exists(key)

    def read(self, key):
        with open(key, "rb") as f:
            data = pickle.load(f)
        return data

    def write(self, key, data):
        with open(key, "wb") as f:
            pickle.dump(data, f)


class delay_file_memoize(file_memoize):
    """Memoizer that writes to a cache files directory and also delays after each memoization."""

    def __init__(self, cache_dir=None, delay=2):
        super().__init__(cache_dir=cache_dir)
        self.delay = delay

    def memoize(self, func, args, kwargs):
        result = super().memoize(func, args, kwargs)
        time.sleep(self.delay)
        return result
