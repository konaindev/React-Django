from remark.lib.views import ReactView
from django.contrib.auth.mixins import LoginRequiredMixin


class DashboardView(LoginRequiredMixin, ReactView):
    """Render dashboard page."""

    page_class = "DashboardPage"

    def get_page_title(self):
        return "Dashboard"
