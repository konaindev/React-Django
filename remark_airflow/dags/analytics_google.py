from datetime import timedelta, datetime, date

from django.core.serializers import serialize
from django_dag import DjangoDAG
from hooks.google_analytics_hook import GoogleAnalyticsHook
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
from airflow.models import Variable
import logging
import json

default_args = {
    "start_date": datetime(2020, 2, 25),
    "owner": "remarkably",
    "depends_on_past": False,
    "email": ["engineering@remarkably.io"],
    "email_on_failure": True,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

new_user_metric = [{"expression": "ga:NewUsers"}]
new_user_dimension = [{"name": "ga:hour"}]
provider_name = "google"
variable_name = "analytics_google"

with DjangoDAG(
    dag_id="analytics_google",
    default_args=default_args,
    max_active_runs=1,
    schedule_interval="0 10 * * *",
) as dag:
    from remark.analytics.models import AnalyticsProvider, AnalyticsUniqueSiteVisitors
    from remark.projects.models import Project

    def get_ga_identifiers(**context):
        if (
            context["dag_run"].external_trigger
            and "project_id" in context["dag_run"].conf
        ):
            project_id = context["dag_run"].conf["project_id"]
            logging.info(f"REMARK_METRIC::MANUAL TRIGGER for {project_id}")
            get_project = AnalyticsProvider.objects.filter(
                project_id=project_id, provider=provider_name
            )
            serialized = serialize("json", get_project)
            response = json.loads(serialized)
            Variable.set("analytics_google", response, serialize_json=True)
            return response

        get_projects = AnalyticsProvider.objects.filter(provider=provider_name)
        serialized = serialize("json", get_projects)
        response = json.loads(serialized)
        Variable.set("analytics_google", response, serialize_json=True)
        return response

    def get_usv_data(view_id, **context):
        query_date = str(date.today() - timedelta(days=1))
        if "query_date" in context["dag_run"].conf:
            query_date = context["dag_run"].conf["query_date"]
        context["task_instance"].xcom_push(key="query_date", value=query_date)
        ga = GoogleAnalyticsHook()
        response = ga.get_analytics_report(
            view_id=view_id,
            since=query_date,
            until=query_date,
            sampling_level="LARGE",
            dimensions=new_user_dimension,
            metrics=new_user_metric,
            page_size=1000,
            include_empty_rows=False,
        )

        return response

    def get_usv_counts(ga_response):
        usv_hourly_count = [str(0)] * 24
        hourly_rows = ga_response["data"]["rows"]
        for row in hourly_rows:
            hour = row["dimensions"][0]
            metric = row["metrics"][0]["values"][0]
            usv_hourly_count[int(hour)] = metric

        usv_day_count = int(ga_response["data"]["totals"][0]["values"][0])

        response = {
            "usv_day_count": usv_day_count,
            "usv_hourly_count": usv_hourly_count,
        }

        return response

    def save_usv_data(project_id, **context):
        ga_response = context["task_instance"].xcom_pull(
            key="return_value", task_ids="get_usv_data_" + project_id
        )
        logging.info("ANALYTICS_GOOGLE_TEST_LOG")
        logging.info(ga_response)
        query_date = context["task_instance"].xcom_pull(
            key="query_date", task_ids="get_usv_data_" + project_id
        )
        usv_metrics = get_usv_counts(ga_response)
        print(usv_metrics)

        try:
            save_usv_entry = AnalyticsUniqueSiteVisitors.objects.get(
                project_id_id=project_id, date=query_date
            )
            save_usv_entry.usv_day_count = usv_metrics["usv_day_count"]
            save_usv_entry.usv_hourly_count = usv_metrics["usv_hourly_count"]
            save_usv_entry.save()
        except AnalyticsUniqueSiteVisitors.DoesNotExist:
            save_usv_entry = AnalyticsUniqueSiteVisitors.objects.create(
                project_id=Project.objects.get(public_id=project_id),
                date=query_date,
                usv_day_count=usv_metrics["usv_day_count"],
                usv_hourly_count=usv_metrics["usv_hourly_count"],
            )

        serialized = serialize("json", [save_usv_entry,])
        response = json.loads(serialized)
        return response[0]

    start = DummyOperator(task_id="start_processing", dag=dag)
    complete = DummyOperator(task_id="processing_complete", dag=dag)
    get_projects_task = PythonOperator(
        task_id="get_projects",
        python_callable=get_ga_identifiers,
        provide_context=True,
        dag=dag,
    )

    get_projects_task >> start >> complete

    google_analytics_projects = json.loads(
        Variable.get("analytics_google", default_var=json.dumps([]))
    )

    for project in google_analytics_projects:
        project_id = project["fields"]["project"]
        view_id = project["fields"]["identifier"]
        get_usv_data_task = PythonOperator(
            task_id="get_usv_data_" + project_id,
            python_callable=get_usv_data,
            op_kwargs={"view_id": view_id},
            provide_context=True,
            dag=dag,
        )
        save_usv_data_task = PythonOperator(
            task_id="save_usv_data_" + project_id,
            provide_context=True,
            python_callable=save_usv_data,
            op_kwargs={"project_id": project_id},
            dag=dag,
        )
        start >> get_usv_data_task >> save_usv_data_task >> complete
