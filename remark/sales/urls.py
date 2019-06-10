from django.urls import path

from .views import NewPropertyView


urlpatterns = [path("new-project/", NewPropertyView.as_view(), name="new_property")]
