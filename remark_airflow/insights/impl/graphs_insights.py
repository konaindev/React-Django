from graphkit import compose

from remark.projects.constants import HEALTH_STATUS
from remark_airflow.insights.impl.triggers import trigger_kpi_mitigated
from remark_airflow.insights.impl.utils import cop
from remark_airflow.insights.impl.vars import (
    var_kpis_healths_statuses,
    var_kpi_mitigation,
    var_unpack_kpi,
    var_kpi_health_weeks,
)
from remark_airflow.insights.impl.vars_base import (
    var_base_kpis,
    var_base_targets,
    var_computed_kpis,
    var_target_computed_kpis,
)


graph_kpi_off_track_mitigated = compose(name="kpi_off_track_mitigated", merge=True)(
    cop(var_base_kpis, "project", "start", "end"),
    cop(var_base_targets, "project", "start", "end"),
    cop(var_computed_kpis, var_base_kpis),
    cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
    cop(var_kpis_healths_statuses, var_computed_kpis, var_target_computed_kpis),
    cop(
        var_kpi_mitigation,
        var_kpis_healths_statuses,
        var_computed_kpis,
        var_target_computed_kpis,
        params={"target_health": HEALTH_STATUS["OFF_TRACK"]},
        name="var_kpi_off_track_mitigated",
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_off_track_mitigated",
        name="kpi_off_track_a",
        params={"index": 0},
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_off_track_mitigated",
        name="kpi_off_track_b",
        params={"index": 1},
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_off_track_mitigated",
        name="kpi_off_track_c",
        params={"index": 2},
    ),
    cop(
        var_kpi_health_weeks,
        "project",
        "start",
        "end",
        "kpi_off_track_a",
        name="var_kpi_off_track_weeks",
        params={"health_target": HEALTH_STATUS["OFF_TRACK"]},
    ),
    cop(
        trigger_kpi_mitigated,
        "kpi_off_track_a",
        "var_kpi_off_track_weeks",
        name="trigger_kpi_off_track_mitigated",
    ),
)


graph_kpi_at_risk_mitigated = compose(name="kpi_at_risk_mitigated", merge=True)(
    cop(var_base_kpis, "project", "start", "end"),
    cop(var_base_targets, "project", "start", "end"),
    cop(var_computed_kpis, var_base_kpis),
    cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
    cop(var_kpis_healths_statuses, var_computed_kpis, var_target_computed_kpis),
    cop(
        var_kpi_mitigation,
        var_kpis_healths_statuses,
        var_computed_kpis,
        var_target_computed_kpis,
        params={"target_health": HEALTH_STATUS["AT_RISK"]},
        name="var_kpi_at_risk_mitigated",
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_at_risk_mitigated",
        name="kpi_at_risk_a",
        params={"index": 0},
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_at_risk_mitigated",
        name="kpi_at_risk_b",
        params={"index": 1},
    ),
    cop(
        var_unpack_kpi,
        "var_kpi_at_risk_mitigated",
        name="kpi_at_risk_c",
        params={"index": 2},
    ),
    cop(
        var_kpi_health_weeks,
        "project",
        "start",
        "end",
        "kpi_at_risk_a",
        name="var_kpi_at_risk_weeks",
        params={"health_target": HEALTH_STATUS["AT_RISK"]},
    ),
    cop(
        trigger_kpi_mitigated,
        "kpi_at_risk_a",
        "var_kpi_at_risk_weeks",
        name="trigger_kpi_at_risk_mitigated",
    ),
)
