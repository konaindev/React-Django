from django.urls import path

from .views import ProductInquiryView

app_name="sales"


urlpatterns = [
    path("new-project", ProductInquiryView.as_view(), name="new_product_inquiry"),
]
