import functools

from graphkit import operation

from remark.projects.constants import BENCHMARK_KPIS


def to_percentage(value):
    percentage = value * 100
    return f"{percentage:.0f}%"


def health_status_to_str(health_status):
    statuses = {-1: "Campaign Pending", 0: "Off Track", 1: "At Risk", 2: "On Track"}
    return statuses[health_status]


def format_percent(value):
    if value is None:
        return "-"
    return f"{value:.0%}"


def benchmark_kpi_humanize(kpi_key):
    return BENCHMARK_KPIS[kpi_key]


def hash_dict(func):
    """Transform mutable dictionnary
    Into immutable
    Useful to be compatible with cache
    """

    class HDict(dict):
        def __hash__(self):
            return hash(frozenset(self.items()))

    @functools.wraps(func)
    def wrapped(*args, **kwargs):
        args = tuple([HDict(arg) if isinstance(arg, dict) else arg for arg in args])
        kwargs = {k: HDict(v) if isinstance(v, dict) else v for k, v in kwargs.items()}
        return func(*args, **kwargs)

    return wrapped


# We want to cache the response to operations if the arguments are the same
# cache_operation -> cop
def cop(func, *needs):
    name = func.__name__
    func = hash_dict(functools.lru_cache()(func))
    actual_needs = []
    for need in needs:
        if type(need) is str:
            actual_needs.append(need)
        else:
            actual_needs.append(need.__name__)
    return operation(name=f"{name}_op", needs=actual_needs, provides=[name])(func)


def health_standard(stat, stat_target):
    if stat is None or stat_target is None:
        return -1

    stat_type = type(stat)
    if stat == stat_type(0):
        return 0

    denominator = stat_type(stat_target)
    if denominator == 0:
        return 2

    percent = stat / denominator
    if percent < stat_type(0.75):
        return 0
    elif stat_type(0.75) <= percent < stat_type(1):
        return 1
    else:
        return 2
