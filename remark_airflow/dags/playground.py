from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta, date
from airflow.operators.dummy_operator import DummyOperator

from hooks.google_analytics_hook import GoogleAnalyticsHook
from operators.google_analytics_operator import GoogleAnalyticsReporting
from operators.google_datastore_operator import GoogleDatastoreOperator
from hooks.postgres_hook import PostgresHook
from google.cloud import firestore, storage, exceptions
import logging
import json
import os, sys
import django

db = firestore.Client()

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2019, 11, 13),
    "email": ["vivian@remarkably.io"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
}

def setup_django_for_airflow():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.settings")
    django.setup()

setup_django_for_airflow()

dag = DAG("playground", default_args=default_args, schedule_interval=timedelta(days=1))

def connect_pg():
    response = []
    pg = PostgresHook().get_conn()
    cursor = pg.cursor()
    cursor.execute("select * from analytics_analyticsprovider")
    results = cursor.fetchall()

    for identifier in results:
        response.append(identifier[2])

    return response


# def get_report(view_id):
#     ga = GoogleAnalyticsHook(key_file=os.getenv("KEY_FILE"))
#     query_date = str(date.today() - timedelta(days=1))

#     try:
#         response = ga.get_analytics_report(view_id=view_id, since=query_date, until=query_date, sampling_level="LARGE", dimensions=[{"name": "ga:source"}], metrics=[{"expression": "ga:sessionDuration"}], page_size=1000, include_empty_rows=False)
#     except Exception as e:
#         return e

#     return response

# def report_operator(item):
    # return PythonOperator(task_id="get_dynamic_report_task", python_callable=get_report, op_kwargs={'view_id':item}, dag=dag)
    # return GoogleAnalyticsReporting(task_id="get_dynamic_report_task", view_id=item, dag=dag)

def google_store(**context):
    return "HI"

def print_data(**context):
    data = context['task_instance'].xcom_pull(task_ids='get_dynamic_report_task')
    logging.info(data)

def google_health_check():
    ga = GoogleAnalyticsHook(key_file=os.getenv("KEY_FILE"))
    ga.get_service_object(name="reporting")

def heath_check_check(**context):
    value = context['task_instance'].xcom_pull(task_ids='google_health_check_task')
    logging.info(value)

def write_to_postgres(**context):
    return "HI"


# view_id_list = PythonOperator(task_id="connect_pg_task", python_callable=connect_pg, dag=dag)
start_task = DummyOperator(task_id='start_task', dag=dag)
complete = DummyOperator(task_id="complete", dag=dag)
google_test_task = PythonOperator(task_id="just_a_test", python_callable=google_store, dag=dag)
google_health_check_task = PythonOperator(task_id="google_health_check_task", python_callable=google_health_check, dag=dag)
health_check_check_task = PythonOperator(task_id="health_check_check_task", python_callable=heath_check_check, provide_context=True, dag=dag)
# print_stuff = PythonOperator(task_id="printing_stuff", python_callable=print_data, provide_context=True, dag=dag)

google_health_check_task >> health_check_check_task >> start_task

for view_id in connect_pg():
    get_ga_report_task = GoogleAnalyticsReporting(task_id="get_ga_report_task", view_id=view_id, dag=dag)
    datastore_task = GoogleDatastoreOperator(task_id="datastore_task", view_id=view_id, collection={"collection": "daily_analytics", "document":view_id}, sub_collection=[{"collection":"test_collection", "document":"test_document"}], dag=dag)


    # start_task >> view_id_list >> get_ga_report_task >> datastore_task >> complete
    start_task >> get_ga_report_task >> datastore_task >> complete

complete >> google_test_task
