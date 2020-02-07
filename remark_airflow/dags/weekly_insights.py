from datetime import timedelta, datetime, date
from django.core.serializers import serialize
from django_dag import DjangoDAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
import logging
import json

default_args = {
    "start_date": datetime(2020, 2, 1),
    "owner": "remarkably",
    "depends_on_past": False,
    "email": ["engineering@remarkably.io"],
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

# schedule_interval='0 10 * * *'

with DjangoDAG(dag_id="weekly_insights", default_args=default_args, max_active_runs=1, schedule_interval=None) as dag:
    from remark.lib.time_series.query import select
    from remark.projects.models import Project, Period
    from remark.insights.models import WeeklyInsights, Insight
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
        retention_rate_health,
        top_usv_referral,
    )

    project_insights = [
        lease_rate_against_target,
        change_health_status,
        usv_exe_off_track,
        usv_exe_at_risk,
        usv_exe_on_track,
        retention_rate_health,
        top_usv_referral,
    ]


    def get_list_of_current_insights():
        response = []
        get_insights = Insight.objects.all()
        serialized = serialize('json', get_insights)
        insights = json.loads(serialized)
        for insight in insights:
            response.append(insight['fields']['name'])

        return response


    def verify_project_insights_in_current_insights(**context):
        current_insights = context['task_instance'].xcom_pull(task_ids='get_current_insights_task')
        for project_insight in project_insights:
            if project_insight.name not in current_insights:
                Insight.objects.create(
                    name=project_insight.name,
                    priority_order=Insight.objects.count()
                )
        return


    def get_projects_for_today():
        today = datetime.today().strftime('%A')
        total_projects = Project.objects.count()
        logging.info(f"REMARK_METRIC::TOTAL PROJECTS COUNT {total_projects}")
        get_projects = Project.objects.filter(reporting_day=today)
        serialized = serialize('json', get_projects)
        projects = json.loads(serialized)
        logging.info(f"REMARK_METRIC::TOTAL FILTERED PROJECTS COUNT {len(projects)}")
        projects_with_data = check_projects_with_data(projects)
        return projects_with_data


    def check_projects_with_data(projects):
        end = datetime.today().date()
        start = end - timedelta(weeks=1)
        projects_with_data = []
        for project in projects:
            project_id = project["pk"]
            query = Period.objects.filter(project_id=project_id)
            check_period = select(query, start, end)
            if check_period:
                projects_with_data.append(project)

        logging.info(f"REMARK_METRIC::PROJECTS WITH DATA COUNT {len(projects_with_data)}")

        return projects_with_data



    def weekly_insights(project_id, **context):
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
            logging.info(f"REMARK_METRIC::WEEKLY INSIGHT OVERWRITTEN for PROJECT {project_id}")
        except WeeklyInsights.DoesNotExist:
            WeeklyInsights.objects.create(
                project_id=project_id,
                start=start,
                end=end,
                facts=project_facts,
                insights=insights,
            )
            logging.info(f"REMARK_METRIC::NEW WEEKLY INSIGHT CREATED for PROJECT {project_id}")

        return insights

    start_weekly_insights = DummyOperator(task_id="start_weekly_insights_task", dag=dag)
    get_current_insights = PythonOperator(task_id="get_current_insights_task", python_callable=get_list_of_current_insights, dag=dag)
    verify_project_insights = PythonOperator(task_id="verify_project_insights_task", python_callable=verify_project_insights_in_current_insights, provide_context=True, dag=dag)
    get_projects = PythonOperator(task_id="get_projects_task", python_callable=get_projects_for_today, dag=dag)
    complete_weekly_insights = DummyOperator(task_id="weekly_insights_complete_task", dag=dag)

    get_current_insights >> verify_project_insights >> get_projects >> start_weekly_insights

    for project in get_projects_for_today():
        process_weekly_insight = PythonOperator(task_id="weekly_insights" + project['pk'], python_callable=weekly_insights, provide_context=True, op_kwargs={'project_id': project['pk']}, dag=dag)
        start_weekly_insights >> process_weekly_insight >> complete_weekly_insights

    complete_weekly_insights
