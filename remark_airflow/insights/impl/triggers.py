from remark.projects.constants import HEALTH_STATUS
from remark_airflow.insights.impl.vars import var_campaign_health_status


def trigger_is_active_campaign(project, start, end):
    return project.baseline_end <= start


def trigger_campaign_health_status_off_track(project, start, end):
    status = var_campaign_health_status(project, start, end)
    return status == HEALTH_STATUS["ON_TRACK"]
