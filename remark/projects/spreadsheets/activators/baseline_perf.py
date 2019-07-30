from django.db.models import Model

from remark.lib.spreadsheets import ExcelValidationError
from .base import ActivatorBase

from ..importers import SpreadsheetKind


class BaselinePerfActivator(ActivatorBase):
    spreadsheet_kind = SpreadsheetKind.PERIODS

    def activate(self):
        self.activate_periods()
        self.activate_project()

    def activate_project(self):
        self.project.baseline_start = self.data["baseline_start"]
        self.project.baseline_end = self.data["baseline_end"]
        self.project.save()

    def activate_periods(self):
        for data_period in self.data["periods"]:
            self.activate_period(data_period)

    def activate_period(self, data_period):
        # An imported data_period has the same keys as fields on the
        # Period object, so this is pretty trivial...
        defaults = {k: v for k, v in data_period.items() if k not in ["start", "end", "lease_stage_str"]}
        # Get lease stage
        from remark.projects.models import LeaseStage
        lease_stage_str = data_period["lease_stage_str"]
        lease_stage = LeaseStage.objects.get(short_name=lease_stage_str)
        # ignore returned (period, created) tuple
        self.project.periods.update_or_create(
            project=self.project,
            lease_stage=lease_stage,
            start=data_period["start"],
            end=data_period["end"],
            defaults=defaults,
        )
