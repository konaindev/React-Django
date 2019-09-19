from django.core.cache import cache
from django.conf import settings

TIMEOUT_1_HOUR = 60 * 60
TIMEOUT_1_DAY = TIMEOUT_1_HOUR * 24
TIMEOUT_1_WEEK = TIMEOUT_1_DAY * 7

def access_cache(key, method_to_generate_value, cache_bust=False, ttl=TIMEOUT_1_DAY):
    if cache_bust:
        cache.set(key, None)

    value = cache.get(key)

    if value is None:
        value = method_to_generate_value()
        cache.set(key, value, ttl)

    return value


def check_request_cache_bust(request):
    """
    Only for Dev and Staging (not for Production!)
    User can pass a value (currently 'cb') to check if cache needs to be busted before accessing
    """
    if settings.ENV != settings.PROD:
        return True if request.GET.get('cb', '') == 'true' else False

    return False


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

