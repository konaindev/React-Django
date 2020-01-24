"""
Code that goes along with the Airflow located at:
http://airflow.readthedocs.org/en/latest/tutorial.html
"""
from airflow import DAG
from airflow.operators.bash_operator import BashOperator
from datetime import datetime, timedelta
from airflow.models import Variable
from airflow.operators.python_operator import PythonOperator
from airflow.operators.dummy_operator import DummyOperator
import os, sys


default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2020, 1, 23),
    "email": ["airflow@airflow.com"],
    "email_on_failure": False,
    "email_on_retry": False,
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
    # 'queue': 'bash_queue',
    # 'pool': 'backfill',
    # 'priority_weight': 10,
    # 'end_date': datetime(2016, 1, 1),
}

dag = DAG("tutorial1", default_args=default_args, schedule_interval=None)

# t1, t2 and t3 are examples of tasks created by instantiating operators
# t1 = BashOperator(task_id="print_date", bash_command="date", dag=dag)
#
# t2 = BashOperator(task_id="sleep", bash_command="sleep 5", retries=3, dag=dag)
#
# templated_command = """
#     {% for i in range(5) %}
#         echo "{{ ds }}"
#         echo "{{ macros.ds_add(ds, 7)}}"
#         echo "{{ params.my_param }}"
#     {% endfor %}
# """
#
# t3 = BashOperator(
#     task_id="templated",
#     bash_command=templated_command,
#     params={"my_param": "Parameter I passed in"},
#     dag=dag,
# )
#
# t4 = BashOperator(task_id="print_hi", bash_command="echo HI", dag=dag)
#
# t2.set_upstream(t1)
# t3.set_upstream(t1)
# t4.set_upstream(t1)

def show_stuff():
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
    paths = sys.path
    print(f"Current paths: {paths}")
    print(f"Working Directory: {os.getcwd()}")
    return

show_stuff = PythonOperator(task_id="show_stuff", python_callable=show_stuff, dag=dag)
locate = BashOperator(
    task_id="locate_file",
    bash_command="locate settings.py",
    dag=dag
)

show_stuff >> locate
