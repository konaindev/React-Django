from remark.projects.models import Project


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

def get_stats_for_project(project_id, start, end):
    pass

def get_stats_for_group(group_periods):
    pass

def get_remarkably_average(start, end):
    pass




