from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    ChoiceCell,
    CurrencyCell,
    DateCell,
    find_col,
    find_row,
    IntCell,
    NullChoiceCell,
    NullStrCell,
    rows_until_empty,
    StrCell,
)

from .base import ProjectExcelImporter


def find_meta(predicate):
    """Return a locator that scans the META!A column for header values and returns contents of column B."""
    return find_row("META!A", predicate, target="B")


def find_cat(predicate):
    """Return a locator that scans the 1st row of any sheet for header values."""
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

    def build_category(self, category, sheet):
        rows = rows_until_empty(self.workbook, start_row=2, sheet=sheet, col="A")
        self.cleaned_data[category] = self.row_table(
            schema=self.CATEGORY_ROW_SCHEMA, rows=rows, sheet=sheet
        )

    def clean(self):
        super().clean()

        # Build the meta table
        self.cleaned_data["meta"] = self.col(schema=self.META_COL_SCHEMA, col="B")

        # Build for each category
        self.build_category("reputation_building", "Reputation Building")
        self.build_category("demand_creation", "Demand Creation")
        self.build_category("leasing_enablement", "Leasing Enablement")
        self.build_category("market_intelligence", "Market Intelligence")

