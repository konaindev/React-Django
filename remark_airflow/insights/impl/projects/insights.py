from remark.projects.constants import HEALTH_STATUS
from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.graphs_insights import (
    graph_kpi_at_risk_mitigated,
    graph_kpi_off_track_mitigated,
)
from remark_airflow.insights.impl.triggers import (
    trigger_is_active_campaign,
    trigger_health_status_is_changed,
    trigger_usv_exe_off_track,
    trigger_usv_exe_at_risk,
    trigger_usv_exe_on_track,
    trigger_retention_rate_health,
    trigger_has_data_google_analytics,
    trigger_have_benchmark_kpi,
    trigger_kpi_not_mitigated,
    trigger_kpi_trend_change_health,
    trigger_usvs_on_track,
    trigger_kpi_trend,
    trigger_healths_is_not_pending,
)
from remark_airflow.insights.impl.utils import cop
from remark_airflow.insights.impl.vars import (
    var_campaign_health_status,
    var_prev_health_status,
    var_current_period_leased_rate,
    var_target_leased_rate,
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
    var_benchmark_kpis,
    var_kpi_for_benchmark,
    var_low_performing_kpi,
    var_below_average_kpi,
    var_high_performing_kpi,
    var_above_average_kpi,
    var_kpi_without_mitigated,
    var_kpi_health_weeks,
    var_all_base_kpis,
    var_all_target_kpis,
    var_all_computed_kpis,
    var_all_target_computed_kpis,
    var_kpis_trends,
    var_kpis_healths_statuses,
    var_predicting_change_health,
    var_predicted_kpi,
    var_kpi_trend,
)
from remark_airflow.insights.impl.vars_base import (
    var_base_kpis,
    var_base_targets,
    var_computed_kpis,
    var_target_computed_kpis,
    var_usv_exe,
    var_target_usv_exe,
    var_usv_exe_health_status,
    var_base_kpis_without_pre_leasing_stage,
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
            var_current_period_leased_rate,
            var_target_leased_rate,
        ),
    ],
)

change_health_status = Insight(
    name="change_health_status",
    template="Campaign health has changed from {{var_prev_health_status | health_status_to_str}}"
    " to {{var_campaign_health_status | health_status_to_str }} during this period.",
    triggers=["trigger_health_status_is_changed", "trigger_healths_is_not_pending"],
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
            trigger_healths_is_not_pending,
            var_campaign_health_status,
            var_prev_health_status,
        ),
        cop(
            trigger_health_status_is_changed,
            var_campaign_health_status,
            var_prev_health_status,
        ),
    ],
)

# TPC: Check the logic for picking the USV_EXE OFF Track

usv_exe_off_track = Insight(
    name="usv_exe_off_track",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate,"
    " has been Off Track for {{ var_weeks_usv_exe_off_track }} week(s)"
    " and your {{ var_kpi_usv_exe_off_track }} has negatively impacted it most.",
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
    " has been At Risk for {{ var_weeks_usv_exe_at_risk }} week(s)"
    " and your {{ var_kpi_usv_exe_at_risk }} has negatively impacted it most. ",
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
    " has been On Track for {{ var_weeks_usv_exe_on_track }} week(s)"
    " and your {{ var_kpi_usv_exe_on_track }} has positively impacted it most.",
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
    " for {{ var_retention_rate_health_weeks }} week(s)"
    " and is trending {{ var_retention_rate_trend }}.",
    triggers=["trigger_retention_rate_health"],
    graph=[
        cop(var_base_kpis_without_pre_leasing_stage, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(var_prev_retention_rate, "project", "start"),
        cop(var_computed_kpis, var_base_kpis_without_pre_leasing_stage),
        cop(
            var_target_computed_kpis,
            var_base_kpis_without_pre_leasing_stage,
            var_base_targets,
        ),
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


low_performing = Insight(
    name="low_performing",
    template="{{ var_low_performing_kpi | kpi_humanize }} is your worst performing metric compared to your Remarkably customer peer set average, this period.",
    triggers=["trigger_low_performing"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_kpi_for_benchmark, var_computed_kpis),
        cop(var_benchmark_kpis, var_kpi_for_benchmark, "project", "start", "end"),
        cop(var_low_performing_kpi, var_benchmark_kpis, var_kpi_for_benchmark),
        cop(
            trigger_have_benchmark_kpi,
            var_low_performing_kpi,
            name="trigger_low_performing",
        ),
    ],
)


kpi_below_average = Insight(
    name="kpi_below_average",
    template="{{ var_below_average_kpi | kpi_humanize }} is your worst performing metric compared to your Remarkably customer peer set average, this period.",
    triggers=["trigger_below_average"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_kpi_for_benchmark, var_computed_kpis),
        cop(var_benchmark_kpis, var_kpi_for_benchmark, "project", "start", "end"),
        cop(var_below_average_kpi, var_benchmark_kpis, var_kpi_for_benchmark),
        cop(
            trigger_have_benchmark_kpi,
            var_below_average_kpi,
            name="trigger_below_average",
        ),
    ],
)

kpi_high_performing = Insight(
    name="kpi_high_performing",
    template="{{ var_high_performing_kpi | kpi_humanize }} is your best performing metric compared to your Remarkably customer peer set average, this period.",
    triggers=["trigger_high_performing"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_kpi_for_benchmark, var_computed_kpis),
        cop(var_benchmark_kpis, var_kpi_for_benchmark, "project", "start", "end"),
        cop(var_high_performing_kpi, var_benchmark_kpis, var_kpi_for_benchmark),
        cop(
            trigger_have_benchmark_kpi,
            var_high_performing_kpi,
            name="trigger_high_performing",
        ),
    ],
)

kpi_above_average = Insight(
    name="kpi_above_average",
    template="{{ var_above_average_kpi | kpi_humanize }} is your best performing metric compared to your Remarkably customer peer set average, this period.",
    triggers=["trigger_above_average"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_computed_kpis, var_base_kpis),
        cop(var_kpi_for_benchmark, var_computed_kpis),
        cop(var_benchmark_kpis, var_kpi_for_benchmark, "project", "start", "end"),
        cop(var_above_average_kpi, var_benchmark_kpis, var_kpi_for_benchmark),
        cop(
            trigger_have_benchmark_kpi,
            var_above_average_kpi,
            name="trigger_above_average",
        ),
    ],
)

kpi_off_track_mitigated = Insight(
    name="kpi_off_track_mitigated",
    template="While {{ kpi_off_track_a | kpi_humanize }} is Off Track for {{ var_kpi_off_track_weeks }} week(s), {{ kpi_off_track_b | kpi_humanize }} is exceeding performance target, resulting in On Track {{ kpi_off_track_c | kpi_humanize }}.",
    triggers=["trigger_kpi_off_track_mitigated"],
    graph=[graph_kpi_off_track_mitigated],
)


kpi_at_risk_mitigated = Insight(
    name="kpi_at_risk_mitigated",
    template="While {{ kpi_at_risk_a | kpi_humanize }} is At Risk for {{ var_kpi_at_risk_weeks }} week(s), {{ kpi_at_risk_b | kpi_humanize }} is exceeding performance target, resulting in On Track {{ kpi_at_risk_c | kpi_humanize }}.",
    triggers=["trigger_kpi_at_risk_mitigated"],
    graph=[graph_kpi_at_risk_mitigated],
)


kpi_off_track_not_mitigated = Insight(
    name="kpi_off_track_not_mitigated",
    template="{{ var_kpi_off_track_not_mitigated | kpi_humanize }} has been Off Track for {{ var_kpi_off_track_not_mitigated_weeks }} week(s).",
    triggers=["trigger_kpi_off_track_not_mitigated"],
    graph=[
        graph_kpi_off_track_mitigated,
        graph_kpi_at_risk_mitigated,
        cop(
            var_kpi_without_mitigated,
            "var_kpis_healths_statuses",
            "var_computed_kpis",
            "var_target_computed_kpis",
            params={"target_health": HEALTH_STATUS["OFF_TRACK"]},
            name="var_kpi_off_track_not_mitigated",
        ),
        cop(
            var_kpi_health_weeks,
            "project",
            "start",
            "end",
            "var_kpi_off_track_not_mitigated",
            name="var_kpi_off_track_not_mitigated_weeks",
            params={"health_target": HEALTH_STATUS["OFF_TRACK"]},
        ),
        cop(
            trigger_kpi_not_mitigated,
            "var_kpi_off_track_not_mitigated",
            "trigger_kpi_off_track_mitigated",
            "trigger_kpi_at_risk_mitigated",
            name="trigger_kpi_off_track_not_mitigated",
        ),
    ],
)


kpi_at_risk_not_mitigated = Insight(
    name="kpi_at_risk_not_mitigated",
    template="{{ var_kpi_at_risk_not_mitigated | kpi_humanize }} has been At Risk for {{ var_kpi_at_risk_not_mitigated_weeks }} week(s).",
    triggers=["trigger_kpi_at_risk_not_mitigated"],
    graph=[
        graph_kpi_off_track_mitigated,
        graph_kpi_at_risk_mitigated,
        cop(
            var_kpi_without_mitigated,
            "var_kpis_healths_statuses",
            "var_computed_kpis",
            "var_target_computed_kpis",
            params={"target_health": HEALTH_STATUS["AT_RISK"]},
            name="var_kpi_at_risk_not_mitigated",
        ),
        cop(
            var_kpi_health_weeks,
            "project",
            "start",
            "end",
            "var_kpi_at_risk_not_mitigated",
            name="var_kpi_at_risk_not_mitigated_weeks",
            params={"health_target": HEALTH_STATUS["AT_RISK"]},
        ),
        cop(
            trigger_kpi_not_mitigated,
            "var_kpi_at_risk_not_mitigated",
            "trigger_kpi_off_track_mitigated",
            "trigger_kpi_at_risk_mitigated",
            name="trigger_kpi_at_risk_not_mitigated",
        ),
    ],
)

kpi_trend_change_health = Insight(
    name="kpi_trend_change_health",
    template="{{ var_predicted_kpi['name'] | kpi_humanize }} has been trending {{ var_predicted_kpi['trend'] }}"
    " for {{ var_predicted_kpi['weeks'] }} week(s);"
    " if it continues for {{ var_predicted_kpi['predicted_weeks'] }} weeks,"
    " performance health is expected to change to {{ var_predicted_kpi['predicted_health'] | health_status_to_str }}.",
    triggers=["trigger_kpi_trend_change_health"],
    graph=[
        cop(var_all_base_kpis, "project", "start", "end"),
        cop(var_all_target_kpis, "project", "start", "end"),
        cop(var_all_computed_kpis, var_all_base_kpis),
        cop(var_all_target_computed_kpis, var_all_base_kpis, var_all_target_kpis),
        cop(var_kpis_trends, var_all_computed_kpis, var_all_target_computed_kpis),
        cop(
            var_kpis_healths_statuses,
            var_all_computed_kpis,
            var_all_target_computed_kpis,
        ),
        cop(var_predicting_change_health, var_kpis_trends, var_kpis_healths_statuses),
        cop(var_predicted_kpi, var_predicting_change_health, var_kpis_trends),
        cop(trigger_kpi_trend_change_health, var_predicted_kpi),
    ],
)


usvs_on_track = Insight(
    name="usvs_on_track",
    template="{{ 'usvs' | kpi_humanize }} has been On Track for {{ var_usvs_on_track_weeks }} week(s).",
    triggers=["trigger_usvs_on_track"],
    graph=[
        cop(var_base_kpis, "project", "start", "end"),
        cop(var_base_targets, "project", "start", "end"),
        cop(
            var_kpi_health_weeks,
            "project",
            "start",
            "end",
            name="var_usvs_on_track_weeks",
            params={"health_target": HEALTH_STATUS["ON_TRACK"], "kpi_name": "usvs"},
        ),
        cop(trigger_usvs_on_track, "var_usvs_on_track_weeks"),
    ],
)


kpi_trend = Insight(
    name="kpi_trend",
    template="{{ var_kpi_trend['name'] | kpi_humanize  }} has been trending "
    "{{ var_kpi_trend['trend'] }} for {{ var_kpi_trend['weeks'] }} weeks.",
    triggers=["trigger_kpi_trend"],
    graph=[
        cop(var_all_base_kpis, "project", "start", "end"),
        cop(var_all_target_kpis, "project", "start", "end"),
        cop(var_all_computed_kpis, var_all_base_kpis),
        cop(var_all_target_computed_kpis, var_all_base_kpis, var_all_target_kpis),
        cop(var_kpis_trends, var_all_computed_kpis, var_all_target_computed_kpis),
        cop(
            var_kpis_healths_statuses,
            var_all_computed_kpis,
            var_all_target_computed_kpis,
        ),
        cop(var_predicting_change_health, var_kpis_trends, var_kpis_healths_statuses),
        cop(var_predicted_kpi, var_predicting_change_health, var_kpis_trends),
        cop(var_kpi_trend, var_kpis_trends),
        cop(trigger_kpi_trend, var_predicted_kpi, var_kpi_trend),
    ],
)
