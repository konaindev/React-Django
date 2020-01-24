import datetime

from remark.insights.models import PerformanceInsights


def crete_performance_insights(project_id, **kwargs):
    default_params = {
        "start": datetime.date(year=2019, month=6, day=7),
        "end": datetime.date(year=2019, month=6, day=14),
        "facts": {
            "var_usv_exe": None,
            "var_base_kpis": None,
            "var_base_targets": None,
            "var_computed_kpis": None,
            "var_retention_rate": None,
            "var_target_usv_exe": None,
            "var_top_usv_referral": None,
            "var_prev_health_status": -1,
            "var_target_leased_rate": 0.94,
            "trigger_usv_exe_at_risk": False,
            "var_kpi_usv_exe_at_risk": None,
            "var_prev_retention_rate": None,
            "trigger_usv_exe_on_track": False,
            "var_kpi_usv_exe_on_track": None,
            "var_retention_rate_trend": "flat",
            "var_target_computed_kpis": None,
            "trigger_usv_exe_off_track": False,
            "var_kpi_usv_exe_off_track": None,
            "var_retention_rate_health": -1,
            "var_target_retention_rate": None,
            "var_usv_exe_health_status": -1,
            "var_weeks_usv_exe_at_risk": 0,
            "trigger_is_active_campaign": "true",
            "var_campaign_health_status": 2,
            "var_weeks_usv_exe_on_track": 0,
            "var_weeks_usv_exe_off_track": 0,
            "trigger_retention_rate_health": False,
            "var_current_period_leased_rate": 0.89,
            "var_retention_rate_health_weeks": 0,
            "trigger_health_status_is_changed": False,
            "trigger_has_data_google_analytics": False,
        },
        "insights": {
            "lease_rate_against_target": "Property is 89% Leased against period target of 94%, assessed as On Track."
        },
        **kwargs,
    }
    insights = PerformanceInsights.objects.create(
        project_id=project_id, **default_params
    )
    return insights
