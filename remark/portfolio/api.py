from remark.projects.models import Project
from django.urls import reverse


def get_property_list(user_id):
    projects = Project.objects.filter(view_group__includes=user_id)
    projects = list(projects)

    # Iterate through and find custom groupings
    groupings = {}
    for project in projects:
        if len(project.custom_tags) > 0:
            for custom_tag in project.custom_tags:
                if custom_tag.name not in groupings:
                    groupings[custom_tag.name] = []
                groupings[custom_tag.name].append(project.public_id)

    return projects, groupings


def get_project_details(project_id):
    project = Project.objects.get(pk=project_id)
    return {
        "name": project.name,
        "address": f"{project.property.address.city}, {project.property.address.state}",
        "image_url": project.property.building_image.url,
        "url": reverse("projects.performance_report", kwargs={"report_span": "last-four-weeks"})
    }


def get_project_health(project_id, start, end):
    # TODO: Fix me
    return 2


def get_kpis_for_project(project_id, start, end, kpis):
    # TODO: Fix me
    return {
        "lease_rate": 0.57,
        "renewal_rate": 0.0,
        "occupancy_rate": 0.52
    }


def get_targets_for_project(project_id, start, end, targets):
    # TODO: Fix me
    return {
        "lease_rate": 0.57,
        "renewal_rate": 0.0,
        "occupancy_rate": 0.52
    }


def get_stats_for_group(group_periods):
    pass


def get_remarkably_average(start, end):
    pass




