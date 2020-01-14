from datetime import datetime
from airflow.operators.python_operator import PythonOperator

from django_dag import DjangoDAG

default_args = {"owner": "Airflow", "start_date": datetime(2019, 12, 22, 00, 00)}

with DjangoDAG(
    "baseline_insights", default_args=default_args, schedule_interval=None
) as dag:

    from insights.impl.projects.projects import get_project_facts, get_project_insights
    from insights.impl.projects.insights import top_usv_referral
    from remark.projects.models import Project
    from remark.insights.models import BaselineInsights

    project_insights = [top_usv_referral]

    def baseline_insights(project_id, **kwargs):
        conf = kwargs["dag_run"].conf
        start = datetime.strptime(conf["start"], "%Y-%m-%d")
        end = datetime.strptime(conf["end"], "%Y-%m-%d")
        project_facts = get_project_facts(project_insights, project_id, start, end)
        insights = get_project_insights(project_facts, project_insights)
        try:
            baseline_ins = BaselineInsights.objects.get(
                project_id=project_id, start=start, end=end
            )
            baseline_ins.facts = project_facts
            baseline_ins.insights = insights
            baseline_ins.save()
        except BaselineInsights.DoesNotExist:
            BaselineInsights.objects.create(
                project_id=project_id,
                start=start,
                end=end,
                facts=project_facts,
                insights=insights,
            )
        return insights

    def generator():
        projects = Project.objects.all()
        for p in projects:
            public_id = p.public_id
            task_id = f"baseline_insights_{public_id}"
            op_kwargs = {"project_id": public_id}
            PythonOperator(
                task_id=task_id,
                provide_context=True,
                python_callable=baseline_insights,
                op_kwargs=op_kwargs,
                dag=dag,
            )

    generator()
