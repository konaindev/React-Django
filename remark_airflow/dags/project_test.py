import datetime
from airflow.operators.bash_operator import BashOperator
from airflow.operators.python_operator import PythonOperator
import logging
from datetime import datetime, timedelta, date
from airflow import DAG
# from dependencies.remark.projects.models import Project
# from dependencies.remark.insights.models import WeeklyInsights
import sys
import django
import os

default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2019, 12, 20),
    "email": ["vivian@remarkably.io"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
    "concurrency": 2,
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
}

# def show_paths():
#     response = sys.path
#     print(response)
#


# def setup_django_for_airflow():
#     sys.path.append("/home/airflow/gcs/dags/dependencies")
#     print(sys.path)
#     os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.settings")
#     django.setup()
#
# setup_django_for_airflow()
#
# from remark.projects.models import Project

dag = DAG("package_test", default_args=default_args, schedule_interval=timedelta(days=1))

def get_projects():
    print(sys.path)
    # response = Project.objects.all()
    # for p in response:
    #     print(p.public_id)


# django_setup = PythonOperator(task_id="show_path", python_callable=setup_django_for_airflow, dag=dag)
test_get_project = PythonOperator(task_id="projects", python_callable=get_projects, dag=dag)

test_get_project
