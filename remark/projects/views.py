from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.edit import FormView
from django.views.generic.detail import SingleObjectMixin
from tempfile import NamedTemporaryFile

from remark.analytics.google_analytics import fetch_usv_age
from remark.lib.views import ReactView
from remark.admin import admin_site
from xls.exporters.tam_data import build_tam_data, DEFAULT_TEMPLATE_PATH

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


class ProjectSingleMixin:
    def get_project(self, request, project_id):
        self.project = get_object_or_404(Project, public_id=project_id)
        user = request.user
        if not user.is_superuser and not self.project.user_can_view(user):
            raise PermissionDenied


class ProjectPageView(LoginRequiredMixin, ProjectSingleMixin, ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"

    def get_page_title(self):
        return f"{self.project.name} Reports"

    def get(self, request, project_id):
        self.get_project(request, project_id)
        return self.render(
            project=self.project.to_jsonable(),
            report_links=ReportLinks.public_for_project(self.project),
        )


class ReportPageViewBase(LoginRequiredMixin, ProjectSingleMixin, ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None

    def get_page_title(self):
        return f"{self.project.name} {self.page_title}"

    def get(self, request, project_id, *args, **kwargs):
        self.get_project(request, project_id)

        try:
            self.selector = self.selector_class(self.project, *args, **kwargs)
        except Exception:
            self.selector = None
            raise Http404

        if (self.selector is None) or (not self.selector.has_report_data()):
            raise Http404

        return self.render(
            report_links=ReportLinks.public_for_project(self.project),
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


class CampaignPlanPageView(ReportPageViewBase):
    """Return a campaign plan page"""

    selector_class = CampaignPlanSelector
    page_class = "CampaignPlanPage"
    page_title = "Campaign Plan"


class TAMExportView(FormView, SingleObjectMixin):
    template_name = "projects/tam-export.html"
    form_class = TAMExportForm
    model = Project

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
            google_provider = project.analytics_providers.google()
            if google_provider is None:
                messages.error(request, "This project doesn't have an analytics provider yet.")
                return self.form_invalid(form)

            try:
                usvs = fetch_usv_age(google_provider.identifier)
                workbook = build_tam_data(
                    zip_codes=form.cleaned_data["zip_codes"],
                    lat=project.address.latitude,
                    lon=project.address.longitude,
                    loc=",".join([project.address.city, project.address.state]),
                    radius=form.cleaned_data["radius"],
                    income_groups=form.cleaned_data["income_groups"],
                    rti_income_groups=form.cleaned_data["rti_income_groups"],
                    rti_rental_rates=form.cleaned_data["rti_rental_rates"],
                    rti_target=form.cleaned_data["rti_target"],
                    age=project.average_tenant_age,
                    max_rent=project.highest_monthly_rent,
                    avg_rent=project.average_monthly_rent,
                    min_rent=project.lowest_monthly_rent,
                    usvs=usvs,
                    templatefile=DEFAULT_TEMPLATE_PATH
                )

                tmp = NamedTemporaryFile()
                workbook.save(filename=tmp)
                tmp.seek(0)
                stream = tmp.read()
                response = HttpResponse(
                    stream,
                    content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                )
                response['Content-Disposition'] = 'attachment; filename="remarkably-tam-{}.xlsx"'.format(project.name)
                return response
            except Exception as e:
                messages.error(request, str(e))
                return self.form_invalid(form)
        else:
            return self.form_invalid(form)
