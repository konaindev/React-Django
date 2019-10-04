from django.urls import path

from .views import (
    ProjectOverallView,
    ProjectPartialUpdateView,
    ProjectReportsView,
    MembersView,
    AddMembersView,
    ProjectRemoveMemberIView
)

app_name = "releases"


urlpatterns = [
    path("projects/<public_id>/overall/", ProjectOverallView.as_view(), name="project_overall"),
    path("projects/<public_id>/update/", ProjectPartialUpdateView.as_view(), name="project_update"),
    path("projects/<public_id>/reports/", ProjectReportsView.as_view(), name="project_reports"),
    # path(
    #     "<project_id>/remove-member/",
    #     ProjectRemoveMemberIView.as_view(),
    #     name="project_remove_user",
    # ),
    # path("members/", MembersView.as_view(), name="members" ),
    # path("add-members/", AddMembersView.as_view(), name="add_members" ),
]
