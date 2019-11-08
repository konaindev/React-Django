import datetime

from django.contrib.auth.models import Group
from django.contrib.auth.views import redirect_to_login
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import Http404, JsonResponse
from django.shortcuts import get_object_or_404, redirect
from django.views.generic.edit import FormView
from django.views.generic.detail import SingleObjectMixin
from django.urls import reverse
from django.utils import timezone

from remark.lib.views import ReactView, APIView
from remark.admin import admin_site
from remark.users.models import User
from remark.users.constants import PROJECT_ROLES
from remark.email_app.invites.added_to_property import (
    send_invite_email,
    send_create_account_email,
)

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
from .constants import USER_ROLES

from remark.lib.logging import getLogger, error_text


logger = getLogger(__name__)


class Redirect(Exception):
    pass


# project model field names used to control anonymous access, by report_name
shared_fields_by_report = dict(
    baseline="is_baseline_report_shared",
    market="is_tam_shared",
    performance="is_performance_report_shared",
    modeling="is_modeling_shared",
    campaign_plan="is_campaign_plan_shared",
)


class ProjectSingleMixin:
    def get_project(self, request, project_id):
        self.project = get_object_or_404(Project, public_id=project_id)

        user = request.user

        # protected views
        if not self.is_anonymous_view:
            if not user.is_authenticated:
                raise Redirect
            elif not self.project.user_can_view(user):
                raise PermissionDenied
            else:
                return

        # public shared report views
        try:
            shared_field = shared_fields_by_report.get(self.report_name)
            is_report_shared = getattr(self.project, shared_field, False)
            if not is_report_shared and (not user.is_authenticated):
                logger.error(
                    f"Project ID: {project_id} || is_report_shared: {is_report_shared} || user.is_authenticated: {user.is_authenticated}"
                )
                raise Http404
        except Exception:
            raise Http404


class ProjectPageView(LoginRequiredMixin, ProjectSingleMixin, ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"
    is_anonymous_view = False
    report_name = None

    def get_page_title(self):
        return f"{self.project.name} Reports"

    def get(self, request, project_id):
        try:
            self.get_project(request, project_id)
        except PermissionDenied:
            return redirect("dashboard")
        except Redirect:
            return redirect_to_login(self.request.get_full_path())
        except Exception as e:
            logger.error(error_text(e))
            raise Http404

        return self.render(
            user=request.user.get_menu_dict(),
            project=self.project.to_jsonable(),
            report_links=ReportLinks.public_for_project(self.project),
        )


class ReportPageViewBase(ProjectSingleMixin, ReactView):
    """
    Generic base class for all report views that use ReportSelectors.
    """

    selector_class = None
    is_anonymous_view = False
    report_name = None

    def get_page_title(self):
        return f"{self.project.name} {self.page_title}"

    def get_competitors(self, *args, **kwargs):
        competitors = []
        for project in self.project.competitors:
            if project is not None:
                try:
                    selector = self.selector_class(project, *args, **kwargs)
                    competitors.append(
                        {
                            "report": selector.get_report_data(),
                            "project": self.project.to_jsonable(),
                        }
                    )
                except:
                    pass
        return competitors

    def get(self, request, project_id, *args, **kwargs):
        logger.info("ReportPageViewBase::get::top")

        try:
            self.get_project(request, project_id)
        except PermissionDenied:
            return redirect("dashboard")
        except Redirect:
            return redirect_to_login(self.request.get_full_path())
        except Exception as e:
            logger.error(error_text(e))
            raise Http404

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
            if self.report_name == "market":
                raise Http404
            return redirect("market_report", project_id=project_id)
        logger.info("ReportPageViewBase::get::after checking has_report_data")

        user_menu = None
        share_info = None

        if self.is_anonymous_view:
            report_links = ReportLinks.share_for_project(self.project)
            current_report_link = self.selector.get_share_link()
        else:
            user_menu = request.user.get_menu_dict()
            report_links = ReportLinks.public_for_project(self.project)
            current_report_link = self.selector.get_link()
            share_info = self.selector.get_share_info(self.base_url())

        project = self.project.to_jsonable()
        project["campaign_start"] = self.project.get_campaign_start()
        project["campaign_end"] = self.project.get_campaign_end()
        project["health"] = self.project.get_performance_rating()

        logger.info("ReportPageViewBase::get::bottom")

        return self.render(
            user=user_menu,
            report_links=report_links,
            current_report_link=current_report_link,
            project=project,
            report=self.selector.get_report_data(),
            share_info=share_info,
            members=self.project.get_members(),
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
    report_name = "campaign_plan"


class TAMExportView(FormView, SingleObjectMixin):
    template_name = "projects/tam-export.html"
    form_class = TAMExportForm
    model = Project

    def get_success_url(self):
        return reverse("admin:tam_export", kwargs={"pk": self.object.pk})

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
            messages.success(
                request,
                "TAM Export started. You will be emailed with the result shortly.",
            )
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
        value = payload.get("value", "")
        projects = Project.objects.get_all_for_user(request.user)
        groups_ids = []
        for p in projects:
            groups_ids.append(p.view_group_id)
            groups_ids.append(p.admin_group_id)
        users = User.objects.filter(
            Q(
                Q(email__icontains=value)
                | Q(person__first_name__icontains=value)
                | Q(person__last_name__icontains=value)
            )
            & Q(groups__in=groups_ids)
            & ~Q(id=request.user.id)
            & Q(is_staff=False)
        ).distinct()
        members = [user.get_icon_dict() for user in users]
        return JsonResponse({"members": members})


class AddMembersView(LoginRequiredMixin, APIView):
    def post(self, request):
        inviter_name = request.user.get_name()
        payload = self.get_data()
        members = payload.get("members", [])

        projects_ids = [p.get("property_id") for p in payload.get("projects", [])]
        projects = Project.objects.filter(public_id__in=projects_ids)

        if not request.user.is_superuser:
            for project in projects:
                if not project.is_admin(request.user):
                    return self.render_403()

        users = []
        for member in members:
            is_new = member.get("__isNew__", False)
            if is_new:
                email = member.get("value")
                user, _ = User.objects.get_or_create(email=email)
                user.invited = datetime.datetime.now(timezone.utc)
                user.save()
            else:
                public_id = member.get("value")
                user = User.objects.get(public_id=public_id)
            users.append(user)

        role = payload.get("role")

        projects_is_empty = any([not p.has_members() for p in projects])

        for project in projects:
            for user in users:
                if role == PROJECT_ROLES["admin"]:
                    project.admin_group.user_set.add(user)
                else:
                    project.view_group.user_set.add(user)
            project.save()

        for user in users:
            is_new_account = user.activated is None
            if projects_is_empty and is_new_account:
                send_create_account_email.apply_async(args=(user.id,), countdown=2)
            else:
                send_invite_email.apply_async(
                    args=(inviter_name, user.id, projects_ids), countdown=2
                )

        projects_list = [
            {"property_id": p.public_id, "members": p.get_members()} for p in projects
        ]
        return JsonResponse({"projects": projects_list})


class ProjectRemoveMemberIView(LoginRequiredMixin, APIView):
    def post(self, request, project_id):
        payload = self.get_data()
        member = payload.get("member", {})
        user_id = member.get("user_id")
        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=500)

        try:
            project = Project.objects.get(public_id=project_id)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=500)

        if project.is_admin(user):
            if project.admin_group.user_set.count() == 1:
                return JsonResponse(
                    {"error": "There should always be at least one admin for project"},
                    status=500,
                )
            project.admin_group.user_set.remove(user)
        else:
            project.view_group.user_set.remove(user)

        project.save()
        projects_dict = {
            "property_id": project.public_id,
            "members": project.get_members(),
        }
        return JsonResponse({"project": projects_dict})


class ChangeMemberRoleView(LoginRequiredMixin, APIView):
    def post(self, request, project_id, user_id):
        payload = self.get_data()
        role = payload.get("role")

        try:
            project = Project.objects.get(public_id=project_id)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=500)

        if not project.user_can_edit(request.user):
            return JsonResponse({"error": "Project not found"}, status=500)

        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=500)

        if role == USER_ROLES["admin"]:
            project.view_group.user_set.remove(user)
            project.admin_group.user_set.add(user)
        elif role == USER_ROLES["member"]:
            if project.admin_group.user_set.count() == 1:
                return JsonResponse(
                    {"error": "There should always be at least one admin for project"},
                    status=500,
                )
            project.admin_group.user_set.remove(user)
            project.view_group.user_set.add(user)

        project.save()
        return JsonResponse({"members": project.get_members()})
