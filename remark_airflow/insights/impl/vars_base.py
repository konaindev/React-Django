from remark.lib.time_series.computed import (
    generate_computed_kpis,
    generate_computed_targets,
)
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark_airflow.insights.impl.utils import health_standard


def var_base_kpis(project, start, end):
    base_kpis = get_base_kpis_for_project(project, start, end)
    return base_kpis


def var_base_targets(project, start, end):
    base_targets = get_targets_for_project(project, start, end)
    return base_targets


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


def var_kpi(computed_kpis, kpi_name):
    if computed_kpis is None:
        return None
    return computed_kpis.get(kpi_name, None)


def var_target_kpi(computed_kpis, kpi_name):
    return var_kpi(computed_kpis, kpi_name)


def var_kpi_health(kpi, target_kpi):
    return health_standard(kpi, target_kpi)
