import datetime

from django.contrib import admin

from remark.admin import admin_site, custom_titled_filter
from remark.lib.logging import error_text, getLogger
from .forms import PerformanceEmailForm
from .models import PerformanceEmail, PerformanceEmailKPI
from .reports.weekly_performance import send_performance_email

logger = getLogger(__name__)


class PerformanceEmailKPIInline(admin.TabularInline):
    model = PerformanceEmailKPI


@admin.register(PerformanceEmail, site=admin_site)
class PerformanceEmailAdmin(admin.ModelAdmin):
    inlines = [PerformanceEmailKPIInline]
    fields = [
        "project",
        "start",
        "campaign_health",
        "email_campaign_id",
        "top_macro_insight_1",
        "top_macro_insight_2",
        "top_macro_insight_3",
        "top_performing_kpi",
        "top_performing_insight",
        "low_performing_kpi",
        "low_performing_insight",
        "risk_kpi_insight_text",
        "low_kpi_insight_text",
    ]
    list_display = ("project", "start", "created_by")
    list_filter = (("project__name", custom_titled_filter("Project")),)
    ordering = ("-start",)

    form = PerformanceEmailForm

    def save_model(self, request, obj, form, change):
        logger.info("PerformanceEmailAdmin::save_model::top")

        try:
            if not change:
                obj.created_by = request.user
            obj.end = obj.start + datetime.timedelta(days=7)
            logger.info("PerformanceEmailAdmin::save_model::before save")
            super().save_model(request, obj, form, change)
            logger.info("PerformanceEmailAdmin::save_model::after save")
            send_performance_email.apply_async(args=(obj.id,), countdown=2)
            logger.info("PerformanceEmailAdmin::save_model::after async task")
        except Exception as e:
            logger.error(error_text(e))

        logger.info("PerformanceEmailAdmin::save_model:bottom")
