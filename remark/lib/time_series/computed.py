from operator import truediv, add, mul
from graphkit import compose, operation
from .common import KPI


def add_all(*args):
    result = 0
    for arg in args:
        result += arg
    return result


def op(name, needs, fun):
    # Short cut for operation that only provides one return
    # that has the same name as the operation post-fixed with "_op"
    # Yes, I'm super lazy
    return operation(name=f"{name}_op", needs=needs, provides=[name])(fun)


# FIX ME: Change the rest of the string to KPI field references
kpi_graph = compose(name="period_kpi")(
    op(KPI.lease_rate, [KPI.leased_units, KPI.occupiable_units], truediv),
    op(KPI.resident_decisions, [KPI.notices_to_renew, KPI.notices_to_vacate], add),
    op("retention_rate", ["notices_to_renew", "resident_decisions"], truediv),
    op("occupancy_rate", ["occupied_units", "occupiable_units"], truediv),
    op("acquisition_investment", [
        "acquisition_reputation",
        "acquisition_demand_creation",
        "acquisition_leasing_enablement",
        "acquisition_market_intelligence"
    ], add_all),
    op("retention_investment", [
        "retention_reputation",
        "retention_demand_creation",
        "retention_leasing_enablement",
        "retention_market_intelligence"
    ], add_all),
    op("campaign_investment", ["acquisition_investment", "retention_investment"], add),
    op("acquisition_revenue", ["exe", "average_rent"], mul),
    op("acquisition_romi", ["acquisition_revenue", "acquisition_investment"], truediv),
    op("retention_revenue", ["notices_to_renew", "average_rent"], mul),
    op("retention_romi", ["retention_revenue", "retention_investment"], truediv),
    op("campaign_revenue", ["acquisition_revenue", "retention_revenue"], add),
    op("campaign_romi", ["campaign_revenue", "campaign_investment"], truediv),
    op("usv_exe", ["exe", "usv"], truediv),
    op("usv_inq", ["inq", "usv"], truediv),
    op("inq_tou", ["tou", "inq"], truediv),
    op("tou_app", ["app", "tou"], truediv),
    op("app_exe", ["exe", "app"], truediv),
    op("usv_cost", ["acquisition_investment", "usv"], truediv),
    op("inq_cost", ["acquisition_investment", "inq"], truediv),
    op("tou_cost", ["acquisition_investment", "tou"], truediv),
    op("app_cost", ["acquisition_investment", "app"], truediv),
    op("exe_cost", ["acquisition_investment", "exe"], truediv),
    op("cd_rate", ["cds", "app"], truediv),
    op("exe_to_lowest_rent", ["exe_cost", "lowest_monthly_rent"], truediv),
    op(KPI.estimated_acq_revenue_gain, [])
)


def generated_computed_kpis(base_kpis, outputs=None):
    if outputs is None:
        return kpi_graph(base_kpis)
    return kpi_graph(base_kpis, outputs=outputs)

