import jinja2

from typing import Callable, Union

from graphkit import compose

try:
    from insights.impl.utils import health_status_to_str, format_percent
except ModuleNotFoundError:
    from remark_airflow.dags.insights.impl.utils import health_status_to_str, format_percent

jinja2.filters.FILTERS["health_status_to_str"] = health_status_to_str
jinja2.filters.FILTERS["format_percent"] = format_percent


class Insight:
    """
    Class that represents a single insight.
    It checks to see if its been triggered by the data in a Project.
    It is also responsible for generating the final insight string.
    """

    def __init__(
        self,
        name: str,
        template: Union[Callable, str],
        triggers: list,
        graph: list = None,
    ):
        self.name = name
        self.template = template
        self.triggers = triggers
        if graph is not None:
            self.graph = compose(name=name)(*graph)

    def get_text(self, data):
        if type(self.template) is str:
            template = jinja2.Template(self.template, optimized=False)
            return template.render(data)
        else:
            return self.template(data)

    def evaluate(self, project_facts: dict):
        for trigger in self.triggers:
            if not project_facts[trigger]:
                return None
        return self.name, self.get_text(project_facts)
