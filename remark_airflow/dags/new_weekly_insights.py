from datetime import timedelta, datetime, date
from django.core.serializers import serialize
from django_dag import DjangoDAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator


default_args = {"start_date": datetime(2019, 12, 22, 00, 00)}


with DjangoDAG(dag_id="new_weekly_insights", default_args=default_args, schedule_interval=None) as dag:
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

        # today = datetime.today().strftime('%A')
        today = "Monday"
        projects = Project.objects.filter(reporting_day=today)
        response = serialize('json', projects)
        return response


    def weekly_insights(project_id, task_id, **kwargs):
        project_insights = [
            lease_rate_against_target,
            change_health_status,
            usv_exe_off_track,
            usv_exe_at_risk,
            usv_exe_on_track,
            retention_rate_health,
            top_usv_referral,
        ]

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


    def process_weekly_insights(**context):
        projects = context['task_instance'].xcom_pull(task_ids='get_projects_for_today')
        print(projects)
        for p in projects:
            public_id = p.public_id
            task_id = f"weekly_insights_{public_id}"
            op_kwargs = {"project_id": public_id, "task_id": task_id}
            PythonOperator(
                task_id=task_id,
                provide_context=True,
                python_callable=weekly_insights,
                op_kwargs=op_kwargs,
                dag=dag
            )
        return


# def generator():
#     projects = Project.objects.all()
#     for p in projects:
#         public_id = p.public_id
#         task_id = f"weekly_insights_{public_id}"
#         op_kwargs = {"project_id": public_id, "task_id": task_id}
#         PythonOperator(
#             task_id=task_id,
#             provide_context=True,
#             python_callable=weekly_insights,
#             op_kwargs=op_kwargs,
#             dag=dag,
#         )

    start = DummyOperator(task_id="start", dag=dag)
    projects_for_today = PythonOperator(task_id="get_projects_for_today", python_callable=get_projects_for_today,
                                        dag=dag)
    process_weekly_insights = PythonOperator(task_id="process_weekly_insights", python_callable=process_weekly_insights,
                                             provide_context=True,
                                             dag=dag)
    complete = DummyOperator(task_id="complete", dag=dag)

    start >> projects_for_today >> process_weekly_insights >> complete
