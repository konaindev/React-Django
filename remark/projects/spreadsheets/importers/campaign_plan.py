from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    ChoiceCell,
    DateCell,
    find_col,
    find_row,
    IntCell,
    CurrencyCell,
    NullChoiceCell,
    NullStrCell,
    StrCell,
)

from .base import ProjectExcelImporter


def find_meta(predicate):
    """Return a getter that scans the META!A column for header values."""
    return find_row("META!A", predicate)


def find_cat(predicate):
    """Return a getter that scans the 1st row of any sheet for header values."""
    return find_col(1, predicate)


class CampaignPlanImporter(ProjectExcelImporter):
    expected_type = "campaign"
    expected_version = 1

    AUDIENCE_CHOICES = ["Acquisition", "Retention"]
    STATUS_CHOICES = ["Not Started", "In Progress", "Complete"]
    COST_TYPE_CHOICES = ["One-Time", "Monthly", "Weekly"]

    META_COL_SCHEMA = {
        "campaign_months": IntCell(find_meta("months")),
        "campaign_weeks": IntCell(find_meta("weeks")),
        "campaign_days": IntCell(find_meta("days")),
    }

    CATEGORY_ROW_SCHEMA = {
        "name": StrCell(find_cat("tactic")),
        "audience": NullChoiceCell(find_cat("audience"), choices=AUDIENCE_CHOICES),
        "tooltip": NullStrCell(find_cat("tooltip")),
        "schedule": DateCell(find_cat("schedule")),
        "status": ChoiceCell(find_cat("status"), choices=STATUS_CHOICES),
        "notes": NullStrCell(find_cat("notes")),
        "base_cost": CurrencyCell(find_cat(matchp(iexact="cost"))),
        "cost_type": ChoiceCell(find_cat("cost type"), choices=COST_TYPE_CHOICES),
        "total_cost": CurrencyCell(find_cat("total cost")),
    }

    def clean(self):
        super().clean()
        self.cleaned_data["meta"] = self.col(schema=self.META_COL_SCHEMA, col="B")
        print(self.cleaned_data["meta"])

