from . import ReportBase


class CampaignPlan(ReportBase):
    """Tools for generating campaign plan report data."""

    @classmethod
    def exists(cls, project):
        """Return True if a campaign plan report exists for this project."""
        return bool(project.tmp_campaign_plan_json)

    @classmethod
    def for_project(cls, project):
        """Return a CampaignPlan for this project."""
        return cls(project)

    def __init__(self, project):
        self.project = project

    def to_jsonable(self):
        return self.project.tmp_campaign_plan_json
