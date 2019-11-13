from remark.lib.stats import health_check
from remark.lib.time_series.computed import leased_rate_graph
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark.projects.models import Project
from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.utils import to_percentage, health_status_to_str


def get_text(data):
    leased_rate = to_percentage(data["leased_rate"])
    target_leased_rate = to_percentage(data["target_leased_rate"])
    health_status = health_status_to_str(data["health_status"])
    return (
        f"Property is {leased_rate} Leased against period target of {target_leased_rate},"
        f" assessed as {health_status}."
    )


def trigger(project_id, start, end):
    project = Project.objects.get(public_id=project_id)
    base_kpis = get_base_kpis_for_project(project, start, end)
    base_targets = get_targets_for_project(project, start, end)

    kpi = leased_rate_graph(base_kpis)
    leased_rate = kpi["leased_rate"]
    target_leased_rate = base_targets["leased_rate"]
    health_status = health_check(leased_rate, target_leased_rate)
    return {
        "leased_rate": leased_rate,
        "target_leased_rate": target_leased_rate,
        "health_status": health_status,
    }


class LeaseRateAgainstModel(Insight):
    def __init__(self, priority):
        super().__init__("Leased Rate against Model", trigger, get_text, priority)
