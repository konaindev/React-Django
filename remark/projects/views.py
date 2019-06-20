from django.contrib import messages
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.edit import FormView
from django.views.generic.detail import SingleObjectMixin
from django.urls import reverse

from remark.lib.views import ReactView
from remark.admin import admin_site
from .reports.selectors import (
    BaselineReportSelector,
    PerformanceReportSelector,
    MarketReportSelector,
    ModelingReportSelector,
    CampaignPlanSelector,
    ReportLinks,
)
from .models import Project
from .forms import TAMExportForm
from .tasks import export_tam_task

from remark.lib.logging import getLogger, error_text


logger = getLogger(__name__)


class ProjectPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"

    def get_page_title(self):
        return f"{self.project.name} Reports"

    def get(self, request, project_id):
        self.project = get_object_or_404(Project, public_id=project_id)
        return self.render(
            project=self.project.to_jsonable(),
            report_links=ReportLinks.public_for_project(self.project),
        )


class ReportPageViewBase(ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None

    def get_page_title(self):
        return f"{self.project.name} {self.page_title}"

    def get(self, request, project_id, *args, **kwargs):
        logger.info("ReportPageViewBase::get::top")
        self.project = get_object_or_404(Project, public_id=project_id)
        logger.info("ReportPageViewBase::get::after get_object_or_404")

        try:
            logger.info("ReportPageViewBase::get::before selector_class")
            self.selector = self.selector_class(self.project, *args, **kwargs)
            logger.info("ReportPageViewBase::get::after selector_class")
        except Exception:
            self.selector = None
            raise Http404

        logger.info("ReportPageViewBase::get::checking has_report_data")
        if (self.selector is None) or (not self.selector.has_report_data()):
            raise Http404
        logger.info("ReportPageViewBase::get::after checking has_report_data")

        project_json = None
        report_links = None
        report = None
        current_report_link = None

        try:
            report_links = ReportLinks.public_for_project(self.project)
            project_json = self.project.to_jsonable()
            report=self.selector.get_report_data()
            current_report_link=self.selector.get_link()
        except Exception as e:
            logger.error(error_text(e))
            raise Http404

        logger.info("ReportPageViewBase::get::bottom")
        return self.render(
            report_links=report_links,
            project=project_json,
            report=report,
            current_report_link=current_report_link,
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


class CampaignPlanPageView(ReportPageViewBase):
    """Return a campaign plan page"""

    selector_class = CampaignPlanSelector
    page_class = "CampaignPlanPage"
    page_title = "Campaign Plan"


class TAMExportView(FormView, SingleObjectMixin):
    template_name = "projects/tam-export.html"
    form_class = TAMExportForm
    model = Project

    def get_success_url(self):
        return reverse("admin:tam_export", kwargs={ "pk": self.object.pk })

    def get_context_data(self, **kwargs):
        self.object = self.get_object()
        context = {
            **admin_site.each_context(self.request),
            **super().get_context_data(**kwargs),
            "opts": Project._meta,
        }
        return context

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()

        if form.is_valid():
            project = self.object
            if project.address is None:
                messages.error(request, "This project doesn't have an address yet.")
                return self.form_invalid(form)

            export_tam_task.delay(project.pk, request.user.pk, form.cleaned_data)
            messages.success(request, "TAM Export started. You will be emailed with the result shortly.")
            return self.form_valid(form)
        else:
            return self.form_invalid(form)
