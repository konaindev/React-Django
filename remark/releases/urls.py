from django.urls import path

from .views import (
    ListReleaseNoteView,
    ReleaseNoteDetailView,
)

app_name="releases"


urlpatterns = [
    path("", ListReleaseNoteView.as_view(), name="release_notes"),
    path('<int:pk>/', ReleaseNoteDetailView.as_view(), name="release_notes_detail"),
]
