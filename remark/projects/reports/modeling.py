from . import ReportBase
from remark.projects.models import Project

class ModelingReport(ReportBase):
    """Tools for generating modeling report data."""

    # TODO Is it possible to do something better; presumably
    # this will derive from CommonReport, or at least contain
    # a set of CommonReport derivates?

    @classmethod
    def exists(cls, project):
        """Return True if campaign and models exist for this project."""
        models_count = 0
        for campaign in project.campaigns.all():
            models_count = models_count + campaign.campaign_models.count()
        return models_count > 0

    @classmethod
    def for_project(cls, project):
        """Return a ModelingReport for this project."""
        return cls(project)

    def __init__(self, project):
        self.project = project

    def to_jsonable(self):
        # TODO: Future plan is to show Modeling page underneath Campaign Tab.
        # Generation of modeling options should be modified accordingly.
        #
        # Expose "model_id", "model_index" and "selected" model status
        # so that model options can be re-ordered in UI as needed.
        model_options = []
        for campaign in self.project.campaigns.all():
            for campaign_model in campaign.campaign_models.all():
                if not campaign_model.active:
                    continue
                model_options.append(dict(
                    model_id=campaign_model.campaign_model_id,
                    model_index=campaign_model.model_index,
                    is_selected=campaign.selected_campaign_model == campaign_model,
                    **campaign_model.json_data
                ))

        jsonable = dict(
            property_name=self.project.name,
            options=model_options
        )

        return jsonable
