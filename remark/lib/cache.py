from django.core.cache import cache


TIMEOUT_1_HOUR = 60 * 60
TIMEOUT_1_DAY = TIMEOUT_1_HOUR * 24
TIMEOUT_1_WEEK = TIMEOUT_1_DAY * 7


def remark_cache(base_key, timeout=TIMEOUT_1_HOUR, version=0):
    """
    :param base_key: the static part of the key - the dynamic arguments will get added to it
    :param timeout: the cache timeout in seconds, there's a few helper constants in the library - not required defaults to one hour
    :param version: the version of the cache in case you change the object being cached - not required, defaults to zero
    :return: a decorator that will cache the result of the function when the params are the same
    """
    def decorator(function):
        def wrapper(*args, **kwargs):
            key = f"{base_key}|"
            for i in range(len(args)):
                key += f"arg{i}={str(args[i])};"
            for kw in kwargs:
                key += f"{kw}={str(kwargs[kw])}"

            result = cache.get(key)
            if result is None:
                result = function(*args, **kwargs)
                cache.set(key, result, timeout, version)

            return result
        return wrapper
    return decorator

