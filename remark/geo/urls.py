from django.urls import path

from .views import OfficeAddressView

urlpatterns = [
    path("office-address/", OfficeAddressView.as_view(), name="OfficeAddressView")
]
