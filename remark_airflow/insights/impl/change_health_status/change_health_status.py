from remark.lib.stats import health_check
from remark.lib.time_series.computed import leased_rate_graph
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark.projects.models import Project, TargetPeriod, Period
from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.utils import health_status_to_str


def get_text(data):
    health_status = health_status_to_str(data["health_status"])
    prev_health_status = health_status_to_str(data["prev_health_status"])
    return (
        f"Campaign health has changed from {prev_health_status} "
        f"to {health_status} during this period."
    )


def trigger(project_id, start, end):
    project = Project.objects.get(public_id=project_id)
    base_kpis = get_base_kpis_for_project(project, start, end)
    base_targets = get_targets_for_project(project, start, end)

    if not base_kpis or not base_targets:
        return None

    kpi = leased_rate_graph(base_kpis)
    leased_rate = kpi["leased_rate"]
    target_leased_rate = base_targets["leased_rate"]
    health_status = health_check(leased_rate, target_leased_rate)

    prev_target_period = (
        TargetPeriod.objects.filter(end__lte=start).order_by("end").first()
    )
    prev_period = Period.objects.filter(end__lte=start).order_by("end").first()

    if not prev_target_period or not prev_period:
        return None

    prev_kpi = leased_rate_graph(prev_period.get_values())
    prev_leased_rate = prev_kpi["leased_rate"]
    prev_target_leased_rate = prev_target_period.target_leased_rate
    prev_health_status = health_check(prev_leased_rate, prev_target_leased_rate)

    if prev_health_status == health_status:
        return None

    return {
        "leased_rate": leased_rate,
        "target_leased_rate": target_leased_rate,
        "health_status": health_status,
        "prev_leased_rate": prev_leased_rate,
        "prev_target_leased_rate": prev_target_leased_rate,
        "prev_health_status": prev_health_status,
    }


class ChangeHealthStatus(Insight):
    def __init__(self, priority):
        super().__init__("Change Health Status", trigger, get_text, priority)
