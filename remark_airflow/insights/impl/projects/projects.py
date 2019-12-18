from graphkit import compose

from remark_airflow.insights.impl.triggers import (
    trigger_is_active_campaign,
    trigger_campaign_health_status_off_track,
    trigger_health_status_is_changed,
    trigger_usv_exe_off_track,
)
from remark_airflow.insights.impl.utils import cop
from remark_airflow.insights.impl.vars import (
    var_campaign_health_status,
    var_current_period_leased_rate,
    var_target_leased_rate,
    var_prev_health_status,
    var_project,
    var_base_kpis,
    var_base_targets,
    var_weeks_usv_exe_off_track,
    usv_exe_health_graph,
    var_kpi_usv_exe_off_track,
)


def get_project_facts(project_id, start, end):
    project_graph = compose(name="project_graph", merge=True)(
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_current_period_leased_rate, var_base_kpis),
        cop(var_target_leased_rate, var_base_targets),
        cop(
            var_campaign_health_status,
            var_current_period_leased_rate,
            var_target_leased_rate,
        ),
        cop(var_prev_health_status, "project", "start"),
        cop(
            trigger_is_active_campaign,
            "project",
            "start",
            var_campaign_health_status,
            var_prev_health_status,
        ),
        cop(trigger_campaign_health_status_off_track, var_campaign_health_status),
        cop(
            trigger_health_status_is_changed,
            var_campaign_health_status,
            var_prev_health_status,
        ),
        usv_exe_health_graph,
        cop(var_weeks_usv_exe_off_track, "project", "start", "end"),
        cop(var_kpi_usv_exe_off_track, "project", var_weeks_usv_exe_off_track, "end"),
        cop(trigger_usv_exe_off_track, "var_usv_exe_health_status"),
    )
    project = var_project(project_id)
    args = {"start": start, "end": end, "project": project}
    data = project_graph(args)
    for k in args:
        del data[k]
    return data


def get_project_insights(project_facts, project_insights):
    final_insights = {}

    for project_insight in project_insights:
        result = project_insight.evaluate(project_facts)
        if result is not None:
            name, text = result
            final_insights[name] = text

    return final_insights
