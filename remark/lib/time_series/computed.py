from operator import truediv, add, mul, sub
from remark.lib.math import sum_or_0, div_or_0, mult_or_0, d_div_or_0, d_quant_currency, sub_or_0
from graphkit import compose, operation
from .common import KPI


def identity(a):
    return a


def add_all(*args):
    result = 0
    for arg in args:
        result += arg
    return result


def leased_units_calc(leased_units_end, leased_units_start, delta_leases):
    """The total number of leases in effect at the end of the period."""
    # HACK To fix https://www.pivotaltracker.com/n/projects/2240283 in a day,
    # we use the number explicitly imported from our spreadsheets
    # *if it's available*. Otherwise, we compute it just like we used to.
    # Eventually, I think we need to consider simply importing *all*
    # of our per-period computations from the spreadsheet, and *completely*
    # deleting our ComputedPeriod code. But we're not there yet, and I'd
    # be nervous to make the change without a lot more available time. (This
    # needs to get done *today*!) -Dave
    if leased_units_end is not None:
        result = leased_units_end
    else:
        result = sum_or_0(leased_units_start, delta_leases)
    return result

def occupied_units_calc(occupied_units_end, occupied_units_start, move_ins, move_outs):
    """The total occupancy in effect at the end of the period."""
    # HACK To fix https://www.pivotaltracker.com/n/projects/2240283 in a day,
    # we use the number explicitly imported from our spreadsheets
    # *if it's available*. Otherwise, we compute it just like we used to.
    # Eventually, I think we need to consider simply importing *all*
    # of our per-period computations from the spreadsheet, and *completely*
    # deleting our ComputedPeriod code. But we're not there yet, and I'd
    # be nervous to make the change without a lot more available time. (This
    # needs to get done *today*!) -Dave
    if occupied_units_end is not None:
        result = occupied_units_end
    else:
        moved_in = sum_or_0(occupied_units_start, move_ins)
        result = sub_or_0(moved_in, move_outs)
    return result


def chain(*fns):
    def inner(*args):
        result = None
        for fn in fns:
            if result is None:
                result = fn(*args)
            else:
                result = fn(result)
        return result
    return inner


def twelve_mo_mult_or_0(*args):
    return mult_or_0(*args, 12)


cost_per_calc = chain(d_div_or_0, d_quant_currency)
romi_calc = chain(d_div_or_0, round)


def op(name, needs, fun):
    # Short cut for operation that only provides one return
    # that has the same name as the operation post-fixed with "_op"
    # Yes, I'm super lazy
    return operation(name=f"{name}_op", needs=needs, provides=[name])(fun)


# FIX ME: Change the rest of the string to KPI field references
kpi_graph = compose(name="kpi_graph")(

    # Leasing
    op(KPI.delta_leases, [KPI.leases_executed, KPI.leases_ended], sub),
    op(KPI.occupiable_units, [KPI.occupiable_units_start], identity),
    op(KPI.leased_units, [
        KPI.leased_units_end,
        KPI.leased_units_start,
        KPI.delta_leases
    ], leased_units_calc),
    op(KPI.leased_rate, [KPI.leased_units, KPI.occupiable_units], div_or_0),
    op(KPI.resident_decisions, [KPI.lease_renewal_notices, KPI.lease_vacation_notices], sum_or_0),
    op(KPI.renewal_rate, [KPI.lease_renewal_notices, KPI.resident_decisions], div_or_0),
    op(KPI.lease_cd_rate, [KPI.lease_cds, KPI.lease_applications], div_or_0),

    # Activity
    op(KPI.occupancy_rate, [KPI.occupied_units, KPI.occupiable_units], div_or_0),
    op(KPI.occupied_units, [
        KPI.occupied_units_end,
        KPI.occupied_units_start,
        KPI.move_ins,
        KPI.move_outs
    ], occupied_units_calc),

    # Investment
    op(KPI.acq_investment, [
        KPI.acq_reputation_building,
        KPI.acq_demand_creation,
        KPI.acq_leasing_enablement,
        KPI.acq_market_intelligence
    ], add_all),
    op(KPI.ret_investment, [
        KPI.ret_reputation_building,
        KPI.ret_demand_creation,
        KPI.ret_leasing_enablement,
        KPI.ret_market_intelligence
    ], add_all),
    op(KPI.investment, [KPI.acq_investment, KPI.ret_investment], add),

    # Revenue
    op(KPI.estimated_acq_revenue_gain, [KPI.leases_executed, KPI.average_rent], twelve_mo_mult_or_0),
    op(KPI.estimated_ret_revenue_gain, [KPI.lease_renewal_notices, KPI.average_rent], twelve_mo_mult_or_0),
    op(KPI.estimated_revenue_gain, [KPI.estimated_acq_revenue_gain, KPI.estimated_ret_revenue_gain], sum_or_0),

    # ROMI
    op(KPI.acq_romi, [KPI.estimated_acq_revenue_gain, KPI.acq_investment], romi_calc),
    op(KPI.ret_romi, [KPI.estimated_ret_revenue_gain, KPI.ret_investment], romi_calc),
    op(KPI.romi, [KPI.estimated_revenue_gain, KPI.investment], romi_calc),

    # Funnel Conversions
    op(KPI.usv_exe, [KPI.leases_executed, KPI.usvs], div_or_0),
    op(KPI.usv_inq, [KPI.inquiries, KPI.usvs], div_or_0),
    op(KPI.inq_tou, [KPI.tours, KPI.inquiries], div_or_0),
    op(KPI.tou_app, [KPI.lease_applications, KPI.tours], div_or_0),
    op(KPI.app_exe, [KPI.leases_executed, KPI.lease_applications], div_or_0),

    # Cost Pers
    op(KPI.usv_cost, [KPI.acq_investment, KPI.usvs], cost_per_calc),
    op(KPI.inq_cost, [KPI.acq_investment, KPI.inquiries], cost_per_calc),
    op(KPI.tou_cost, [KPI.acq_investment, KPI.tours], cost_per_calc),
    op(KPI.app_cost, [KPI.acq_investment, KPI.lease_applications], cost_per_calc),
    op(KPI.exe_cost, [KPI.acq_investment, KPI.leases_executed], cost_per_calc),

    op(KPI.exe_to_lowest_rent, [KPI.exe_cost, KPI.lowest_monthly_rent], chain(div_or_0, float)),
)


def generated_computed_kpis(base_kpis, outputs=None):
    if outputs is None:
        return kpi_graph(base_kpis)
    return kpi_graph(base_kpis, outputs=outputs)
