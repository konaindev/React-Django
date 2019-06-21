from django.urls import path

from .views import DonutPieChartView


urlpatterns = [
    path("donut", DonutPieChartView.as_view(), name="donut"),
]
