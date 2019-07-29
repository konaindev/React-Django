from remark.projects.models import Project
from django.urls import reverse

from remark.lib.time_series.query import select
from remark.lib.time_series.granularity import merge
from remark.lib.time_series.computed import generated_computed_kpis
from remark.projects.models import Period, TargetPeriod


def weighted_average_by_unit_count(total, item, attr, length):
    total_units = total["leased_units_end"] + item["leased_units_end"]
    total_contribution = total[attr] * (total["leased_units_end"] / total_units)
    item_contribution = item[attr] * (item["leased_units_end"] / total_units)
    return total_contribution + item_contribution


def weighted_average_by_count(total, item, attr, length):
    total[attr] += (item[attr] / length)
    return total[attr]



TARGET_MERGE_DOC = {
    'target_leased_rate': weighted_average_by_count,
    'target_lease_applications': "sum",
    'target_leases_executed': "sum",
    'target_lease_renewal_notices': "sum",
    'target_lease_renewals': "sum",
    'target_lease_vacation_notices': "sum",
    'target_lease_cds': "sum",
    'target_delta_leases': "sum",
    'target_move_ins': "sum",
    'target_move_outs': "sum",
    'target_occupied_units': "sum",
    'target_acq_investment': "sum",
    'target_ret_investment': "sum",
    'target_usvs': "sum",
    'target_inquiries': "sum",
    'target_tours': "sum",
}

TARGET_SPLIT_DOC = {
    'target_leased_rate': "noop",
    'target_lease_applications': "linear",
    'target_leases_executed': "linear",
    'target_lease_renewal_notices': "linear",
    'target_lease_renewals': "linear",
    'target_lease_vacation_notices': "linear",
    'target_lease_cds': "linear",
    'target_delta_leases': "linear",
    'target_move_ins': "linear",
    'target_move_outs': "linear",
    'target_occupied_units': "linear",
    'target_acq_investment': "linear",
    'target_ret_investment': "linear",
    'target_usvs': "linear",
    'target_inquiries': "linear",
    'target_tours': "linear",
}

PERIOD_MERGE_DOCUMENT = {
    "leases_ended": "sum",
    "leased_units_end": "sum",
    "leased_units_start": "sum",
    "lease_renewal_notices": "sum",
    "lease_renewals": "sum",
    "lease_vacation_notices": "sum",

    # Activity
    "move_outs": "sum",
    "move_ins": "sum",
    "occupied_units_end": "sum", # This is incorrect - need to define
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
    "average_rent": weighted_average_by_unit_count,
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
    "occupied_units_end": "linear",  # This is incorrect - need to define
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
    "average_rent": "noop",
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
        stripped_periods.append(values)
    merge_doc = PERIOD_MERGE_DOCUMENT if cls is Period else TARGET_MERGE_DOC
    split_doc = PERIOD_SPLIT_DOCUMENT if cls is Period else TARGET_SPLIT_DOC
    return merge(merge_doc, split_doc, stripped_periods, start, end)


def get_kpis(project, start, end):
    return get_merged_timeseries(Period, project, start, end)


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
            "base_kpis": get_kpis(project, start, end),
            "base_targets": get_targets(project, start, end)
        })

        # generate table structure
        custom_tags = list(project.custom_tags.all())
        if len(custom_tags) > 0:
            for custom_tag in custom_tags:
                if custom_tag.name not in groupings:
                    groupings[custom_tag.name] = []
                groupings[custom_tag.name].append(project.public_id)

    return project_flat_list, groupings


def generate_computed_properties(item, kpis):
    item["kpis"] = generated_computed_kpis(item.pop("base_kpis"), outputs=kpis)
    item["targets"] = generated_computed_kpis(item.pop("base_targets"), outputs=kpis)


def get_table_structure(user_id, start, end, kpis=None):
    project_flat_list, groupings = get_basic_table_structure(user_id, start, end)

    # First combine all the stats for the Portfolio Average
    portfolio_average = []
    portfolio_average_targets = []
    for project in project_flat_list:
        portfolio_average.append(project["base_kpis"])
        portfolio_average_targets.append(project["base_targets"])

    # Next we need to combine the Group properties
    portfolio_average_group = {
        "type": "group",
        "name": "Portfolio Average",
        "image_url": "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
        "properties": len(project_flat_list),
        "base_kpis": merge_timeseries(PERIOD_MERGE_DOCUMENT, PERIOD_MERGE_DOCUMENT, portfolio_average, start, end),
        "base_targets": merge_timeseries(TARGET_MERGE_DOC, TARGET_SPLIT_DOC, portfolio_average_targets, start, end)
    }
    table_data = [portfolio_average_group, ]
    for group in groupings:
        kpis = []
        targets = []
        properties = []
        for project_id in groupings[group]:
            # Find in project_list
            for project in project_flat_list:
                if project["id"] == project_id:
                    kpis.append(project["base_kpis"])
                    targets.append(project["base_targets"])
                    properties.append(project)
                    break

        table_data.append({
            "type": "group",
            "name": group,
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "base_kpis": merge_timeseries(PERIOD_MERGE_DOCUMENT, PERIOD_SPLIT_DOCUMENT, kpis, start, end),
            "base_targets": merge_timeseries(TARGET_MERGE_DOC, TARGET_SPLIT_DOC, targets, start, end),
            "properties": properties
        })

    # Now we need to generate all the computed properties
    for item in table_data:
        generate_computed_properties(item, kpis)
        if "properties" in item:
            for prop in item["properties"]:
                generate_computed_properties(prop, kpis)

    return table_data, portfolio_average_group




