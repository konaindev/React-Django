from django.urls import path

from .views import ProductInquiryView


urlpatterns = [
    path("new-project", ProductInquiryView.as_view(), name="new_product_inquiry"),
]
