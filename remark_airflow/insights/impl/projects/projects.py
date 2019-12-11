from remark_airflow.insights.framework.core import Insight
from remark_airflow.insights.impl.triggers import (
    trigger_is_active_campaign,
    trigger_campaign_health_status_off_track,
)
from remark_airflow.insights.impl.vars import (
    var_campaign_health_status,
    var_current_period_leased_rate,
    var_target_leased_rate,
)

PROJECT_FACT_GENERATORS = (
    trigger_is_active_campaign,
    trigger_campaign_health_status_off_track,
    var_current_period_leased_rate,
    var_target_leased_rate,
    var_campaign_health_status,
)


def get_project_facts(project, start, end):
    project_facts = {}
    for factoid in PROJECT_FACT_GENERATORS:
        result = factoid(project, start, end)
        name = factoid.__name__
        project_facts[name] = result
    return project_facts


def get_project_insights(project_facts):
    project_insights = [
        Insight(
            name="lease_rate_against_target",
            template="Property is {{ var_current_period_leased_rate }}%"
            " Leased against period target of {{ var_target_leased_rate }}%,"
            " assessed as {{ var_campaign_health_status | health_status_to_str }}.",
            triggers=["trigger_is_active_campaign"],
        )
    ]

    final_insights = {}

    for project_insight in project_insights:
        result = project_insight.evaluate(project_facts)
        if result is not None:
            name, text = result
            final_insights[name] = text

    return final_insights
