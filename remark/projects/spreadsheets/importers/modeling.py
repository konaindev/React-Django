from remark.lib.spreadsheets import (
    CurrencyCell,
    DateCell,
    find_col,
    find_row,
    FloatCell,
    IntCell,
    row_range,
    StrCell,
)

from .base import ProjectExcelImporter


def find(predicate):
    return find_row("OUTPUT!A", predicate, target="B")


def model(predicate):
    return find_col("MODEL!2", predicate)


class ModelingImporter(ProjectExcelImporter):
    expected_type = "model"
    expected_version = 1

    OUTPUT_SCHEMA = {
        "name": StrCell(find("model name")),
        "dates": {
            "start": DateCell(find("start date")),
            "end": DateCell(find("end date")),
        },
        "property": {
            "average_monthly_rent": CurrencyCell(find("average rent")),
            "lowest_monthly_rent": CurrencyCell(find("lowest rent")),
            "cost_per_exe_vs_rent": FloatCell(find("cost per exe vs rent")),
            "total_units": IntCell(find("total units")),
            "leasing": {
                "change": IntCell(find("leasing change")),
                "cds": IntCell(find("cancels & denials")),
                "cd_rate": FloatCell(find("cd rate")),
                "renewal_notices": IntCell(find("renewal notices")),
                "renewals": IntCell(find("renewals")),
                "renewal_rate": FloatCell(find("renewal rate")),
                "resident_decisions": IntCell(find("resident decisions")),
                "vacation_notices": IntCell(find("vacation notices")),
                "rate": FloatCell(find("leasing rate")),
                "units": IntCell(find("lease units")),
            },
            "occupancy": {
                "move_ins": IntCell(find("move ins")),
                "move_outs": IntCell(find("move outs")),
                "rate": FloatCell(find("occupancy rate")),
                "units": IntCell(find("occupancy units")),
                "occupiable": IntCell(find("occupiable units")),
            },
        },
        "funnel": {
            "volumes": {
                "usv": IntCell(find("usv volume")),
                "inq": IntCell(find("inq volume")),
                "tou": IntCell(find("tou volume")),
                "app": IntCell(find("app volume")),
                "exe": IntCell(find("exe volume")),
            },
            "costs": {
                "usv": CurrencyCell(find("usv cost")),
                "inq": CurrencyCell(find("inq cost")),
                "tou": CurrencyCell(find("tou cost")),
                "app": CurrencyCell(find("app cost")),
                "exe": CurrencyCell(find("exe cost")),
            },
            "conversions": {
                "usv_inq": FloatCell(find("usv conversions")),
                "inq_tou": FloatCell(find("inq conversions")),
                "tou_app": FloatCell(find("tou conversions")),
                "app_exe": FloatCell(find("app conversions")),
                "usv_exe": FloatCell(find("usv_exe conversions")),
            },
        },
        "four_week_funnel_averages": {
            "usv": IntCell(find("usv 4 week")),
            "inq": IntCell(find("inq 4 week")),
            "tou": IntCell(find("tou 4 week")),
            "app": IntCell(find("app 4 week")),
            "exe": IntCell(find("exe 4 week")),
        },
        "investment": {
            "acquisition": {
                "expenses": {
                    "demand_creation": CurrencyCell(
                        find("acquisition demand creation")
                    ),
                    "leasing_enablement": CurrencyCell(
                        find("acquisition leasing enablement")
                    ),
                    "market_intelligence": CurrencyCell(
                        find("acquisition market intelligence")
                    ),
                    "reputation_building": CurrencyCell(
                        find("acquisition reputation building")
                    ),
                },
                "total": CurrencyCell(find("acquisition total")),
                "romi": IntCell(find("acquisition romi")),
                "estimated_revenue_gain": CurrencyCell(
                    find("acquisition revenue gain")
                ),
            },
            "retention": {
                "expenses": {
                    "demand_creation": CurrencyCell(find("retention demand creation")),
                    "leasing_enablement": CurrencyCell(
                        find("retention leasing enablement")
                    ),
                    "market_intelligence": CurrencyCell(
                        find("retention market intelligence")
                    ),
                    "reputation_building": CurrencyCell(
                        find("retention reputation building")
                    ),
                },
                "total": CurrencyCell(find("retention total")),
                "romi": IntCell(find("retention romi")),
                "estimated_revenue_gain": CurrencyCell(find("retention revenue gain")),
            },
            "total": {
                "total": CurrencyCell(find("total total")),
                "romi": IntCell(find("total romi")),
                "estimated_revenue_gain": CurrencyCell(find("total revenue gain")),
            },
        },
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
        "target_acq_expenses": {
            "demand_creation": CurrencyCell(model("aqc demand")),
            "leasing_enablement": CurrencyCell(model("aqc leasing")),
            "market_intelligence": CurrencyCell(model("aqc market")),
            "reputation_building": CurrencyCell(model("aqc reputation")),
        },
        "target_ret_expenses": {
            "demand_creation": CurrencyCell(model("ret demand")),
            "leasing_enablement": CurrencyCell(model("ret leasing")),
            "market_intelligence": CurrencyCell(model("ret market")),
            "reputation_building": CurrencyCell(model("ret reputation")),
        },
        "target_usvs": IntCell(model("usvs")),
        "target_inquiries": IntCell(model("inqs")),
        "target_tours": IntCell(model("tou")),
    }

    def clean_output_data(self):
        return self.schema(self.OUTPUT_SCHEMA)

    def clean_model_targets(self):
        baseline_weeks = self.value(
            IntCell(find_row("META!A", "baseline weeks", target="B"))
        )
        start_row = 4

        # row_range(...) is inclusive, and we want to get one extra row
        # so we can determine the correct end date for each intermediate row.
        end_row = start_row + baseline_weeks
        raw_targets = self.schema_list(
            schema=self.MODEL_SCHEMA, locations=row_range(start_row, end_row)
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
