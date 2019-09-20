from decimal import Decimal
import datetime

from remark.projects.models import Period, TargetPeriod
from remark.lib.time_series.common import KPI
from remark.lib.time_series.query import select
from remark.lib.time_series.granularity import merge
from remark.lib.cache import remark_cache, TIMEOUT_1_WEEK


def weighted_average_by_unit_count(items, prop):
    result_type = type(items[0][prop])

    unit_property = KPI.occupied_units
    if KPI.leased_units_end in items[0]:
        unit_property = KPI.leased_units_end

    total_units = 0
    for item in items:
        value = item.get(unit_property)
        if value is None:
            value = 0
        total_units += value

    if total_units == 0:
        return result_type(0)

    total_units = result_type(total_units)

    result = result_type(0)
    for item in items:
        result += item[prop] * (item.get(unit_property, 0) / total_units)
    return result


def date_to_datetime(d):
    return datetime.datetime.fromordinal(d.toordinal())


def calc_occupied_units(item, prop, when):
    moveins = item[KPI.move_ins]
    moveouts = item[KPI.move_outs]
    occupied_units = item[KPI.occupied_units]
    when = date_to_datetime(when).timestamp()
    start = date_to_datetime(item["start"]).timestamp()
    end = date_to_datetime(item["end"]).timestamp()
    total_time = end - start
    left_ratio = (when - start) / total_time
    delta_leases = moveins - moveouts
    left = occupied_units - round(delta_leases * left_ratio)
    right = occupied_units
    return left, right


PROPERTY_TARGET_MERGE_DOC = {
    'leased_rate': weighted_average_by_unit_count,
    'lease_applications': "sum",
    'leases_executed': "sum",
    'lease_renewal_notices': "sum",
    'lease_renewals': "sum",
    'lease_vacation_notices': "sum",
    'lease_cds': "sum",
    'delta_leases': "sum",
    'move_ins': "sum",
    'move_outs': "sum",
    'occupied_units': "last",
    'acq_investment': "sum",
    'ret_investment': "sum",
    'usvs': "sum",
    'inquiries': "sum",
    'tours': "sum",
}

PROPERTY_TARGET_SPLIT_DOC = {
    'leased_rate': "noop",
    'lease_applications': "linear",
    'leases_executed': "linear",
    'lease_renewal_notices': "linear",
    'lease_renewals': "linear",
    'lease_vacation_notices': "linear",
    'lease_cds': "linear",
    'delta_leases': "linear",
    'move_ins': "linear",
    'move_outs': "linear",
    'occupied_units': calc_occupied_units,
    'acq_investment': "linear",
    'ret_investment': "linear",
    'usvs': "linear",
    'inquiries': "linear",
    'tours': "linear",
}

PROPERTY_MERGE_DOCUMENT = {
    "leases_ended": "sum",
    "leased_units_end": "last",
    "leased_units_start": "first",
    "lease_renewal_notices": "sum",
    "lease_renewals": "sum",
    "lease_vacation_notices": "sum",

    # Activity
    "move_outs": "sum",
    "move_ins": "sum",
    "occupied_units_end": "last",
    "occupied_units_start": "first",
    "occupiable_units_start": "last", # This is non-intuitive but true

    # Cancellations & Denials
    "lease_cds": "sum",

    # Investment
    "acq_reputation_building": "sum",
    "acq_demand_creation": "sum",
    "acq_leasing_enablement": "sum",
    "acq_market_intelligence": "sum",
    "ret_reputation_building": "sum",
    "ret_demand_creation": "sum",
    "ret_leasing_enablement": "sum",
    "ret_market_intelligence": "sum",

    # Funnel Volumes
    "usvs": "sum",
    "inquiries": "sum",
    "tours": "sum",
    "lease_applications": "sum",
    "leases_executed": "sum",

    # Rent
    "average_monthly_rent": "last",
    "lowest_monthly_rent": "last",
    "highest_monthly_rent": "last",
}

PROPERTY_SPLIT_DOCUMENT = {
    "leases_ended": "linear",
    "leased_units_end": "linear",
    "leased_units_start": "linear",
    "lease_renewal_notices": "linear",
    "lease_renewals": "linear",
    "lease_vacation_notices": "linear",

    # Activity
    "move_outs": "linear",
    "move_ins": "linear",
    "occupied_units_end": "linear",
    "occupied_units_start": "linear",
    "occupiable_units_start": "linear",

    # Cancellations & Denials
    "lease_cds": "linear",

    # Investment
    "acq_reputation_building": "linear",
    "acq_demand_creation": "linear",
    "acq_leasing_enablement": "linear",
    "acq_market_intelligence": "linear",
    "ret_reputation_building": "linear",
    "ret_demand_creation": "linear",
    "ret_leasing_enablement": "linear",
    "ret_market_intelligence": "linear",

    # Funnel Volumes
    "usvs": "linear",
    "inquiries": "linear",
    "tours": "linear",
    "lease_applications": "linear",
    "leases_executed": "linear",

    # Rent
    "average_monthly_rent": "noop",
    "lowest_monthly_rent": "noop",
    "highest_monthly_rent": "noop",
}

GROUP_AGGREGATE_MERGE_DOC = {
    "leases_ended": "sum",
    "leased_units_end": "sum",
    "leased_units_start": "sum",
    "lease_renewal_notices": "sum",
    "lease_renewals": "sum",
    "lease_vacation_notices": "sum",

    # Activity
    "move_outs": "sum",
    "move_ins": "sum",
    "occupied_units_end": "sum",
    "occupied_units_start": "sum",
    "occupiable_units_start": "sum",

    # Cancellations & Denials
    "lease_cds": "sum",

    # Investment
    "acq_reputation_building": "sum",
    "acq_demand_creation": "sum",
    "acq_leasing_enablement": "sum",
    "acq_market_intelligence": "sum",
    "ret_reputation_building": "sum",
    "ret_demand_creation": "sum",
    "ret_leasing_enablement": "sum",
    "ret_market_intelligence": "sum",

    # Funnel Volumes
    "usvs": "sum",
    "inquiries": "sum",
    "tours": "sum",
    "lease_applications": "sum",
    "leases_executed": "sum",

    # Rent
    "average_monthly_rent": weighted_average_by_unit_count,
    "lowest_monthly_rent": weighted_average_by_unit_count,
    "highest_monthly_rent": weighted_average_by_unit_count,
}

GROUP_AVERAGE_MERGE_DOC = {
    "leases_ended": "average",
    "leased_units_end": "average",
    "leased_units_start": "average",
    "lease_renewal_notices": "average",
    "lease_renewals": "average",
    "lease_vacation_notices": "average",

    # Activity
    "move_outs": "average",
    "move_ins": "average",
    "occupied_units_end": "average",
    "occupied_units_start": "average",
    "occupiable_units_start": "average",

    # Cancellations & Denials
    "lease_cds": "average",

    # Investment
    "acq_reputation_building": "average",
    "acq_demand_creation": "average",
    "acq_leasing_enablement": "average",
    "acq_market_intelligence": "average",
    "ret_reputation_building": "average",
    "ret_demand_creation": "average",
    "ret_leasing_enablement": "average",
    "ret_market_intelligence": "average",

    # Funnel Volumes
    "usvs": "average",
    "inquiries": "average",
    "tours": "average",
    "lease_applications": "average",
    "leases_executed": "average",

    # Rent
    "average_monthly_rent": weighted_average_by_unit_count,
    "lowest_monthly_rent": weighted_average_by_unit_count,
    "highest_monthly_rent": weighted_average_by_unit_count,
}

GROUP_SPLIT_DOC = {
    "leases_ended": "linear",
    "leased_units_end": "linear",
    "leased_units_start": "linear",
    "lease_renewal_notices": "linear",
    "lease_renewals": "linear",
    "lease_vacation_notices": "linear",

    # Activity
    "move_outs": "linear",
    "move_ins": "linear",
    "occupied_units_end": "linear",
    "occupied_units_start": "linear",
    "occupiable_units_start": "linear",

    # Cancellations & Denials
    "lease_cds": "linear",

    # Investment
    "acq_reputation_building": "linear",
    "acq_demand_creation": "linear",
    "acq_leasing_enablement": "linear",
    "acq_market_intelligence": "linear",
    "ret_reputation_building": "linear",
    "ret_demand_creation": "linear",
    "ret_leasing_enablement": "linear",
    "ret_market_intelligence": "linear",

    # Funnel Volumes
    "usvs": "linear",
    "inquiries": "linear",
    "tours": "linear",
    "lease_applications": "linear",
    "leases_executed": "linear",

    # Rent
    "average_monthly_rent": "noop",
    "lowest_monthly_rent": "noop",
    "highest_monthly_rent": "noop",
}

GROUP_AGGREGATE_TARGET_MERGE_DOC = {
    'leased_rate': weighted_average_by_unit_count,
    'lease_applications': "sum",
    'leases_executed': "sum",
    'lease_renewal_notices': "sum",
    'lease_renewals': "sum",
    'lease_vacation_notices': "sum",
    'lease_cds': "sum",
    'delta_leases': "sum",
    'move_ins': "sum",
    'move_outs': "sum",
    'occupied_units': "sum",
    'acq_investment': "sum",
    'ret_investment': "sum",
    'usvs': "sum",
    'inquiries': "sum",
    'tours': "sum",
}

GROUP_AVERAGE_TARGET_MERGE_DOC = {
    'leased_rate': weighted_average_by_unit_count,
    'lease_applications': "average",
    'leases_executed': "average",
    'lease_renewal_notices': "average",
    'lease_renewals': "average",
    'lease_vacation_notices': "average",
    'lease_cds': "average",
    'delta_leases': "average",
    'move_ins': "average",
    'move_outs': "average",
    'occupied_units': "average",
    'acq_investment': "average",
    'ret_investment': "average",
    'usvs': "average",
    'inquiries': "average",
    'tours': "average",
}

GROUP_TARGET_SPLIT_DOC = {
    'leased_rate': "noop",
    'lease_applications': "linear",
    'leases_executed': "linear",
    'lease_renewal_notices': "linear",
    'lease_renewals': "linear",
    'lease_vacation_notices': "linear",
    'lease_cds': "linear",
    'delta_leases': "linear",
    'move_ins': "linear",
    'move_outs': "linear",
    'occupied_units': "linear",
    'acq_investment': "linear",
    'ret_investment': "linear",
    'usvs': "linear",
    'inquiries': "linear",
    'tours': "linear",
}


def get_merged_timeseries(cls, merge_doc, split_doc, project, start, end):
    periods = select(cls.objects.filter(project=project), start, end)
    stripped_periods = []
    for period in periods:
        values = period.get_values()
        values["start"] = period.start
        values["end"] = period.end
        if cls is TargetPeriod:
            # strip `target_`
            keys = list(values.keys())
            for key in keys:
                if "target_" in key:
                    values[key[7:]] = values[key]
                    del values[key]

            print(values)

        stripped_periods.append(values)

    if len(stripped_periods) == 0:
        return None
    result = merge(merge_doc, split_doc, stripped_periods, start, end)
    return result


@remark_cache("remark.portfolio.api.strategy.get_base_kpis_for_project", TIMEOUT_1_WEEK)
def get_base_kpis_for_project(project, start, end, skip_select=False):
    # Added for ease of testing
    if not skip_select:
        return get_merged_timeseries(Period, PROPERTY_MERGE_DOCUMENT, PROPERTY_SPLIT_DOCUMENT, project, start, end)
    return merge(PROPERTY_MERGE_DOCUMENT, PROPERTY_SPLIT_DOCUMENT, project, start, end)


@remark_cache("remark.portfolio.api.strategy.get_targets_for_project", TIMEOUT_1_WEEK)
def get_targets_for_project(project, start, end, skip_select=False):
    if not skip_select:
        return get_merged_timeseries(TargetPeriod, PROPERTY_TARGET_MERGE_DOC, PROPERTY_TARGET_SPLIT_DOC, project, start, end)
    return merge(PROPERTY_TARGET_MERGE_DOC, PROPERTY_TARGET_SPLIT_DOC, project, start, end)


def get_base_kpis_for_group(group_kpis, start, end, average=False):
    if not average:
        return merge(GROUP_AGGREGATE_MERGE_DOC, GROUP_SPLIT_DOC, group_kpis, start, end)

    return merge(GROUP_AVERAGE_MERGE_DOC, GROUP_SPLIT_DOC, group_kpis, start, end)


def get_targets_for_group(group_targets, start, end, average=False):
    if not average:
        return merge(GROUP_AGGREGATE_TARGET_MERGE_DOC, GROUP_TARGET_SPLIT_DOC, group_targets, start, end)

    return merge(GROUP_AVERAGE_TARGET_MERGE_DOC, GROUP_TARGET_SPLIT_DOC, group_targets, start, end)
