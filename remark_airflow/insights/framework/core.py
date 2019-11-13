from datetime import date
from typing import List, Tuple, Union, Callable, Any


class BaseInsight:
    def __init__(self, name: str, trigger: Callable, text_template: Callable):
        self.name = name
        self.trigger = trigger
        self.text_template = text_template

    def get_insight_text(self, result) -> str:
        return self.text_template(result)

    def get_name(self) -> str:
        return self.name

    def evaluate(self, *args):
        raise NotImplementedError()


class Modifier(BaseInsight):
    """
    This Class modifies an insight. There are situations where we want
    to tweak the wording of am insight based on additional data.
    This Class modifies the output of an Insight when its been triggered situation.
    """

    def evaluate(self, project_id, start, end, insight_data):
        result = self.trigger(project_id, start, end, insight_data)
        if result is None:
            return None
        return self.name, self.get_insight_text(result)


class Insight(BaseInsight):
    """
    Class that represents a single insight.
    It checks to see if its been triggered by the data in a Project.
    It is also responsible for generating the final insight string.
    """

    def __init__(
        self,
        name: str,
        trigger: Callable[[str, date, date], Any],
        text_template: Callable,
        priority: int,
        modifiers: List[Modifier] = None,
    ):
        super().__init__(name, trigger, text_template)
        self.modifiers = modifiers
        self.priority = priority

    def get_priority(self) -> int:
        return self.priority

    def evaluate(
        self, project_id: str, start: date, end: date, ignored_modifiers: list = None
    ) -> Union[None, Tuple[List[str], str]]:
        result = self.trigger(project_id, start, end)
        if result is None:
            return None
        if self.modifiers is None:
            return [self.name], self.get_insight_text(result)
        for modifier in self.modifiers:
            mod_name = modifier.get_name()
            if ignored_modifiers is None or mod_name not in ignored_modifiers:
                mod_result = modifier.evaluate(project_id, start, end, result)
                if mod_result is not None:
                    mod_name, mod_result = mod_result
                    return [self.get_name(), mod_name], mod_result
        return [self.name], self.get_insight_text(result)


class InsightManager:
    """
    This class holds the reference to all active Insights
    and evaluates them against a project.
    """

    def __init__(self, insights: List[Insight]):
        self.insights = insights.copy()
        self.insights.sort(key=lambda i: i.get_priority())

    def evaluate(self, project_id: str, start: date, end: date) -> List:
        ignored_modifiers = []
        result = []
        for insight in self.insights:
            data = insight.evaluate(project_id, start, end, ignored_modifiers)
            if data is None:
                continue
            names, text = data
            if len(names) > 1:
                ignored_modifiers.append(names[1])
            result.append((names[0], text))
        return result
