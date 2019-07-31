from remark.lib.time_series.common import KPI


def _health_standard(stat, stat_target):
    stat_type = type(stat)
    if stat == stat_type(0):
        return 0

    denominator = stat_type(stat_target)
    if denominator == 0:
        return 2

    percent = stat / denominator
    if percent > stat_type(0.95):
        return 2
    elif percent > stat_type(0.75):
        return 1
    else:
        return 0


def _health_currency_range(stat, stat_target):
    stat_type = type(stat)
    ten_percent = stat_target * stat_type(0.10)
    if stat >= stat_target - ten_percent and stat <= stat_target + ten_percent:
        return 2

    thirty_percent = ten_percent * stat_type(3)
    if stat >= stat_target - thirty_percent and stat <= stat_target + thirty_percent:
        return 1

    return 0


def _health_down_is_good(stat, stat_target):
    stat_type = type(stat)
    if stat <= stat_target:
        return 2

    if stat <= stat_target * stat_type(1.3):
        return 1

    return 0


HEALTH_EXCEPTIONS = {
    KPI.investment: _health_currency_range,

    KPI.acq_investment: _health_currency_range,
    KPI.acq_demand_creation: _health_currency_range,
    KPI.acq_leasing_enablement: _health_currency_range,
    KPI.acq_market_intelligence: _health_currency_range,
    KPI.acq_reputation_building: _health_currency_range,

    KPI.ret_investment: _health_currency_range,
    KPI.ret_demand_creation: _health_currency_range,
    KPI.ret_leasing_enablement: _health_currency_range,
    KPI.ret_market_intelligence: _health_currency_range,
    KPI.ret_reputation_building: _health_currency_range,

    KPI.exe_cost: _health_down_is_good,
    KPI.app_cost: _health_down_is_good,
    KPI.tou_cost: _health_down_is_good,
    KPI.inq_cost: _health_down_is_good,
    KPI.usv_cost: _health_down_is_good
}


def health_check(stat, stat_target):
    return _health_standard(stat, stat_target)


def get_kpi_health(stat, stat_target, kpi_name):
    if kpi_name in HEALTH_EXCEPTIONS:
        return HEALTH_EXCEPTIONS[kpi_name](stat, stat_target)

    return _health_standard(stat, stat_target)


