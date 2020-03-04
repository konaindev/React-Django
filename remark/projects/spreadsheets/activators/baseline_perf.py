from .base import ActivatorBase

from ..importers import SpreadsheetKind


class BaselinePerfActivator(ActivatorBase):
    spreadsheet_kind = SpreadsheetKind.PERIODS

    def __init__(self, *args, **kwargs):
        super(BaselinePerfActivator, self).__init__(*args, **kwargs)
        # Cache lease stages for periods activating
        from remark.projects.models import LeaseStage
        self.lease_stages_map = {s.full_name: s for s in LeaseStage.objects.all()}

    def activate(self):
        self.remove_existing_periods()
        self.activate_periods()
        self.activate_project()

    def activate_project(self):
        campaign = self.project.get_active_campaign()
        campaign.baseline_start = self.data["baseline_start"]
        campaign.baseline_end = self.data["baseline_end"]
        campaign.save()

    def activate_periods(self):
        for data_period in self.data["periods"]:
            self.activate_period(data_period)

    def activate_period(self, data_period):
        # An imported data_period has the same keys as fields on the
        # Period object, so this is pretty trivial...
        defaults = {k: v for k, v in data_period.items() if k not in ["start", "end", "lease_stage_str"]}
        # Get lease stage
        lease_stage = self.lease_stages_map[data_period["lease_stage_str"]]
        defaults["lease_stage"] = lease_stage
        # ignore returned (period, created) tuple
        self.project.periods.update_or_create(
            project=self.project,
            start=data_period["start"],
            end=data_period["end"],
            defaults=defaults,
        )

    def remove_existing_periods(self):
        self.project.get_periods().delete()


