from django.contrib.auth.views import redirect_to_login
from django.contrib import messages
# from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.generic.edit import FormView
from django.views.generic.detail import SingleObjectMixin
from django.urls import reverse

from rest_framework import exceptions, generics, status
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response

from remark.lib.views import ReactView
from remark.admin import admin_site
from remark.users.models import User
from remark.web.views import DashboardView
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

class Redirect(Exception):
    pass


class AllowGetMethod(BasePermission):
    """
    Only allow GET requets
    """
    def has_permission(self, request, view):
        return request.method == "GET"


class AllowPatchMethod(BasePermission):
    """
    Only allow PATCH requets
    """
    def has_permission(self, request, view):
        return request.method == "PATCH"


class ProjectCustomPermission(BasePermission):
    """
    - check project specified by query parameter exists
    - check user allowed access to the project
    - check shared status of a particular report
    """
    valid_report_types = ["baseline", "market", "modeling", "campaign_plan", "performance"]

    def check_report_enabled(self, project, report_type):
        internal_fields = dict(
            baseline="is_baseline_report_public",
            market="is_tam_public",
            performance="is_performance_report_public",
            modeling="is_modeling_public",
            campaign_plan="is_campaign_plan_public"
        )
        enabled_field = internal_fields[report_type]
        return getattr(project, enabled_field, False)

    def check_report_shared(self, project, report_type):
        internal_fields = dict(
            baseline="is_baseline_report_shared",
            market="is_tam_shared",
            performance="is_performance_report_shared",
            modeling="is_modeling_shared",
            campaign_plan="is_campaign_plan_shared"
        )
        shared_field = internal_fields[report_type]
        return getattr(project, shared_field, False)

    def has_permission(self, request, view):
        user = request.user
        allow_anonymous = view.allow_anonymous

        project_id = view.kwargs.get('project_id', None)
        project = get_object_or_404(Project, public_id=project_id)

        # for project overall endpoint
        if not allow_anonymous:
            if not user.is_authenticated:
                raise exceptions.NotAuthenticated
            elif not project.user_can_view(user):
                raise exceptions.PermissionDenied
            else:
                return True

        report_type = request.GET.get("report_type")
        if report_type not in self.valid_report_types:
            raise exceptions.ParseError # HTTP_400_BAD_REQUEST

        # for project (shared) reports endpoint
        is_report_enabled = self.check_report_enabled(project, report_type)
        is_report_shared = self.check_report_shared(project, report_type)

        if not is_report_enabled:
            raise exceptions.NotFound

        if not is_report_shared and not user.is_authenticated:
            raise exceptions.NotAuthenticated
        elif not is_report_shared and not project.user_can_view(user):
            raise exceptions.PermissionDenied
        else:
            return True


class ProjectOverallView(APIView):
    """JSON data about the overall project."""

    permission_classes = [AllowGetMethod, ProjectCustomPermission]
    allow_anonymous = False

    def get(self, request, project_id):
        project = get_object_or_404(Project, public_id=project_id)
        project_data = project.to_jsonable()
        project_data["health"] = project.get_performance_rating()

        return JsonResponse(project_data)


# class ReportPageViewBase(ProjectSingleMixin, ReactView):
class ProjectReportsView(APIView):
    """
    JSON data of a specific report type
    """

    permission_classes = [AllowGetMethod, ProjectCustomPermission]
    allow_anonymous = True

    selector_classes = dict(
        baseline=BaselineReportSelector,
        market=MarketReportSelector,
        performance=PerformanceReportSelector,
        modeling=ModelingReportSelector,
        campaign_plan=CampaignPlanSelector,
    )

    def get(self, request, project_id, *args, **kwargs):
        logger.info("ProjectReportsView::get::top")

        project = get_object_or_404(Project, public_id=project_id)
        report_type = request.GET.get("report_type")
        report_span = request.GET.get("report_span")

        try:
            logger.info("ProjectReportsView::get::before selector_class")
            self.selector_class = self.selector_classes.get(report_type)
            kwargs["report_span"] = report_span
            self.selector = self.selector_class(project, **kwargs)
            logger.info("ProjectReportsView::get::after selector_class")
        except Exception as e:
            logger.error(error_text(e))
            self.selector = None
            raise exceptions.APIException

        if not self.selector.has_report_data():
            # do we need detailed response here?
            raise exceptions.APIException(detail="No report data")

        logger.info("ProjectReportsView::get::bottom")
        return JsonResponse(self.selector.get_report_data())


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
            shared_field = shared_fields_by_report.get(report_name)

            project = Project.objects.get(public_id=project_id)
            setattr(project, shared_field, shared)
            project.save()

            return self.render_success()
        except Exception:
            return self.render_failure_message("Failed to update")


class MembersView(LoginRequiredMixin, APIView):
    def post(self, request):
        payload = self.get_data()
        value = payload.get("value", [])
        users = User.objects.filter(
            Q(
                Q(email__icontains=value)
                | Q(person__first_name__icontains=value)
                | Q(person__last_name__icontains=value)
            )
            & Q(account__isnull=False)
        )
        members = [user.get_menu_dict() for user in users]
        return JsonResponse({"members": members})


class AddMembersView(LoginRequiredMixin, APIView):
    def post(self, request):
        payload = self.get_data()
        members = payload.get("members", [])

        projects_ids = [p.get("property_id") for p in payload.get("projects", [])]
        projects = Project.objects.filter(public_id__in=projects_ids)

        users = []
        for member in members:
            user, _ = User.objects.get_or_create_user(member.get("value"))
            users.append(user)

        for project in projects:
            for user in users:
                project.view_group.user_set.add(user)
            project.save()
        projects_list = [DashboardView.get_project_details(p) for p in projects]
        return JsonResponse({"projects": projects_list})


class ProjectRemoveMemberIView(LoginRequiredMixin, APIView):
    def post(self, request, project_id):
        # TODO: Implement this
        return JsonResponse({"project": {}})
