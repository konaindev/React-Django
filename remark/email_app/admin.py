import datetime

from django.contrib import admin

from remark.admin import admin_site, custom_titled_filter
from remark.lib.logging import error_text, getLogger
from remark.projects.models import Project
from .models import PerformanceEmail, PerformanceEmailKPI, ListservEmail
from .forms import PerformanceEmailForm
from .reports.weekly_performance import send_performance_email, create_sender_for_listserv

logger = getLogger(__name__)


class PerformanceEmailKPIInline(admin.TabularInline):
    model = PerformanceEmailKPI


@admin.register(PerformanceEmail, site=admin_site)
class PerformanceEmailAdmin(admin.ModelAdmin):
    inlines = [PerformanceEmailKPIInline]
    fields = [
        "project",
        "custom_reply_to_field",
        "start",
        "campaign_health",
        "lease_rate_text",
        "top_performing_kpi",
        "top_performing_insight",
        "low_performing_kpi",
        "low_performing_insight",
        "risk_kpi_insight_text",
        "low_kpi_insight_text",
    ]
    readonly_fields = ["custom_reply_to_field"]
    list_display = ("project", "start", "created_by")
    list_filter = (("project__name", custom_titled_filter("Project")),)
    ordering = ("-start",)

    form = PerformanceEmailForm

    def custom_reply_to_field(self, obj):
        return obj.project.listserv_email

    custom_reply_to_field.short_description = "Reply-To"

    def save_model(self, request, obj, form, change):
        print("email_app::admin::PerformanceEmailAdmin::save_model::top")

        try:
            if not change:
                obj.created_by = request.user
            obj.end = obj.start + datetime.timedelta(days=7)
            print("email_app::admin::PerformanceEmailAdmin::save_model::before save")
            super().save_model(request, obj, form, change)
            print("email_app::admin::PerformanceEmailAdmin::save_model::after save")
            send_performance_email.apply_async(args=(obj.id,), countdown=2)
            print(
                "email_app::admin::PerformanceEmailAdmin::save_model::after async task"
            )
        except Exception as e:
            print(error_text(e))

        print("email_app::admin::PerformanceEmailAdmin::save_model::bottom")


class ProjectInline(admin.TabularInline):
    model = Project

    fields = ["name", "public_id"]
    extra = 0
    max_num = 0
    readonly_fields = ["name", "public_id"]
    can_delete = False


@admin.register(ListservEmail, site=admin_site)
class ListservEmailAdmin(admin.ModelAdmin):
    inlines = [ProjectInline]
    list_display = ["email", "sender_id"]

    def get_formsets_with_inlines(self, request, obj=None):
        for inline in self.get_inline_instances(request, obj):
            # hide ProjectInline in the add view
            if not isinstance(inline, ProjectInline) or obj is not None:
                yield inline.get_formset(request, obj), inline

    def get_fields(self, request, obj=None):
        return ("email", "sender_id") if obj is not None else ("email",)

    def save_model(self, request, obj, form, change):
        logger.info("ListservEmail::save_model::top")
        try:
            super().save_model(request, obj, form, change)
            logger.info("ListservEmail::save_model::after save")
            if not change:
                logger.info("ListservEmail::save_model::before sender creation")
                create_sender_for_listserv.apply_async(args=(obj.id,), countdown=2)
                logger.info("ListservEmail::save_model::after sender creation")
        except Exception as e:
            logger.error(error_text(e))

        logger.info("ListservEmail::save_model::bottom")
