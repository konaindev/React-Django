from typing import Callable, Union


class Insight:
    """
    Class that represents a single insight.
    It checks to see if its been triggered by the data in a Project.
    It is also responsible for generating the final insight string.
    """

    def __init__(self, name: str, template: Union[Callable, str], triggers: list):
        self.name = name
        self.template = template
        self.triggers = triggers

    def get_text(self, data):
        if type(self.template) is str:
            return self.template
        else:
            return self.template(data)

    def evaluate(self, project_facts: dict):
        for trigger in self.triggers:
            if not project_facts[trigger]:
                return None
        return self.name, self.get_text(project_facts)
