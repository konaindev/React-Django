from django.urls import path

from .views import PerformanceInsightsView, BaselineInsightsView

app_name = "insights"


urlpatterns = [
    path(
        "insights/<public_id>/performance/",
        PerformanceInsightsView.as_view(),
        name="performance_insights",
    ),
    path(
        "insights/<public_id>/baseline/",
        BaselineInsightsView.as_view(),
        name="baseline_insights",
    ),
]
