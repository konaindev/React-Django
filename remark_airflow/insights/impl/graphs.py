from graphkit import compose

from remark_airflow.insights.impl.utils import cop
from remark_airflow.insights.impl.vars_base import (
    var_base_kpis,
    var_base_targets,
    var_computed_kpis,
    var_target_computed_kpis,
    var_usv_exe,
    var_target_usv_exe,
    var_usv_exe_health_status,
    var_kpi,
    var_target_kpi,
    var_kpi_health,
    var_base_kpis_without_pre_leasing_stage,
)

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

kpi_graph = compose(name="kpi_graph")(
    cop(var_base_kpis, "project", "start", "end"),
    cop(var_computed_kpis, var_base_kpis),
    cop(var_kpi, var_computed_kpis, "kpi_name"),
)

kpi_graph_without_pre_leasing_stage = compose(
    name="kpi_graph_without_pre_leasing_stage"
)(
    cop(var_base_kpis_without_pre_leasing_stage, "project", "start", "end"),
    cop(var_computed_kpis, var_base_kpis_without_pre_leasing_stage),
    cop(var_kpi, var_computed_kpis, "kpi_name"),
)

target_kpi_graph = compose(name="target_kpi_graph")(
    cop(var_base_kpis, "project", "start", "end"),
    cop(var_base_targets, "project", "start", "end"),
    cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
    cop(var_target_kpi, var_target_computed_kpis, "kpi_name"),
)

kpi_healths_graph = compose(name="kpi_healths_graph", merge=True)(
    kpi_graph, target_kpi_graph, cop(var_kpi_health, var_kpi, var_target_kpi)
)
