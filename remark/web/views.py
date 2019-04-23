from remark.lib.views import ReactView


class DashboardView(ReactView):
    """Render dashboard page."""

    page_class = "DashboardPage"

    def get_page_title(self):
        return "Dashboard"
