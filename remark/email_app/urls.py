from django.urls import path

from .views import (
    WeeklyPerformanceTestPage,
    AddedToPropertyTestPage,
)


urlpatterns = [
    path("weekly_performance", WeeklyPerformanceTestPage.as_view(), name="weekly_performance"),
    path("added_to_property", AddedToPropertyTestPage.as_view(), name="added_to_property")
]
