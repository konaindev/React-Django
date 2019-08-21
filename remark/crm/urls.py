from django.urls import path

from .views import CompanySearchView

urlpatterns = [
    path("company-search/", CompanySearchView.as_view(), name="CompanySearchView")
]
