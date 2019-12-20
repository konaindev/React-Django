from remark_airflow.insights.framework.core import Insight


lease_rate_against_target = Insight(
    name="lease_rate_against_target",
    template="Property is {{ var_current_period_leased_rate | format_percent }}"
    " Leased against period target of {{ var_target_leased_rate | format_percent }},"
    " assessed as {{ var_campaign_health_status | health_status_to_str }}.",
    triggers=["trigger_is_active_campaign"],
)

change_health_status = Insight(
    name="change_health_status",
    template="Campaign health has changed from {{var_prev_health_status | health_status_to_str}}"
    " to {{var_campaign_health_status | health_status_to_str }} during this period.",
    triggers=["trigger_health_status_is_changed"],
)

usv_exe_off_track = Insight(
    name="usv_exe_off_track",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been Off Track for {{ var_weeks_usv_exe_off_track }} of Weeks"
    " your {{ var_kpi_usv_exe_off_track }} has negatively impacted it most.",
    triggers=["trigger_usv_exe_off_track"],
)

usv_exe_at_risk = Insight(
    name="usv_exe_at_risk",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been At Risk for {{ var_weeks_usv_exe_at_risk }} of Weeks"
    " your {{ var_kpi_usv_exe_at_risk }} has negatively impacted it most. ",
    triggers=["trigger_usv_exe_at_risk"],
)

usv_exe_on_track = Insight(
    name="usv_exe_on_track",
    template="Your top-to-bottom, or ‘search to lease’ funnel conversion rate"
    " has been On Track for {{ var_weeks_usv_exe_on_track }} of Weeks"
    " your {{ var_kpi_usv_exe_on_track }} has positively impacted it most.",
    triggers=["trigger_usv_exe_on_track"],
)
