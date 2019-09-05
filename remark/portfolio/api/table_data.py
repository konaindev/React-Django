from remark.projects.models import Project
from django.urls import reverse

from remark.projects.constants import THUMBNAIL
from remark.lib.time_series.computed import generate_computed_kpis, generate_computed_targets
from remark.lib.time_series.common import KPI, KPIFormat
from .strategy import get_base_kpis_for_project, get_targets_for_project, get_base_kpis_for_group, get_targets_for_group

def generate_computed_properties(item, kpis):
    base_kpis = item["base_kpis"]
    item["kpis"] = generate_computed_kpis(base_kpis, outputs=kpis)

    base_targets = item["base_targets"]
    if base_targets is None:
        return

    # Need to patch the targets object
    fields_to_copy = (
        KPI.average_monthly_rent,
        KPI.lowest_monthly_rent,
        KPI.occupiable_units_start,
        KPI.leased_units_end,
        KPI.leased_units_start
    )
    for field in fields_to_copy:
        item["base_targets"][field] = base_kpis[field]
    
    item["targets"] = generate_computed_targets(base_targets, outputs=kpis)


def format_kpis(item, kpis):
    for kpi in kpis:
        item["kpis"][kpi] = KPIFormat.apply(kpi, item["kpis"][kpi])
        if "targets" in item and item["targets"] is not None:
            item["targets"][kpi] = KPIFormat.apply(kpi, item["targets"][kpi])


def strip_base_data(item):
    if "base_targets" in item:
        del item["base_targets"]
    if "base_kpis" in item:
        del item["base_kpis"]
    if "properties" in item:
        for subitem in item["properties"]:
            strip_base_data(subitem)



def get_table_structure(user, start, end, kpis, show_averages):
    projects = Project.objects.get_all_for_user(user)
    projects = list(projects)

    # Iterate through and find custom groupings
    groupings = {}
    project_flat_list = []
    for project in projects:
        # generate flat data for project
        base_kpis = get_base_kpis_for_project(project, start, end)
        base_targets = get_targets_for_project(project, start, end)

        if base_kpis is not None:
            image_url = project.get_building_image()[2]
            if image_url == "":
                image_url = "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png"

            item = {
                "id": project.public_id,
                "type": "individual",
                "name": project.name,
                "address": f"{project.property.geo_address.city}, {project.property.geo_address.state}",
                "image_url": image_url,
                "url": reverse(
                    "performance_report",
                    kwargs={"project_id": project.public_id, "report_span": "last-four-weeks"}
                ),
                "health": project.get_performance_rating(),
                "base_kpis": base_kpis,
                "base_targets": base_targets
            }
            generate_computed_properties(item, kpis)
            format_kpis(item, kpis)
            project_flat_list.append(item)

            # generate table structure
            custom_tags = list(project.custom_tags.all())
            if len(custom_tags) > 0:
                for custom_tag in custom_tags:
                    if custom_tag.word not in groupings:
                        groupings[custom_tag.word] = []
                    groupings[custom_tag.word].append(project.public_id)

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
    table_data = []
    if len(portfolio_average) == 0:
        portfolio_average_group = None
    else:
        portfolio_average_group = {
            "type": "group",
            "name": "All My Properties",
            "image_url": "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "property_count": len(project_flat_list),
            "base_kpis": get_base_kpis_for_group(portfolio_average, start, end, show_averages),
            "base_targets": get_targets_for_group(portfolio_average_targets, start, end, show_averages)
        }
        generate_computed_properties(portfolio_average_group, kpis)
        format_kpis(portfolio_average_group, kpis)

    properties_in_groups = []
    for group in groupings:
        group_kpis = []
        group_targets = []
        properties = []
        for project_id in groupings[group]:
            # Find in project_list
            for project in project_flat_list:
                if project["id"] == project_id:
                    if project["id"] not in properties_in_groups:
                        properties_in_groups.append(project["id"])
                    group_kpis.append(project["base_kpis"])
                    if project["base_targets"] is not None:
                        group_targets.append(project["base_targets"])
                    properties.append(project)
                    break

        table_data.append({
            "type": "group",
            "name": group,
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "base_kpis": get_base_kpis_for_group(group_kpis, start, end, show_averages),
            "base_targets": get_targets_for_group(group_targets, start, end, show_averages),
            "properties": properties,
            "property_count": len(properties)
        })

    # Now we need to generate all the computed properties
    for item in table_data:
        generate_computed_properties(item, kpis)
        format_kpis(item, kpis)

    # Now add the solo properties
    for project in project_flat_list:
        if project["id"] not in properties_in_groups:
            table_data.append(project)

    table_data.append(portfolio_average_group)

    # Remove all the base kpis & targets
    for item in table_data:
        strip_base_data(item)

    return table_data, portfolio_average_group
