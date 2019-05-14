from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic.edit import FormView
from django.views.generic.detail import SingleObjectMixin
from django.urls import reverse

from remark.lib.views import ReactView, APIView
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


# project model field names used to control anonymous access, by report_name
shared_field_names = dict(
    baseline="is_baseline_report_shared",
    market="is_tam_shared",
    performance="is_performance_report_shared",
    modeling="is_modeling_shared",
    campaign_plan="is_campaign_plan_shared"
)


class ProjectSingleMixin:
    def get_project(self, request, project_id):
        self.project = get_object_or_404(Project, public_id=project_id)

        user = request.user

        if not self.is_anonymous_view:
            if not user.is_authenticated:
                raise Http404
            elif not self.project.user_can_view(user):
                raise PermissionDenied

        is_report_shared = False
        shared_field_name = shared_field_names.get(self.report_name)
        if shared_field_name is not None:
            is_report_shared = getattr(self.project, shared_field_name, False)

        # prevent anonymous users from accessing reports which are NOT shared
        if not is_report_shared and (not user.is_authenticated):
            raise Http404


class ProjectPageView(ProjectSingleMixin, ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"
    is_anonymous_view = False
    report_name = None

    def get_page_title(self):
        return f"{self.project.name} Reports"

    def get(self, request, project_id):
        self.get_project(request, project_id)

        return self.render(
            project=self.project.to_jsonable(),
            report_links=ReportLinks.public_for_project(self.project),
        )


class ReportPageViewBase(ProjectSingleMixin, ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None
    report_name = None
    is_anonymous_view = False

    def get_page_title(self):
        return f"{self.project.name} {self.page_title}"

    def get(self, request, project_id, *args, **kwargs):
        self.get_project(request, project_id)

        try:
            self.selector = self.selector_class(self.project, *args, **kwargs)
        except Exception as ex:
            print(type(ex).__name__, ex.args)
            raise Http404

        if (self.selector is None) or (not self.selector.has_report_data()):
            raise Http404

        if self.is_anonymous_view:
            report_links = ReportLinks.share_for_project(self.project)
            current_report_link = self.selector.get_share_link()
        else:
            report_links = ReportLinks.public_for_project(self.project)
            current_report_link = self.selector.get_link()

        return self.render(
            report_links=report_links,
            current_report_link=current_report_link,
            project=self.project.to_jsonable(),
            report=self.selector.get_report_data(),
            share_info=self.selector.get_share_info(self.base_url())
        )


class BaselineReportPageView(ReportPageViewBase):
    """Return a basline report page."""

    selector_class = BaselineReportSelector
    page_class = "BaselineReportPage"
    page_title = "Baseline Report"
    report_name = "baseline"


class PerformanceReportPageView(ReportPageViewBase):
    """Return a performance report page."""

    selector_class = PerformanceReportSelector
    page_class = "PerformanceReportPage"
    page_title = "Performance Report"
    report_name = "performance"


class MarketReportPageView(ReportPageViewBase):
    """Return a total addressable market (TAM) report page."""

    selector_class = MarketReportSelector
    page_class = "MarketReportPage"
    page_title = "Market Analysis"
    report_name = "market"


class ModelingReportPageView(ReportPageViewBase):
    """Return a modeling options report page."""

    selector_class = ModelingReportSelector
    page_class = "ModelingReportPage"
    page_title = "Modeling Report"
    report_name = "modeling"


class CampaignPlanPageView(ReportPageViewBase):
    """Return a campaign plan page"""

    selector_class = CampaignPlanSelector
    page_class = "CampaignPlanPage"
    page_title = "Campaign Plan"
    report_name = "campain_plan"


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


class ProjectUpdateAPIView(LoginRequiredMixin, APIView):
    # APIView to update project details

    # Doesn't need CSRF protection for this REST API endpoint
    csrf_exempt = True

    actions_supported = ["shared_reports"]

    def put(self, request, project_id):
        payload = self.get_data()
        update_action = payload.get("update_action")

        if not update_action in self.actions_supported:
            return self.render_failure_message("Not supported")

        if update_action == "shared_reports":
            return self.update_shared_reports(project_id, payload)

    def update_shared_reports(self, project_id, payload):
        try:
            shared = payload.get("shared")
            report_name = payload.get("report_name")
            field_name = shared_field_names.get(report_name)
            
            project = Project.objects.get(public_id=project_id)
            setattr(project, field_name, shared)
            project.save()

            return self.render_success()
        except Exception:
            return self.render_failure_message("Failed to update")
