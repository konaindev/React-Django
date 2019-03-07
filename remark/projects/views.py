from django.http import Http404
from django.shortcuts import get_object_or_404

from remark.lib.views import ReactView

from .reports.selectors import (
    BaselineReportSelector,
    PerformanceReportSelector,
    MarketReportSelector,
    ModelingReportSelector,
    ReportLinks,
)
from .models import Project


class ProjectPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"

    def get(self, request, project_id):
        project = get_object_or_404(Project, public_id=project_id)
        return self.render(
            project=project.to_jsonable(), report_links=ReportLinks.for_project(project)
        )


class ReportPageViewBase(ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None

    def get(self, request, project_id, *args, **kwargs):
        project = get_object_or_404(Project, public_id=project_id)

        try:
            selector = self.selector_class(project, *args, **kwargs)
        except Exception:
            selector = None
            raise Http404

        if (selector is None) or (not selector.has_report_data()):
            raise Http404

        return self.render(
            report_links=ReportLinks.for_project(project),
            project=project.to_jsonable(),
            report=selector.get_report_data(),
            current_report_link=selector.get_link(),
        )


class BaselineReportPageView(ReportPageViewBase):
    """Return a basline report page."""

    selector_class = BaselineReportSelector
    page_class = "BaselineReportPage"


class PerformanceReportPageView(ReportPageViewBase):
    """Return a performance report page."""

    selector_class = PerformanceReportSelector
    page_class = "PerformanceReportPage"


class MarketReportPageView(ReportPageViewBase):
    """Return a total addressable market (TAM) report page."""

    selector_class = MarketReportSelector
    page_class = "MarketReportPage"


class ModelingReportPageView(ReportPageViewBase):
    """Return a modeling options report page."""

    selector_class = ModelingReportSelector
    page_class = "ModelingReportPage"

