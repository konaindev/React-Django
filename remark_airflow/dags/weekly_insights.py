from datetime import timedelta, datetime, date
from django.core.serializers import serialize
from django_dag import DjangoDAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
import json

default_args = {
    "start_date": datetime(2020, 1, 27),
    "owner": "remarkably",
    "depends_on_past": False,
    "email": ["engineering@remarkably.io"],
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DjangoDAG(dag_id="new_weekly_insights", default_args=default_args, concurrency=2, max_active_runs=1, schedule_interval=None) as dag:
    from remark.projects.models import Project
    from remark.insights.models import WeeklyInsights
    from remark.insights.impl.projects.projects import (
        get_project_facts,
        get_project_insights,
    )
    from remark.insights.impl.projects.insights import (
        change_health_status,
        lease_rate_against_target,
        usv_exe_off_track,
        usv_exe_at_risk,
        usv_exe_on_track,
        retention_rate_health,
        top_usv_referral,
    )

    def get_projects_for_today():
        today = datetime.today().strftime('%A')
        projects = Project.objects.filter(reporting_day=today)
        serialized = serialize('json', projects)
        response = json.loads(serialized)
        return response


    def weekly_insights(project_id, **context):
        project_insights = [
            lease_rate_against_target,
            change_health_status,
            usv_exe_off_track,
            usv_exe_at_risk,
            usv_exe_on_track,
            retention_rate_health,
            top_usv_referral,
        ]

        execution_date = context["execution_date"]
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

    start_weekly_insights = DummyOperator(task_id="start", dag=dag)
    complete_weekly_insights = DummyOperator(task_id="complete", dag=dag)

    start_weekly_insights

    for project in get_projects_for_today():
        process = PythonOperator(task_id="weekly_insights" + project['pk'], python_callable=weekly_insights, provide_context=True, op_kwargs={'project_id': project['pk']}, dag=dag)
        start_weekly_insights >> process >> complete_weekly_insights

    complete_weekly_insights
