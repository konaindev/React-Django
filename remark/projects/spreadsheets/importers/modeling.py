from remark.lib.spreadsheets import (
    CurrencyCell,
    DateCell,
    require_complete,
    find_col,
    find_row,
    FloatCell,
    IntCell,
    row_range,
    StrCell,
)

from .base import ProjectExcelImporter


def find(predicate):
    return require_complete(find_row("OUTPUT!A", predicate, target="B"))


def model(predicate):
    return require_complete(find_col("MODEL!2", predicate))


class ModelingImporter(ProjectExcelImporter):
    expected_type = "model"
    expected_version = 1

    OUTPUT_SCHEMA = {
        "name": StrCell(find("model name")),
        "dates.start": DateCell(find("start date")),
        "dates.end": DateCell(find("end date")),
        "property.average_monthly_rent": CurrencyCell(find("average rent")),
        "property.lowest_monthly_rent": CurrencyCell(find("lowest rent")),
        "property.cost_per_exe_vs_rent": FloatCell(find("cost per exe vs rent")),
        "property.total_units": IntCell(find("total units")),
        "property.leasing.change": IntCell(find("leasing change")),
        "property.leasing.cds": IntCell(find("cancels & denials")),
        "property.leasing.cd_rate": FloatCell(find("cd rate")),
        "property.leasing.renewal_notices": IntCell(find("renewal notices")),
        "property.leasing.renewals": IntCell(find("renewals")),
        "property.leasing.renewal_rate": FloatCell(find("renewal rate")),
        "property.leasing.resident_decisions": IntCell(find("resident decisions")),
        "property.leasing.vacation_notices": IntCell(find("vacation notices")),
        "property.leasing.rate": FloatCell(find("leasing rate")),
        "property.leasing.units": IntCell(find("lease units")),
        "property.occupancy.move_ins": IntCell(find("move ins")),
        "property.occupancy.move_outs": IntCell(find("move outs")),
        "property.occupancy.rate": FloatCell(find("occupancy rate")),
        "property.occupancy.units": IntCell(find("occupancy units")),
        "property.occupancy.occupiable": IntCell(find("occupiable units")),
        "funnel.volumes.usv": IntCell(find("usv volume")),
        "funnel.volumes.inq": IntCell(find("inq volume")),
        "funnel.volumes.tou": IntCell(find("tou volume")),
        "funnel.volumes.app": IntCell(find("app volume")),
        "funnel.volumes.exe": IntCell(find("exe volume")),
        "funnel.costs.usv": CurrencyCell(find("usv cost")),
        "funnel.costs.inq": CurrencyCell(find("inq cost")),
        "funnel.costs.tou": CurrencyCell(find("tou cost")),
        "funnel.costs.app": CurrencyCell(find("app cost")),
        "funnel.costs.exe": CurrencyCell(find("exe cost")),
        "funnel.conversions.usv_inq": FloatCell(find("usv conversions")),
        "funnel.conversions.inq_tou": FloatCell(find("inq conversions")),
        "funnel.conversions.tou_app": FloatCell(find("tou conversions")),
        "funnel.conversions.app_exe": FloatCell(find("app conversions")),
        "funnel.conversions.usv_exe": FloatCell(find("usv_exe conversions")),
        "four_week_funnel_averages.usv": IntCell(find("usv 4 week")),
        "four_week_funnel_averages.inq": IntCell(find("inq 4 week")),
        "four_week_funnel_averages.tou": IntCell(find("tou 4 week")),
        "four_week_funnel_averages.app": IntCell(find("app 4 week")),
        "four_week_funnel_averages.exe": IntCell(find("exe 4 week")),
        "investment.acquisition.expenses.demand_creation": CurrencyCell(
            find("acquisition demand creation")
        ),
        "investment.acquisition.expenses.leasing_enablement": CurrencyCell(
            find("acquisition leasing enablement")
        ),
        "investment.acquisition.expenses.market_intelligence": CurrencyCell(
            find("acquisition market intelligence")
        ),
        "investment.acquisition.expenses.reputation_building": CurrencyCell(
            find("acquisition reputation building")
        ),
        "investment.acquisition.total": CurrencyCell(find("acquisition total")),
        "investment.acquisition.romi": IntCell(find("acquisition romi")),
        "investment.acquisition.estimated_revenue_gain": CurrencyCell(
            find("acquisition revenue gain")
        ),
        "investment.retention.expenses.demand_creation": CurrencyCell(
            find("retention demand creation")
        ),
        "investment.retention.expenses.leasing_enablement": CurrencyCell(
            find("retention leasing enablement")
        ),
        "investment.retention.expenses.market_intelligence": CurrencyCell(
            find("retention market intelligence")
        ),
        "investment.retention.expenses.reputation_building": CurrencyCell(
            find("retention reputation building")
        ),
        "investment.retention.total": CurrencyCell(find("retention total")),
        "investment.retention.romi": IntCell(find("retention romi")),
        "investment.retention.estimated_revenue_gain": CurrencyCell(
            find("retention revenue gain")
        ),
        "investment.total.total": CurrencyCell(find("total total")),
        "investment.total.romi": IntCell(find("total romi")),
        "investment.total.estimated_revenue_gain": CurrencyCell(
            find("total revenue gain")
        ),
    }

    MODEL_SCHEMA = {
        "start": DateCell(model("week start")),
        "target_leased_rate": FloatCell(model("lease up %")),
        "target_lease_applications": IntCell(model("apps")),
        "target_leases_executed": IntCell(model("exe")),
        "target_lease_renewal_notices": IntCell(model("notice to renew")),
        "target_lease_renewals": IntCell(model("renewals")),
        "target_lease_vacation_notices": IntCell(model("notice to vacate")),
        "target_lease_cds": IntCell(model("c/d")),
        "target_delta_leases": IntCell(model("weekly delta leased units")),
        "target_move_ins": IntCell(model("move ins")),
        "target_move_outs": IntCell(model("move outs")),
        "target_occupied_units": IntCell(model("occupied units")),
        "target_acq_expenses.demand_creation": CurrencyCell(model("aqc demand")),
        "target_acq_expenses.leasing_enablement": CurrencyCell(model("aqc leasing")),
        "target_acq_expenses.market_intelligence": CurrencyCell(model("aqc market")),
        "target_acq_expenses.reputation_building": CurrencyCell(
            model("aqc reputation")
        ),
        "target_ret_expenses.demand_creation": CurrencyCell(model("ret demand")),
        "target_ret_expenses.leasing_enablement": CurrencyCell(model("ret leasing")),
        "target_ret_expenses.market_intelligence": CurrencyCell(model("ret market")),
        "target_ret_expenses.reputation_building": CurrencyCell(
            model("ret reputation")
        ),
        "target_usvs": IntCell(model("usvs")),
        "target_inquiries": IntCell(model("inqs")),
        "target_tours": IntCell(model("tou")),
    }

    def clean_output_data(self):
        return self.col(self.OUTPUT_SCHEMA)

    def clean_model_targets(self):
        baseline_weeks = self.schema_value(
            IntCell(find_row("META!A", "baseline weeks", target="B"))
        )
        start_row = 4

        # row_range(...) is inclusive, and we want to get one extra row
        # so we can determine the correct end date for each intermediate row.
        end_row = start_row + baseline_weeks
        raw_targets = self.row_table(
            schema=self.MODEL_SCHEMA, rows=row_range(start_row, end_row)
        )

        # Fix up the end dates for each of the targets
        for raw_target, next_raw_target in zip(raw_targets[:-1], raw_targets[1:]):
            raw_target["end"] = next_raw_target["start"]

        # Fix up the total investment targets
        for raw_target in raw_targets:
            for category in ["acq", "ret"]:
                raw_target[f"target_{category}_investment"] = (
                    raw_target[f"target_{category}_expenses"]["demand_creation"]
                    + raw_target[f"target_{category}_expenses"]["leasing_enablement"]
                    + raw_target[f"target_{category}_expenses"]["market_intelligence"]
                    + raw_target[f"target_{category}_expenses"]["reputation_building"]
                )

        # Drop the extraneous period.
        return raw_targets[:-1]

    def clean(self):
        super().clean()

        self.cleaned_data = self.clean_output_data()
        self.cleaned_data["targets"] = self.clean_model_targets()
