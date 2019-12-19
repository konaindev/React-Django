from datetime import timedelta

from graphkit import compose

from remark.lib.stats import health_check
from remark.lib.time_series.computed import (
    leased_rate_graph,
    generate_computed_kpis,
    generate_computed_targets,
)
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark.projects.constants import HEALTH_STATUS
from remark.projects.models import Period, TargetPeriod, Project
from remark_airflow.insights.impl.utils import health_standard, cop


def var_project(project_id):
    return Project.objects.get(public_id=project_id)


def var_base_kpis(project, start, end):
    base_kpis = get_base_kpis_for_project(project, start, end)
    return base_kpis


def var_base_targets(project, start, end):
    base_targets = get_targets_for_project(project, start, end)
    return base_targets


def var_current_period_leased_rate(base_kpis):
    if not base_kpis:
        return None
    kpi = leased_rate_graph(base_kpis)
    return kpi["leased_rate"]


def var_target_leased_rate(base_targets):
    if not base_targets:
        return None
    return base_targets["leased_rate"]


def var_campaign_health_status(leased_rate, target_leased_rate):
    health_status = health_check(leased_rate, target_leased_rate)
    return health_status


def var_prev_health_status(project, start):
    prev_period = (
        Period.objects.filter(project=project, end__lte=start).order_by("end").first()
    )
    if prev_period:
        prev_kpi = leased_rate_graph(prev_period.get_values())
        prev_leased_rate = prev_kpi["leased_rate"]
    else:
        prev_leased_rate = None

    prev_target_period = (
        TargetPeriod.objects.filter(project=project, end__lte=start)
        .order_by("end")
        .first()
    )
    if prev_target_period:
        prev_target_leased_rate = prev_target_period.target_leased_rate
    else:
        prev_target_leased_rate = None

    return health_check(prev_leased_rate, prev_target_leased_rate)

def var_computed_kpis(base_kpis):
    return generate_computed_kpis(base_kpis)

def var_target_computed_kpis(base_kpis, base_targets):
    if base_kpis is None or base_targets is None:
        return None
    kpis = base_kpis.copy()
    kpis.update(base_targets)
    return generate_computed_targets(kpis)

def var_usv_exe(computed_kpis):
    if computed_kpis is None:
        return None
    return computed_kpis["usv_exe"]

def var_target_usv_exe(target_computed_kpis):
    if target_computed_kpis is None:
        return None
    return target_computed_kpis["usv_exe"]


def var_usv_exe_health_status(usv_exe, target_usv_exe):
    health_status = health_standard(usv_exe, target_usv_exe)
    return health_status

def var_weeks_usv_exe_off_track(project, start, end):
    weeks = 0
    args = {"start": start, "end": end, "project": project}
    health  = usv_exe_health_graph(args)["var_usv_exe_health_status"]
    is_off = health == HEALTH_STATUS["OFF_TRACK"]
    while is_off:
        weeks += 1
        end = start
        start = end - timedelta(weeks=1)
        args = {"start": start, "end": end, "project": project}
        health = usv_exe_health_graph(args)["var_usv_exe_health_status"]
        is_off = health == HEALTH_STATUS["OFF_TRACK"]
    return weeks

def var_kpi_usv_exe_off_track(project, weeks, end):
    if weeks == 0:
        return None
    start = end - timedelta(weeks=weeks)
    args = {"project": project, "start": start, "end": end}
    kpis = projects_kpi_graph(args)
    computed_kpis = kpis["var_computed_kpis"]
    target_computed_kpis = kpis["var_target_computed_kpis"]
    if computed_kpis is None or target_computed_kpis is None:
        return None
    kpi_health = {
        "Volume of USV": health_standard(computed_kpis["usv_cost"], target_computed_kpis["usv_cost"]),
        "USV>INQ": health_standard(computed_kpis["usv_inq"], target_computed_kpis["usv_inq"]),
        "INQ": health_standard(computed_kpis["inq_cost"], target_computed_kpis["inq_cost"]),
        "INQ>TOU": health_standard(computed_kpis["inq_tou"], target_computed_kpis["inq_tou"]),
        "TOU": health_standard(computed_kpis["tou_cost"], target_computed_kpis["tou_cost"]),
        "TOU>APP": health_standard(computed_kpis["tou_app"], target_computed_kpis["tou_app"]),
        "APP": health_standard(computed_kpis["app_cost"], target_computed_kpis["app_cost"]),
        "C&D Rate": health_standard(computed_kpis["lease_cd_rate"], target_computed_kpis["lease_cds"]),
        "EXE": health_standard(computed_kpis["exe_cost"], target_computed_kpis["exe_cost"]),
    }
    return min(kpi_health, key=kpi_health.get)

projects_kpi_graph = compose(name="projects_kpi_graph")(
    cop(var_base_kpis, "project", "start", "end"),
    cop(var_base_targets, "project", "start", "end"),
    cop(var_computed_kpis, var_base_kpis),
    cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
)

usv_exe_health_graph = compose(name="usv_exe_health", merge=True)(
    projects_kpi_graph,
    cop(var_usv_exe, var_computed_kpis),
    cop(var_target_usv_exe, var_target_computed_kpis),
    cop(var_usv_exe_health_status, var_usv_exe, var_target_usv_exe),
)
