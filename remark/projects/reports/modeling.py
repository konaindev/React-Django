from . import ReportBase


class ModelingReport(ReportBase):
    """Tools for generating modeling report data."""

    # TODO for this sprint, we simply check whether the whole
    # pre-computed report is in the database or not.
    #
    # For a future sprint... do something better; presumably
    # this will derive from CommonReport, or at least contain
    # a set of CommonReport derivates?

    @classmethod
    def exists(cls, project):
        """Return True if a modeling report exists for this project."""
        return bool(project.tmp_modeling_report_json)

    @classmethod
    def for_project(cls, project):
        """Return a ModelingReport for this project."""
        return cls(project)

    def __init__(self, project):
        self.project = project

    def to_jsonable(self):
        # If a specific model is selected on the project, re-order the JSON
        # so that the selected model is first, and give it a slightly altered name.
        jsonable = self.project.tmp_modeling_report_json

        # Reorder options if there's a selected model.
        if self.project.selected_model_name:
            options = jsonable.get("options", [])
            names = [option.get("name") for option in options]
            try:
                index = names.index(self.project.selected_model_name)
            except Exception:
                index = None

            if index is not None:
                selected_option = options.pop(index)
                selected_option["name"] = f"{selected_option['name']} (Selected)"
                options = [selected_option] + options

            jsonable["options"] = options

        return jsonable
