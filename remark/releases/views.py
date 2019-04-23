from django.shortcuts import get_object_or_404

from remark.lib.views import ReactView
from .models import ReleaseNote


class ReleaseNotesPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ReleaseNotesPage"

    def get_page_title(self):
        return f"Release Notes"

    def get(self, request):
        self.release_notes = ReleaseNote.objects.all().order_by("-version")
        return self.render(release_notes=self.release_notes.to_jsonable())


class ReleaseNoteDetailsPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ReleaseNoteDetailsPage"

    def get_page_title(self):
        return f"Release Note"

    def get(self, request, release_id):
        self.release_note = get_object_or_404(ReleaseNote, id=release_id)
        return self.render(release_note=self.release_note.to_jsonable())
