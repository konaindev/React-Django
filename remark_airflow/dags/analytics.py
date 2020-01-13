from datetime import timedelta, datetime, date
from django_dag import DjangoDAG
from airflow.operators.python_operator import PythonOperator
default_args = {
    "owner": "airflow",
    "depends_on_past": False,
    "start_date": datetime(2020, 1, 13),
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

with DjangoDAG(dag_id="analytics", default_args=default_args, schedule_interval=timedelta(days=1)) as dag:
    from remark.analytics.models import AnalyticsProvider

    def get_analytics_providers():
        response = AnalyticsProvider.objects.all()
        print(response)
        return response

    analytics_providers = PythonOperator(task_id="analytics_providers", python_callable=get_analytics_providers)

    analytics_providers
