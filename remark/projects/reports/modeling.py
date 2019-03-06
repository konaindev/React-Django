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
        return self.project.tmp_modeling_report_json
