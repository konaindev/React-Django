from django.urls import path

from .views import (
    EmailTestPage,
)


urlpatterns = [
    path("weekly_performance", EmailTestPage.as_view(), name="weekly_performance"),
]
