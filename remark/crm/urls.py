from django.urls import path

from .views import CompanySearchView, OfficeAddressView

app_name = "crm"


urlpatterns = [
    path("company-search/", CompanySearchView.as_view(), name="company_search_view"),
    path("office-address/", OfficeAddressView.as_view(), name="office_address_view"),
]
