from django.urls import path

from .views import (
    ReleaseNotesPageView,
    ReleaseNoteDetailsPageView,
)


urlpatterns = [
    path("", ReleaseNotesPageView.as_view(), name="release_notes"),
    path(
        "<release_id>/",
        ReleaseNoteDetailsPageView.as_view(),
        name="release_note",
    ),
]
