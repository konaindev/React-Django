from remark.lib.stats import health_check
from remark.lib.time_series.computed import leased_rate_graph
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark.projects.models import Period, TargetPeriod


def var_current_period_leased_rate(project, start, end):
    base_kpis = get_base_kpis_for_project(project, start, end)
    if not base_kpis:
        return None
    kpi = leased_rate_graph(base_kpis)
    return kpi["leased_rate"]


def var_target_leased_rate(project, start, end):
    base_targets = get_targets_for_project(project, start, end)
    if not base_targets:
        return None
    return base_targets["leased_rate"]


def var_campaign_health_status(project, start, end):
    leased_rate = var_current_period_leased_rate(project, start, end)
    target_leased_rate = var_target_leased_rate(project, start, end)
    health_status = health_check(leased_rate, target_leased_rate)
    return health_status


def var_prev_health_status(project, start, end):
    prev_period = (
        Period.objects.filter(project=project, end__lte=start).order_by("end").first()
    )
    if not prev_period:
        return None
    prev_kpi = leased_rate_graph(prev_period.get_values())
    prev_leased_rate = prev_kpi["leased_rate"]

    prev_target_period = (
        TargetPeriod.objects.filter(project=project, end__lte=start)
        .order_by("end")
        .first()
    )
    if not prev_target_period:
        return None
    prev_target_leased_rate = prev_target_period.target_leased_rate

    return health_check(prev_leased_rate, prev_target_leased_rate)