from django.urls import path

from .views import (
    ProjectOverallView,
    ProjectReportsView,
    ProjectUpdateAPIView,
    MembersView,
    AddMembersView,
    ProjectRemoveMemberIView
)

app_name = "releases"


urlpatterns = [
    path("projects/<public_id>/overall/", ProjectOverallView.as_view(), name="project_overall"),
    path("projects/<public_id>/reports/", ProjectReportsView.as_view(), name="project_reports"),
    # path(
    #     "<project_id>/baseline/",
    #     BaselineReportPageView.as_view(),
    #     name="baseline_report",
    # ),
    # path(
    #     "<project_id>/performance/<report_span>/",
    #     PerformanceReportPageView.as_view(),
    #     name="performance_report",
    # ),
    # path("<project_id>/market/", MarketReportPageView.as_view(), name="market_report"),
    # path(
    #     "<project_id>/modeling/",
    #     ModelingReportPageView.as_view(),
    #     name="modeling_report",
    # ),
    # path(
    #     "<project_id>/campaign_plan/",
    #     CampaignPlanPageView.as_view(),
    #     name="campaign_plan",
    # ),
    # # Add Support for Share URLs to Reports
    # path(
    #     "<project_id>/share/baseline/",
    #     BaselineReportPageView.as_view(is_anonymous_view=True),
    #     name="baseline_report_shared",
    # ),
    # path(
    #     "<project_id>/share/performance/<report_span>/",
    #     PerformanceReportPageView.as_view(is_anonymous_view=True),
    #     name="performance_report_shared",
    # ),
    # path(
    #     "<project_id>/share/market/",
    #     MarketReportPageView.as_view(is_anonymous_view=True),
    #     name="market_report_shared"
    # ),
    # path(
    #     "<project_id>/share/modeling/",
    #     ModelingReportPageView.as_view(is_anonymous_view=True),
    #     name="modeling_report_shared",
    # ),
    # path(
    #     "<project_id>/share/campaign_plan/",
    #     CampaignPlanPageView.as_view(is_anonymous_view=True),
    #     name="campaign_plan_shared",
    # ),
    # # REST API to update project details
    # path(
    #     "<project_id>/update/",
    #     ProjectUpdateAPIView.as_view(),
    #     name="update_endpoint",
    # ),
    # path(
    #     "<project_id>/remove-member/",
    #     ProjectRemoveMemberIView.as_view(),
    #     name="project_remove_user",
    # ),
    # path("members/", MembersView.as_view(), name="members" ),
    # path("add-members/", AddMembersView.as_view(), name="add_members" ),
]
