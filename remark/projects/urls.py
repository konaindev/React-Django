from django.urls import path

from .views import (
    ProjectOverallView,
    ProjectPartialUpdateView,
    ProjectReportsView,
    SearchMembersView,
    AddMembersView,
    ProjectRemoveMemberView,
    ChangeMemberRoleView,
    CreateTagView,
    RemoveTagView,
    SearchTagView,
)

app_name = "releases"


urlpatterns = [
    path("projects/<public_id>/overall/", ProjectOverallView.as_view(), name="project_overall"),
    path("projects/<public_id>/update/", ProjectPartialUpdateView.as_view(), name="project_update"),
    path("projects/<public_id>/reports/", ProjectReportsView.as_view(), name="project_reports"),

    # @TODO: better to move to users??
    path("search-members/", SearchMembersView.as_view(), name="search_members"),
    path("projects/add-members/", AddMembersView.as_view(), name="add_members"),
    path("projects/<public_id>/remove-member/", ProjectRemoveMemberView.as_view(), name="project_remove_member"),
    path(
        "projects/<project_id>/member/<user_id>/",
        ChangeMemberRoleView.as_view(),
        name="project_change_role",
    ),
    path("projects/<public_id>/remove-tag/", RemoveTagView.as_view(), name="project_remove_tag"),
    path("projects/<public_id>/create-tag/", CreateTagView.as_view(), name="project_create_tag"),
    path("projects/<public_id>/search-tags/", SearchTagView.as_view(), name="project_search_tags"),
]
