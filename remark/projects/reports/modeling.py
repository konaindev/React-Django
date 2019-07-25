from dateutil.parser import parse

from . import ReportBase


FOUR_WEEKS = 4 * 7  # 28 days


class ModelingReport(ReportBase):
    """Tools for generating modeling report data."""

    # TODO Is it possible to do something better; presumably
    # this will derive from CommonReport, or at least contain
    # a set of CommonReport derivates?

    def __init__(self, project):
        self.project = project

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

    @staticmethod
    def extend_four_week_averages(data):
        investment = data["investment"]
        start = parse(data["dates"]["start"])
        end = parse(data["dates"]["end"])
        days = (end - start).days

        def _avg(value):
            return round(FOUR_WEEKS * value / days)

        fwa = data["four_week_funnel_averages"]
        acquisition = float(investment["acquisition"]["total"])
        retention = float(investment["retention"]["total"])
        total = float(investment["total"]["total"])
        fwa["acq_investment"] = _avg(acquisition)
        fwa["ret_investment"] = _avg(retention)
        fwa["investment"] = _avg(total)

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
                data = campaign_model.json_data
                self.extend_four_week_averages(data)
                model_options.append(dict(
                    model_id=campaign_model.public_id,
                    model_index=campaign_model.model_index,
                    is_selected=campaign.selected_campaign_model == campaign_model,
                    **data
                ))

        return dict(
            property_name=self.project.name,
            options=model_options,
        )
