from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import (
    EmailTestPage,
)


urlpatterns = [
    path("weekly_performance", login_required(EmailTestPage.as_view()), name="weekly_performance"),
]
