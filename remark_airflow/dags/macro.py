from datetime import datetime

from remark_airflow.dags.django_dag import DjangoDAG

default_args = {"start_date": datetime(2020, 1, 1, 0, 0)}

with DjangoDAG(
    dag_id="macro", default_args=default_args, schedule_interval=None
) as dag:

    from remark_airflow.dags.insights.impl.projects.projects import (
        operators_generator,
        get_and_save_project_facts,
    )
    from remark_airflow.dags.insights.impl.projects.insights import (
        change_health_status,
        usv_exe_off_track,
        usv_exe_at_risk,
        usv_exe_on_track,
        retention_rate_health,
        top_usv_referral,
    )
    from remark.insights.models import PerformanceInsights

    performance_insights = [
        change_health_status,
        usv_exe_off_track,
        usv_exe_at_risk,
        usv_exe_on_track,
        retention_rate_health,
        top_usv_referral,
    ]

    def macro_insights(project_id, **kwargs):
        conf = kwargs["dag_run"].conf
        start = datetime.strptime(conf["start"], "%Y-%m-%d").date()
        end = datetime.strptime(conf["end"], "%Y-%m-%d").date()
        insights = get_and_save_project_facts(
            performance_insights, project_id, start, end, PerformanceInsights
        )
        return insights

    operators_generator("macro", macro_insights, dag)
