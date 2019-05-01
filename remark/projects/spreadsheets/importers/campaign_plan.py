from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    ChoiceCell,
    CurrencyCell,
    find_col,
    find_row,
    IntCell,
    loc,
    NullChoiceCell,
    NullStrCell,
    prev_row,
    rows_until_empty,
    StrCell,
    NullStrDateCell,
)

from .base import ProjectExcelImporter


def find_meta(predicate):
    """Return a locator that scans the META!A column for header values and returns contents of column B."""
    return find_row("META!A", predicate, target="B")


def find_cat(predicate):
    """Return a locator that scans the 1st row of any sheet for header values."""
    return find_col(1, predicate)


def find_overview(predicate):
    """Return a locator that scans column A of the overview sheet for header values."""
    return find_row("Overview!A", predicate, target="B")


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
        "schedule": NullStrDateCell(find_cat("schedule")),
        "status": ChoiceCell(find_cat("status"), choices=STATUS_CHOICES),
        "notes": NullStrCell(find_cat("notes")),
        "base_cost": CurrencyCell(find_cat(matchp(iexact="cost"))),
        "cost_type": ChoiceCell(find_cat("cost type"), choices=COST_TYPE_CHOICES),
        "total_cost": CurrencyCell(find_cat("total cost")),
    }

    FUNNEL_CATEGORY_ROW_SCHEMA = dict(
        CATEGORY_ROW_SCHEMA,
        **{
            "volumes": {
                "usv": IntCell(find_cat("# of usv")),
                "inq": IntCell(find_cat("# of inq")),
            },
            "costs": {
                "usv": CurrencyCell(find_cat("usv cost")),
                "inq": CurrencyCell(find_cat("inq cost")),
            },
        },
    )

    OVERVIEW_TARGET_SEGMENT_SCHEMA = {
        "ordinal": StrCell(loc("Overview!A")),
        "description": StrCell(loc("Overview!B")),
    }

    OVERVIEW_TARGET_INVESMENT_SCHEMA = {
        "category": StrCell(loc("Overview!A")),
        "total": CurrencyCell(loc("Overview!B")),
        "acquisition": CurrencyCell(loc("Overview!C")),
        "retention": CurrencyCell(loc("Overview!D")),
    }

    CATEGORY_TO_KEY = {
        "Reputation Building": "reputation_building",
        "Demand Creation": "demand_creation",
        "Leasing Enablement": "leasing_enablement",
        "Market Intelligence": "market_intelligence",
        "Total": "total",
    }

    def build_category(self, category):
        rows = rows_until_empty(self.workbook, start_row=2, sheet=category, col="A")
        row_table = self.row_table(
            schema=self.CATEGORY_ROW_SCHEMA, rows=rows, sheet=category
        )
        return {"tactics": row_table}

    def build_funnel_category(self, category):
        rows = rows_until_empty(self.workbook, start_row=2, sheet=category, col="A")
        row_table = self.row_table(
            schema=self.FUNNEL_CATEGORY_ROW_SCHEMA, rows=rows, sheet=category
        )
        return {"tactics": row_table}

    def locate_overview_header_cell(self, predicate):
        predicate = predicate if callable(predicate) else matchp(iexact=predicate)
        return find_row("Overview!A", predicate)(self.workbook)

    def build_markdown(self, start_row):
        rows = rows_until_empty(
            self.workbook, start_row=start_row, location="Overview!B"
        )
        # CONSIDER it would be nice to have an analogue of Django ORM's values(flat=True)
        text_dicts = self.row_table({"text": StrCell(loc("Overview!B"))}, rows=rows)
        texts = [text_dict["text"] for text_dict in text_dicts]
        return "\n".join(texts) + "\n"  # Reasonable people demand trailing newlines.

    def build_markdown_for_header(self, predicate):
        _, _, row = self.locate_overview_header_cell(predicate)
        return self.build_markdown(start_row=row)

    def build_overview_target_segments(self):
        _, _, row = self.locate_overview_header_cell("target segments")
        rows = rows_until_empty(self.workbook, start_row=row + 1, location="Overview!A")
        return self.row_table(self.OVERVIEW_TARGET_SEGMENT_SCHEMA, rows=rows)

    def build_overview_objective(self, category):
        # This will find the first occurence of the header, which given
        # our current schema (with target investment headers at the very bottom
        # of column A) should work fine.
        return {
            "title": category,
            "description": self.build_markdown_for_header(category),
        }

    def build_overview_objectives(self):
        return [
            self.build_overview_objective("Reputation Building"),
            self.build_overview_objective("Demand Creation"),
            self.build_overview_objective("Leasing Enablement"),
            self.build_overview_objective("Marketing Intelligence"),
        ]

    def build_overview_assumptions(self):
        return self.build_markdown_for_header("assumptions")

    def build_overview_target_investments(self):
        # Find "Total" row and work backwards
        _, _, row = self.locate_overview_header_cell("total")
        rows = rows_until_empty(
            self.workbook, start_row=row, location="Overview!A", next_fn=prev_row
        )
        items = self.row_table(self.OVERVIEW_TARGET_INVESMENT_SCHEMA, rows=rows)
        # Convert dictionaries with the category key *inside* them
        # into nested dictionaries where the category key is *outside*.
        # aka {"category": "Reputation Building", "total": "100"} -->
        # {"reputation_building": {"total": "100"}}
        return dict(
            (self.CATEGORY_TO_KEY[item.pop("category")], item) for item in items
        )

    def build_overview(self):
        def overview_str(predicate):
            return self.value(StrCell(find_overview(predicate)))

        return {
            "theme": overview_str("theme"),
            "target_segments": self.build_overview_target_segments(),
            "goal": overview_str("goal"),
            "objectives": self.build_overview_objectives(),
            "assumptions": self.build_overview_assumptions(),
            "schedule": overview_str("schedule"),
            "target_investments": self.build_overview_target_investments(),
        }

    def build_meta(self):
        return self.schema(schema=self.META_COL_SCHEMA, col="B")

    def clean(self):
        super().clean()

        # Build the meta table
        self.cleaned_data["meta"] = self.build_meta()

        # Build for each category
        self.cleaned_data["reputation_building"] = self.build_category(
            "Reputation Building"
        )
        self.cleaned_data["demand_creation"] = self.build_funnel_category(
            "Demand Creation"
        )
        self.cleaned_data["leasing_enablement"] = self.build_category(
            "Leasing Enablement"
        )
        self.cleaned_data["market_intelligence"] = self.build_category(
            "Market Intelligence"
        )

        # Build the overview
        self.cleaned_data["overview"] = self.build_overview()
