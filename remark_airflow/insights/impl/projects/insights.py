from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.triggers import (
    trigger_is_active_campaign,
    trigger_health_status_is_changed,
    trigger_usv_exe_off_track,
    trigger_usv_exe_at_risk,
    trigger_usv_exe_on_track,
    trigger_retention_rate_health,
    trigger_has_data_google_analytics
)
from remark_airflow.insights.impl.utils import cop
from remark_airflow.insights.impl.vars import (
    var_campaign_health_status,
    var_prev_health_status,
    var_current_period_leased_rate,
    var_target_leased_rate,
    var_computed_kpis,
    var_base_targets,
    var_base_kpis,
    var_usv_exe_health_status,
    var_usv_exe,
    var_target_usv_exe,
    var_target_computed_kpis,
    var_weeks_usv_exe_off_track,
    var_kpi_usv_exe_off_track,
    var_weeks_usv_exe_at_risk,
    var_kpi_usv_exe_at_risk,
    var_weeks_usv_exe_on_track,
    var_kpi_usv_exe_on_track,
    var_retention_rate_health,
    var_retention_rate_health_weeks,
    var_retention_rate_trend,
    var_retention_rate,
    var_target_retention_rate,
    var_prev_retention_rate,
    var_top_usv_referral,
)


lease_rate_against_target = Insight(
    name="lease_rate_against_target",
    template="Property is {{ var_current_period_leased_rate | format_percent }}"
    " Leased against period target of {{ var_target_leased_rate | format_percent }},"
    " assessed as {{ var_campaign_health_status | health_status_to_str }}.",
    triggers=["trigger_is_active_campaign"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_prev_health_status, "project", "start"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_current_period_leased_rate, var_computed_kpis),
        cop(var_target_leased_rate, var_base_targets),
        cop(
            var_campaign_health_status,
            var_current_period_leased_rate,
            var_target_leased_rate,
        ),
        cop(
            trigger_is_active_campaign,
            "project",
            "start",
            var_campaign_health_status,
            var_prev_health_status,
        ),
    ],
)

change_health_status = Insight(
    name="change_health_status",
    template="Campaign health has changed from {{var_prev_health_status | health_status_to_str}}"
    " to {{var_campaign_health_status | health_status_to_str }} during this period.",
    triggers=["trigger_health_status_is_changed"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_prev_health_status, "project", "start"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_current_period_leased_rate, var_computed_kpis),
        cop(var_target_leased_rate, var_base_targets),
        cop(
            var_campaign_health_status,
            var_current_period_leased_rate,
            var_target_leased_rate,
        ),
        cop(
            trigger_health_status_is_changed,
            var_campaign_health_status,
            var_prev_health_status,
        ),
    ],
)

usv_exe_off_track = Insight(
    name="usv_exe_off_track",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been Off Track for {{ var_weeks_usv_exe_off_track }} of Weeks"
    " your {{ var_kpi_usv_exe_off_track }} has negatively impacted it most.",
    triggers=["trigger_usv_exe_off_track"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_weeks_usv_exe_off_track, "project", "start", "end"),
        cop(var_kpi_usv_exe_off_track, "project", var_weeks_usv_exe_off_track, "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
        cop(var_usv_exe, var_computed_kpis),
        cop(var_target_usv_exe, var_target_computed_kpis),
        cop(var_usv_exe_health_status, var_usv_exe, var_target_usv_exe),
        cop(trigger_usv_exe_off_track, var_usv_exe_health_status),
    ],
)

usv_exe_at_risk = Insight(
    name="usv_exe_at_risk",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been At Risk for {{ var_weeks_usv_exe_at_risk }} of Weeks"
    " your {{ var_kpi_usv_exe_at_risk }} has negatively impacted it most. ",
    triggers=["trigger_usv_exe_at_risk"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_weeks_usv_exe_at_risk, "project", "start", "end"),
        cop(var_kpi_usv_exe_at_risk, "project", var_weeks_usv_exe_at_risk, "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
        cop(var_usv_exe, var_computed_kpis),
        cop(var_target_usv_exe, var_target_computed_kpis),
        cop(var_usv_exe_health_status, var_usv_exe, var_target_usv_exe),
        cop(trigger_usv_exe_at_risk, var_usv_exe_health_status),
    ],
)

usv_exe_on_track = Insight(
    name="usv_exe_on_track",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been On Track for {{ var_weeks_usv_exe_on_track }} of Weeks"
    " your {{ var_kpi_usv_exe_on_track }} has positively impacted it most.",
    triggers=["trigger_usv_exe_on_track"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_weeks_usv_exe_on_track, "project", "start", "end"),
        cop(var_kpi_usv_exe_on_track, "project", var_weeks_usv_exe_on_track, "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
        cop(var_usv_exe, var_computed_kpis),
        cop(var_target_usv_exe, var_target_computed_kpis),
        cop(var_usv_exe_health_status, var_usv_exe, var_target_usv_exe),
        cop(trigger_usv_exe_on_track, var_usv_exe_health_status),
    ],
)


retention_rate_health = Insight(
    name="retention_rate_health",
    template="Your Retention Rate has been {{ var_retention_rate_health | health_status_to_str }}"
    " for {{ var_retention_rate_health_weeks }}"
    " and is trending {{ var_retention_rate_trend }}.",
    triggers=["trigger_retention_rate_health"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_prev_retention_rate, "project", "start"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_target_computed_kpis, var_base_kpis, var_base_targets),
        cop(var_retention_rate, var_computed_kpis),
        cop(var_target_retention_rate, var_target_computed_kpis),
        cop(var_retention_rate_health, var_retention_rate, var_target_retention_rate),
        cop(
            var_retention_rate_health_weeks,
            "project",
            "start",
            var_retention_rate_health,
        ),
        cop(var_retention_rate_trend, var_retention_rate, var_prev_retention_rate),
        cop(trigger_retention_rate_health, var_retention_rate_health),
    ],
)


top_usv_referral = Insight(
    name="top_usv_referral",
    template="{{ var_top_usv_referral }} is your top source of Unique Site Visitors (USV) volume, this period.",
    triggers=["trigger_has_data_google_analytics"],
    graph=[
        cop(var_top_usv_referral, "project", "start", "end"),
        cop(trigger_has_data_google_analytics, var_top_usv_referral),
    ],
)
