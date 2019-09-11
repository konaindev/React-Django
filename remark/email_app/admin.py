import datetime

from django.contrib import admin

from remark.admin import admin_site, custom_titled_filter
from remark.lib.logging import error_text
from remark.projects.models import Project
from .models import PerformanceEmail, PerformanceEmailKPI, ListservEmail
from .forms import PerformanceEmailForm
from .reports.weekly_performance import send_performance_email


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

    def get_readonly_fields(self, request, obj=None):
        # Email address should be read-only in edit mode
        return ("email",) if obj is not None else ()
