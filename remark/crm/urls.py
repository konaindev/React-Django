from django.urls import path

from .views import CompanySearchView, OfficeAddressView

urlpatterns = [
    path("company-search/", CompanySearchView.as_view(), name="CompanySearchView"),
    path("office-address/", OfficeAddressView.as_view(), name="OfficeAddressView"),
]
