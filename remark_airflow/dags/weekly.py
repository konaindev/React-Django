import os
import sys
import django

from datetime import timedelta, datetime, date
from airflow import DAG
from airflow.operators.python_operator import PythonOperator


# init django app
def setup_django_for_airflow():
    sys.path.append("/remarkably")
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.local_settings")
    django.setup()


setup_django_for_airflow()

from remark_airflow.insights.impl.projects.projects import (
    get_project_facts,
    get_project_insights,
)
from remark_airflow.insights.impl.projects.insights import (
    change_health_status,
    lease_rate_against_target,
    usv_exe_off_track,
    usv_exe_at_risk,
    usv_exe_on_track,
)
from remark.projects.models import Project
from remark.insights.models import WeeklyInsights


default_args = {"start_date": datetime(2019, 12, 22, 00, 00)}

dag = DAG("weekly_insights", default_args=default_args, schedule_interval="0 0 * * 0")

project_insights = [
    lease_rate_against_target,
    change_health_status,
    usv_exe_off_track,
    usv_exe_at_risk,
    usv_exe_on_track,
]


def weekly_insights(project_id, task_id, **kwargs):
    execution_date = kwargs["execution_date"]
    end = date.fromtimestamp(execution_date.timestamp())
    start = end - timedelta(weeks=1)

    project_facts = get_project_facts(project_insights, project_id, start, end)
    insights = get_project_insights(project_facts, project_insights)

    try:
        weekly_ins = WeeklyInsights.objects.get(
            project_id=project_id, start=start, end=end
        )
        weekly_ins.facts = project_facts
        weekly_ins.insights = insights
        weekly_ins.save()
    except WeeklyInsights.DoesNotExist:
        WeeklyInsights.objects.create(
            project_id=project_id,
            start=start,
            end=end,
            facts=project_facts,
            insights=insights,
        )

    return insights


def generator():
    projects = Project.objects.all()
    for p in projects:
        public_id = p.public_id
        task_id = f"weekly_insights_{public_id}"
        op_kwargs = {"project_id": public_id, "task_id": task_id}
        PythonOperator(
            task_id=task_id,
            provide_context=True,
            python_callable=weekly_insights,
            op_kwargs=op_kwargs,
            dag=dag,
        )


generator()
