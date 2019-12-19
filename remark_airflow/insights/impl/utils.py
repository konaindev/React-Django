import functools

from graphkit import operation


def to_percentage(value):
    percentage = value * 100
    return f"{percentage:.0f}%"


def health_status_to_str(health_status):
    statuses = {-1: "Campaign Pending", 0: "Off Track", 1: "At Risk", 2: "On Track"}
    return statuses[health_status]


# We want to cache the response to operations if the arguments are the same
# cache_operation -> cop
def cop(func, *needs):
    name = func.__name__
    func = functools.lru_cache()(func)
    actual_needs = []
    for need in needs:
        if type(need) is str:
            actual_needs.append(need)
        else:
            actual_needs.append(need.__name__)
    return operation(name=f"{name}_op", needs=actual_needs, provides=[name])(func)
