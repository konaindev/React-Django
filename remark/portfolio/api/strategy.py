from decimal import Decimal

from remark.projects.models import Period, TargetPeriod
from remark.lib.time_series.common import KPI
from remark.lib.time_series.query import select
from remark.lib.time_series.granularity import merge


def weighted_average_by_unit_count(items, prop):
    result_type = type(items[0][prop])

    unit_property = KPI.occupied_units
    if KPI.leased_units_end in items[0]:
        unit_property = KPI.leased_units_end

    total_units = 0
    for item in items:
        value = item[unit_property]
        if value is None:
            value = 0
        total_units += value

    if total_units == 0:
        return result_type(0)

    total_units = result_type(total_units)

    result = result_type(0)
    for item in items:
        result += item[prop] * (item[unit_property] / total_units)
    return result


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
    'occupied_units': "linear",
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
    "occupiable_units_start": "first",

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

GROUP_MERGE_DOC = {
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

GROUP_TARGET_MERGE_DOC = {
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
    return merge(merge_doc, split_doc, stripped_periods, start, end)


def get_base_kpis_for_project(project, start, end, skip_select=False):
    # Added for ease of testing
    if not skip_select:
        return get_merged_timeseries(Period, PROPERTY_MERGE_DOCUMENT, PROPERTY_SPLIT_DOCUMENT, project, start, end)
    return merge(PROPERTY_MERGE_DOCUMENT, PROPERTY_SPLIT_DOCUMENT, project, start, end)


def get_targets_for_project(project, start, end, skip_select=False):
    if not skip_select:
        return get_merged_timeseries(TargetPeriod, PROPERTY_TARGET_MERGE_DOC, PROPERTY_TARGET_SPLIT_DOC, project, start, end)
    return merge(PROPERTY_TARGET_MERGE_DOC, PROPERTY_TARGET_SPLIT_DOC, project, start, end)


def get_base_kpis_for_group(group_kpis, start, end):
    return merge(GROUP_MERGE_DOC, GROUP_SPLIT_DOC, group_kpis, start, end)


def get_targets_for_group(group_targets, start, end):
    return merge(GROUP_TARGET_MERGE_DOC, GROUP_TARGET_SPLIT_DOC, group_targets, start, end)
