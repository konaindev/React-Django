from datetime import datetime
from airflow.operators.python_operator import PythonOperator

from remark_airflow.dags.django_dag import DjangoDAG

default_args = {"start_date": datetime(2020, 1, 1, 0, 0)}

with DjangoDAG(
    dag_id="macro_baseline", default_args=default_args, schedule_interval=None
) as dag:

    from remark_airflow.insights.impl.projects.insights import (
        top_usv_referral,
        low_performing,
        kpi_below_average,
        kpi_high_performing,
        kpi_above_average,
    )
    from remark_airflow.insights.impl.projects.projects import (
        get_and_save_project_facts,
    )
    from remark.insights.models import BaselineInsights

    baseline_insights = [
        top_usv_referral,
        low_performing,
        kpi_below_average,
        kpi_high_performing,
        kpi_above_average,
    ]

    def macro_baseline_insights(**kwargs):
        conf = kwargs["dag_run"].conf
        start = datetime.strptime(conf["start"], "%Y-%m-%d").date()
        end = datetime.strptime(conf["end"], "%Y-%m-%d").date()
        project_id = conf["project_id"]
        insights = get_and_save_project_facts(
            baseline_insights, project_id, start, end, BaselineInsights
        )
        return insights

    PythonOperator(
        task_id="macro_baseline_operator",
        provide_context=True,
        python_callable=macro_baseline_insights,
        dag=dag,
    )
