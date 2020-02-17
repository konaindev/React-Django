from remark.projects.constants import HEALTH_STATUS


def trigger_is_active_campaign(
    project, start, health_status, prev_health_status, leased_rate, target_leased_rate
):
    if (
        health_status is None
        or health_status != HEALTH_STATUS["PENDING"]
        or prev_health_status is None
        or leased_rate is None
        or target_leased_rate is None
    ):
        return False
    return project.baseline_end <= start


def trigger_campaign_health_status_off_track(health_status):
    return health_status == HEALTH_STATUS["ON_TRACK"]


def trigger_health_status_is_changed(health_status, prev_health_status):
    return prev_health_status != health_status


def trigger_usv_exe_off_track(health_status):
    return health_status == HEALTH_STATUS["OFF_TRACK"]


def trigger_usv_exe_at_risk(health_status):
    return health_status == HEALTH_STATUS["AT_RISK"]


def trigger_usv_exe_on_track(health_status):
    return health_status == HEALTH_STATUS["ON_TRACK"]


def trigger_retention_rate_health(health_status):
    return (
        health_status == HEALTH_STATUS["OFF_TRACK"]
        or health_status == HEALTH_STATUS["AT_RISK"]
    )


def trigger_has_data_google_analytics(usv_source):
    return usv_source is not None


def trigger_have_benchmark_kpi(low_kpi):
    return bool(low_kpi)


def trigger_kpi_mitigated(kpi, weeks):
    return kpi is not None and weeks >= 2


def trigger_kpi_not_mitigated(
    kpi_off_track, kpi_off_track_mitigated, kpi_at_risk_mitigated
):
    return (
        not kpi_off_track_mitigated
        and not kpi_at_risk_mitigated
        and kpi_off_track is not None
    )


def trigger_kpi_trend_change_health(predicting_health):
    return predicting_health is not None


def trigger_usvs_on_track(weeks):
    return weeks != 0


def trigger_kpi_trend(predicting_health, var_kpi_trend):
    return predicting_health is None and var_kpi_trend is not None
