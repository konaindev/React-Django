from django.core.cache import cache


TIMEOUT_1_HOUR = 60 * 60
TIMEOUT_1_DAY = TIMEOUT_1_HOUR * 24
TIMEOUT_1_WEEK = TIMEOUT_1_DAY * 7


def remark_cache(base_key, timeout=TIMEOUT_1_HOUR, version=0):
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

