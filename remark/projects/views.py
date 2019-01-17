import datetime

from django.http import Http404
from django.shortcuts import get_object_or_404
from django.urls import reverse

from remark.lib.views import ReactView

from .reports import Report
from .models import Project


class ProjectPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"

    def get(self, request, project_id):
        project = get_object_or_404(Project, public_id=project_id)
        report_links = []
        for period in project.periods.all():
            label = (period.start.isoformat(), period.end.isoformat())
            report_span = "{},{}".format(*label)
            kwargs = {"project_id": project_id, "report_span": report_span}
            url = reverse("report", kwargs=kwargs)
            report_links.append((*label, url))
        return self.render(project=project.to_jsonable(), report_links=report_links)


class ReportPageView(ReactView):
    """Render a page that shows information about a specific period in time."""

    # This is the name of the class in our front-end code; see
    # react.html and index.js for details.
    page_class = "ReportPage"

    def get_date_span(self, report_span):
        """Attempt to parse the report span. Raise an exception on failure."""
        splits = report_span.split(",")
        start = datetime.datetime.strptime(splits[0], "%Y-%m-%d").date()
        end = datetime.datetime.strptime(splits[1], "%Y-%m-%d").date()
        return (start, end)

    def get(self, request, project_id, report_span):
        project = get_object_or_404(Project, public_id=project_id)

        try:
            start, end = self.get_date_span(report_span)
        except Exception:
            raise Http404

        report = Report.from_date_span(project, start, end)
        if report is None:
            raise Http404

        return self.render(report=report.to_jsonable(), project=project.to_jsonable())
