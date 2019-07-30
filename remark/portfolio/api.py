from remark.projects.models import Project
from django.urls import reverse

from remark.lib.time_series.query import select
from remark.lib.time_series.granularity import merge
from remark.lib.time_series.computed import generate_computed_kpis, generate_computed_targets
from remark.lib.time_series.common import KPI, KPIFormat

from remark.projects.models import Period, TargetPeriod

from decimal import Decimal


def weighted_average_by_unit_count(total, item, attr, length):
    unit_property = KPI.occupied_units
    if KPI.leased_units_end in total:
        unit_property = KPI.leased_units_end

    total_units = total[unit_property] + item[unit_property]
    if total_units == 0:
        return 0

    if type(total[attr]) is Decimal or type(item[attr]) is Decimal:
        total_contribution = total[attr] * Decimal(total[unit_property] / total_units)
        item_contribution = item[attr] * Decimal(item[unit_property] / total_units)
    else:
        total_contribution = total[attr] * (total[unit_property] / total_units)
        item_contribution = item[attr] * (item[unit_property] / total_units)
    return total_contribution + item_contribution


def weighted_average_by_count(total, item, attr, length):
    total[attr] += (item[attr] / length)
    return total[attr]


TARGET_MERGE_DOC = {
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

TARGET_SPLIT_DOC = {
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

PERIOD_MERGE_DOCUMENT = {
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
    "average_monthly_rent": weighted_average_by_unit_count,
    "lowest_monthly_rent": weighted_average_by_unit_count,
    "highest_monthly_rent": weighted_average_by_unit_count,
}

PERIOD_SPLIT_DOCUMENT = {
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

PORTFOLIO_MERGE_DOCUMENT = {
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

PORTFOLIO_SPLIT_DOCUMENT = {
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


def merge_timeseries(merge_doc, split_doc, periods, start, end):
    return merge(merge_doc, split_doc, periods, start, end)


def get_merged_timeseries(cls, project, start, end):
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

    # print(f"PERIODS {cls}")
    # print(f"Project: {project.name}")
    # print(stripped_periods)

    merge_doc = PERIOD_MERGE_DOCUMENT if cls is Period else TARGET_MERGE_DOC
    split_doc = PERIOD_SPLIT_DOCUMENT if cls is Period else TARGET_SPLIT_DOC

    if len(stripped_periods) == 0:
        return None
    return merge(merge_doc, split_doc, stripped_periods, start, end)


def get_kpis(project, start, end):
    result = get_merged_timeseries(Period, project, start, end)
    if result is None:
        print(f"Project {project.name} has no KPIs")
    return result


def get_targets(project, start, end):
    return get_merged_timeseries(TargetPeriod, project, start, end)


def get_basic_table_structure(user, start, end):
    projects = Project.objects.get_all_for_user(user)
    projects = list(projects)

    # Iterate through and find custom groupings
    groupings = {}
    project_flat_list = []
    for project in projects:
        # generate flat data for project
        kpis = get_kpis(project, start, end)
        targets = get_targets(project, start, end)

        if kpis is not None:
            project_flat_list.append({
                "id": project.public_id,
                "name": project.name,
                "address": f"{project.property.geo_address.city}, {project.property.geo_address.state}",
                "image_url": project.get_building_image_url(),
                "url": reverse(
                    "performance_report",
                    kwargs={"project_id": project.public_id, "report_span": "last-four-weeks"}
                ),
                "health": project.get_performance_rating(),
                "base_kpis": kpis,
                "base_targets": targets
            })

            # generate table structure
            custom_tags = list(project.custom_tags.all())
            if len(custom_tags) > 0:
                for custom_tag in custom_tags:
                    if custom_tag.word not in groupings:
                        groupings[custom_tag.word] = []
                    groupings[custom_tag.word].append(project.public_id)

    return project_flat_list, groupings


def generate_computed_properties(item, kpis):
    # Need to patch the targets object
    fields_to_copy = (
        KPI.average_monthly_rent,
        KPI.lowest_monthly_rent,
        KPI.occupiable_units_start,
        KPI.leased_units_end,
        KPI.leased_units_start
    )
    for field in fields_to_copy:
        item["base_targets"][field] = item["base_kpis"][field]

    base_kpis = item.pop("base_kpis")
    base_targets = item.pop("base_targets")
    item["kpis"] = generate_computed_kpis(base_kpis, outputs=kpis)
    item["targets"] = generate_computed_targets(base_targets, outputs=kpis)


def format_kpis(item, kpis):
    for kpi in kpis:
        item["kpis"][kpi] = KPIFormat.apply(kpi, item["kpis"][kpi])
        item["targets"][kpi] = KPIFormat.apply(kpi, item["targets"][kpi])


def get_table_structure(user, start, end, kpis):
    project_flat_list, groupings = get_basic_table_structure(user, start, end)
    print(f"Project Length: {len(project_flat_list)}")
    print(f"Project data: {project_flat_list}")

    # First combine all the stats for the Portfolio Average
    portfolio_average = []
    portfolio_average_targets = []
    for project in project_flat_list:
        print(f"Project: {project['base_kpis']}")
        if project["base_kpis"] is not None:
            portfolio_average.append(project["base_kpis"])
        if project["base_targets"] is not None:
            portfolio_average_targets.append(project["base_targets"])

    # Next we need to combine the Group properties
    if len(portfolio_average) == 0:
        table_data = []
        portfolio_average_group = None
    else:
        portfolio_average_group = {
            "type": "group",
            "name": "Portfolio Average",
            "image_url": "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "property_count": len(project_flat_list),
            "base_kpis": merge_timeseries(PORTFOLIO_MERGE_DOCUMENT, PORTFOLIO_SPLIT_DOCUMENT, portfolio_average, start, end),
            "base_targets": merge_timeseries(TARGET_MERGE_DOC, TARGET_SPLIT_DOC, portfolio_average_targets, start, end)
        }
        table_data = [portfolio_average_group, ]

    for group in groupings:
        group_kpis = []
        group_targets = []
        properties = []
        for project_id in groupings[group]:
            # Find in project_list
            for project in project_flat_list:
                if project["id"] == project_id:
                    group_kpis.append(project["base_kpis"])
                    group_targets.append(project["base_targets"])
                    properties.append(project)
                    break

        table_data.append({
            "type": "group",
            "name": group,
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "base_kpis": merge_timeseries(PORTFOLIO_MERGE_DOCUMENT, PORTFOLIO_SPLIT_DOCUMENT, group_kpis, start, end),
            "base_targets": merge_timeseries(TARGET_MERGE_DOC, TARGET_SPLIT_DOC, group_targets, start, end),
            "properties": properties,
            "property_count": len(properties)
        })

    # Now we need to generate all the computed properties
    for item in table_data:
        generate_computed_properties(item, kpis)
        format_kpis(item, kpis)
        if "properties" in item:
            for prop in item["properties"]:
                generate_computed_properties(prop, kpis)
                format_kpis(prop, kpis)

    return table_data, portfolio_average_group




