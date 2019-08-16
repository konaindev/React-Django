from django.contrib.auth.decorators import login_required
from django.urls import path

from .views import (
    PortfolioTableView,
)

urlpatterns = [
    path("table/", login_required(PortfolioTableView.as_view()), name="portfolio_analysis_table"),
]
