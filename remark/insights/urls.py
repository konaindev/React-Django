from django.urls import path

from .views import PerformanceInsightsView

app_name = "insights"


urlpatterns = [
    path(
        "insights/<public_id>/",
        PerformanceInsightsView.as_view(),
        name="performance_insights",
    )
]
