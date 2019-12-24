from remark.projects.constants import HEALTH_STATUS


def trigger_is_active_campaign(project, start, health_status, prev_health_status):
    if health_status is None or prev_health_status is None:
        return None
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
