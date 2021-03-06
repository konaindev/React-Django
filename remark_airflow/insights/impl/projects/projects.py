from graphkit import compose

from remark_airflow.insights.impl.vars import var_project


def get_project_facts(project_insights, project_id, start, end):
    graph = []
    for insight in project_insights:
        graph.append(insight.graph)
    project_graph = compose(name="project_graph", merge=True)(*graph)
    project = var_project(project_id)
    args = {"start": start, "end": end, "project": project}
    data = project_graph(args)
    for k in args:
        del data[k]
    return data


def get_project_insights(project_facts, project_insights):
    final_insights = {}

    for project_insight in project_insights:
        result = project_insight.evaluate(project_facts)
        if result is not None:
            name, text = result
            final_insights[name] = text

    return final_insights


def get_and_save_project_facts(insights_list, project_id, start, end, StorageModel):
    project_facts = get_project_facts(insights_list, project_id, start, end)
    insights = get_project_insights(project_facts, insights_list)

    try:
        insight_obj = StorageModel.objects.get(
            project_id=project_id, start=start, end=end
        )
        insight_obj.facts = project_facts
        insight_obj.insights = insights
        insight_obj.save()
    except StorageModel.DoesNotExist:
        StorageModel.objects.create(
            project_id=project_id,
            start=start,
            end=end,
            facts=project_facts,
            insights=insights,
        )
    return insights
