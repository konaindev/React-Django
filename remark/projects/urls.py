from django.urls import path

from .views import ProjectPageView, ReportPageView


urlpatterns = [
    # TODO figure out what the right structure is when we start allowing
    # navigation between reports for a project.
    #
    # Option 1: all reports are available at <project_id>/ directly,
    # and there's simply a front-end dropdown that selects which one is shown.
    #
    # Option 2: reports are available at <project_id>/<report_id> and there's
    # some navigation that moves between pages.
    #
    # Option 3: ?
    #
    # -Dave
    path("<project_id>/", ProjectPageView.as_view(), name="project"),
    path("<project_id>/report/<report_span>/", ReportPageView.as_view(), name="report"),
]
