from django.urls import path

from .views import (
    WeeklyPerformanceTestPage,
    WelcomeTestPage,
    AddedToPropertyTestPage,
)


urlpatterns = [
    path("weekly_performance", WeeklyPerformanceTestPage.as_view(), name="weekly_performance"),
    path("welcome", WelcomeTestPage.as_view(), name="welcome"),
    path("added_to_property", AddedToPropertyTestPage.as_view(), name="added_to_property")
]
