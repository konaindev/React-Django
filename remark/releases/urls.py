from django.urls import path

from rest_framework import routers

from .views import ReleaseNoteViewSet

app_name = "releases"


router = routers.DefaultRouter()
router.register(r"releases", ReleaseNoteViewSet)


urlpatterns = [] + router.urls
