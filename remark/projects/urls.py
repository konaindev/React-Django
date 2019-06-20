from django.urls import path

from .views import (
    ProjectPageView,
    BaselineReportPageView,
    PerformanceReportPageView,
    MarketReportPageView,
    ModelingReportPageView,
    CampaignPlanPageView
)


urlpatterns = [
    path("<project_id>/", ProjectPageView.as_view(), name="project"),
    path(
        "<project_id>/baseline/",
        BaselineReportPageView.as_view(),
        name="baseline_report",
    ),
    path(
        "<project_id>/performance/<report_span>/",
        PerformanceReportPageView.as_view(),
        name="performance_report",
    ),
    path("<project_id>/market/", MarketReportPageView.as_view(), name="market_report"),
    path(
        "<project_id>/modeling/",
        ModelingReportPageView.as_view(),
        name="modeling_report",
    ),
    path(
        "<project_id>/campaign_plan/",
        CampaignPlanPageView.as_view(),
        name="campaign_plan",
    )
]
