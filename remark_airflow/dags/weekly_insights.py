from datetime import timedelta, datetime, date
from django.core.serializers import serialize
from django_dag import DjangoDAG
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
import logging
import json
from airflow.models import Variable

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

with DjangoDAG(dag_id="weekly_insights", default_args=default_args, max_active_runs=1, schedule_interval='0 10 * * *') as dag:
    from remark.lib.time_series.query import select
    from remark.projects.models import Project, Period
    from remark.insights.models import WeeklyInsights, Insight
    from remark.projects.signals import update_performance_report
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

    # used to calculate start date for weekly reports using reporting_day
    def get_start_date(reporting_day):
        today = datetime.today().date()
        # cut off is day before reporting day since report run at 2:00 AM
        start = today - timedelta(days=8)
        finished = False
        while not finished:
            if start.strftime('%A') != reporting_day:
                start = start - timedelta(days=1)
            else:
                finished = True

        return start


    # check that insights database includes project_insights
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


    # get list of projects that need weekly_insights and perf email generated
    # first determines if it's only for one project or gathering projects by reporting day
    # if by reporting day, then it checks that there's period for the data
    def get_projects_to_process(**context):
        if context["dag_run"].external_trigger and "project_id" in context["dag_run"].conf:
            project_id = context['dag_run'].conf['project_id']
            logging.info(f"REMARK_METRIC::MANUAL TRIGGER for {project_id}")
            get_project = Project.objects.filter(public_id=project_id)
            serialized = serialize('json', get_project)
            response = json.loads(serialized)
            project_var = [{"pk": response[0]['pk'], "reporting_day": response[0]["fields"]["reporting_day"]}]
            Variable.set("weekly_insights_list", json.dumps(project_var))
            return response

        response = get_projects_for_today()
        return response


    def get_projects_for_today():
        today = datetime.today().strftime('%A')
        total_projects = Project.objects.count()
        logging.info(f"REMARK_METRIC::TOTAL PROJECTS COUNT {total_projects}")
        get_projects = Project.objects.filter(reporting_day=today)
        serialized = serialize('json', get_projects)
        projects = json.loads(serialized)
        logging.info(f"REMARK_METRIC::TOTAL FILTERED PROJECTS COUNT {len(projects)}")
        projects_with_data = check_projects_with_data(projects, today)
        return projects_with_data


    def check_projects_with_data(projects, reporting_day):
        start = get_start_date(reporting_day)
        end = start + timedelta(weeks=1)
        projects_with_data = []
        for project in projects:
            project_id = project["pk"]
            query = Period.objects.filter(project_id=project_id)
            check_period = select(query, start, end)
            if check_period:
                project_object = {"pk": project_id, "reporting_day": reporting_day}
                projects_with_data.append(project_object)

        logging.info(f"REMARK_METRIC::PROJECTS WITH DATA COUNT {len(projects_with_data)}")
        Variable.set("weekly_insights_list", json.dumps(projects_with_data))
        return projects_with_data


    def weekly_insights(project, **context):
        start = get_start_date(project['reporting_day'])
        end = start + timedelta(weeks=1)
        project_id = project["pk"]

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
            try:
                weekly_ins = WeeklyInsights.objects.create(
                    project_id=project_id,
                    start=start,
                    end=end,
                    facts=project_facts,
                    insights=insights,
                )
                logging.info(f"REMARK_METRIC::NEW WEEKLY INSIGHT CREATED for PROJECT {project_id}")
            except:
                logging.error("UNABLE TO FOLLOW THROUGH ON CREATION")

        serialized_weekly_ins = serialize('json', [weekly_ins,])
        response = json.loads(serialized_weekly_ins)

        return response[0]


    def create_performance_email(task_id, **context):
        weekly_insight = context['task_instance'].xcom_pull(task_ids=task_id)
        response = update_performance_report(weekly_insight["pk"])
        return response


    def cleanup_variable():
        Variable.set("weekly_insights_list", [])
        return

    start_weekly_insights = DummyOperator(task_id="start_weekly_insights_task", dag=dag)
    get_current_insights = PythonOperator(task_id="get_current_insights_task", python_callable=get_list_of_current_insights, dag=dag)
    verify_project_insights = PythonOperator(task_id="verify_project_insights_task", python_callable=verify_project_insights_in_current_insights, provide_context=True, dag=dag)
    get_projects_task = PythonOperator(task_id="get_projects_task", python_callable=get_projects_to_process, provide_context=True, do_xcom_push=True, dag=dag)
    complete_weekly_insights = DummyOperator(task_id="weekly_insights_complete_task", dag=dag)
    cleanup_variable_task = PythonOperator(task_id="cleanup_variable_task", python_callable=cleanup_variable, dag=dag)

    get_current_insights >> verify_project_insights >> get_projects_task >> start_weekly_insights >> complete_weekly_insights >> cleanup_variable_task

    projects_list = json.loads(Variable.get("weekly_insights_list", default_var=json.dumps([])))

    for project in projects_list:
        process_weekly_insight = PythonOperator(task_id="weekly_insights_" + project['pk'], python_callable=weekly_insights, provide_context=True, op_kwargs={'project': project}, execution_timeout=timedelta(minutes=1), dag=dag)
        create_perf_email = PythonOperator(task_id="create_email_" + project['pk'], python_callable=create_performance_email, provide_context=True, op_kwargs={'task_id': "weekly_insights_" + project['pk']}, dag=dag)
        start_weekly_insights >> process_weekly_insight >> create_perf_email >> complete_weekly_insights
