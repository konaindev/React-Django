from django.urls import path

from .views import (
    PortfolioTableView,
)

urlpatterns = [
    path("table/", PortfolioTableView.as_view(), name="portfolio_analysis_table"),
]
