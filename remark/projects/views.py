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

    def get_page_title(self):
        return f"{self.project.name} Reports"

    def get(self, request, project_id):
        self.project = get_object_or_404(Project, public_id=project_id)
        return self.render(
            project=self.project.to_jsonable(),
            report_links=ReportLinks.for_project(self.project),
        )


class ReportPageViewBase(ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None

    def get_page_title(self):
        return f"{self.project.name} {self.page_title}"

    def get(self, request, project_id, *args, **kwargs):
        self.project = get_object_or_404(Project, public_id=project_id)

        try:
            self.selector = self.selector_class(self.project, *args, **kwargs)
        except Exception:
            self.selector = None
            raise Http404

        if (self.selector is None) or (not self.selector.has_report_data()):
            raise Http404

        return self.render(
            report_links=ReportLinks.for_project(self.project),
            project=self.project.to_jsonable(),
            report=self.selector.get_report_data(),
            current_report_link=self.selector.get_link(),
        )


class BaselineReportPageView(ReportPageViewBase):
    """Return a basline report page."""

    selector_class = BaselineReportSelector
    page_class = "BaselineReportPage"
    page_title = "Baseline Report"


class PerformanceReportPageView(ReportPageViewBase):
    """Return a performance report page."""

    selector_class = PerformanceReportSelector
    page_class = "PerformanceReportPage"
    page_title = "Performance Report"


class MarketReportPageView(ReportPageViewBase):
    """Return a total addressable market (TAM) report page."""

    selector_class = MarketReportSelector
    page_class = "MarketReportPage"
    page_title = "Market Analysis"


class ModelingReportPageView(ReportPageViewBase):
    """Return a modeling options report page."""

    selector_class = ModelingReportSelector
    page_class = "ModelingReportPage"
    page_title = "Modeling Report"

