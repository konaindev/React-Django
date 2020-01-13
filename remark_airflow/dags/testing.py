from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime, timedelta
from airflow.operators.dummy_operator import DummyOperator
import logging

# db = firestore.Client()

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

dag = DAG("testing", default_args=default_args, schedule_interval=timedelta(days=1))

def say_hi_func():
    print("HI")
    return


def print_num_func(**context):
    logging.info("HELLLLLOOOOOOO!!!!!")
    logging.info(context)


def create_list_of_10():
    response = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    # x = 0
    # while x <= 10:
    #     response.append(str(x))
    #     x += 1
    return response


def testing():
    response = create_list_of_10()
    print(response)
    return response


def say_bye_func():
    print("BYE")
    return


start_task = DummyOperator(task_id='start_task', dag=dag)
complete = DummyOperator(task_id="complete", dag=dag)
say_hi = PythonOperator(task_id="say_hi", python_callable=say_hi_func, dag=dag)
say_bye = PythonOperator(task_id="say_bye", python_callable=say_bye_func, dag=dag)
# testing = PythonOperator(task_id="testing", python_callable=testing, dag=dag)

say_hi >> start_task

for item in create_list_of_10():
    print_num = PythonOperator(task_id="print_num", python_callable=print_num_func, dag=dag, op_kwargs={"item": item})

    start_task >> print_num >> complete

complete >> say_bye
