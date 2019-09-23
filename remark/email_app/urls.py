from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import (
    WeeklyPerformanceTestPage,
    WelcomeCreateAccountTestPage,
    WelcomeGetStartedTestPage,
    AddedToPropertyTestPage,
)


urlpatterns = [
    path("weekly_performance", WeeklyPerformanceTestPage.as_view(), name="weekly_performance"),
    path("welcome_create_account", WelcomeCreateAccountTestPage.as_view(), name="welcome_create_account"),
    path("welcome_get_started", WelcomeGetStartedTestPage.as_view(), name="welcome_get_started"),
    path("added_to_property", AddedToPropertyTestPage.as_view(), name="added_to_property")
]
