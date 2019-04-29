from remark.lib.spreadsheets import (
    CurrencyCell,
    DateCell,
    require_complete,
    find_row,
    FloatCell,
    IntCell,
    StrCell,
)

from .base import ProjectExcelImporter


def find(predicate):
    return require_complete(find_row("OUTPUT!A", predicate, target="B"))


class ModelingImporter(ProjectExcelImporter):
    expected_type = "model"
    expected_version = 1

    SCHEMA = {
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

    def clean(self):
        super().clean()

        self.cleaned_data = self.col(self.SCHEMA)
