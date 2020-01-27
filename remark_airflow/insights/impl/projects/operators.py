from airflow.operators.python_operator import PythonOperator

from remark.projects.models import Project


def operators_generator(dag_name, insights_func, dag):
    projects = Project.objects.all()
    for p in projects:
        public_id = p.public_id
        task_id = f"{dag_name}_{public_id}"
        op_kwargs = {"project_id": public_id, "task_id": task_id}
        PythonOperator(
            task_id=task_id,
            provide_context=True,
            python_callable=insights_func,
            op_kwargs=op_kwargs,
            dag=dag,
        )
