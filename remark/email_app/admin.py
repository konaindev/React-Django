from django.contrib import admin
from .models import PerformanceEmail, PerformanceEmailKPI
from remark.admin import admin_site
from .reports.weekly_performance import send_performance_email
import datetime
from remark.lib.logging import error_text

class PerformanceEmailKPIInline(admin.TabularInline):
    model = PerformanceEmailKPI

from django.db import transaction

@admin.register(PerformanceEmail, site=admin_site)
class PerformanceEmailAdmin(admin.ModelAdmin):
    inlines = [
        PerformanceEmailKPIInline
    ]
    fields = [
        "project",
        "start",
        "campaign_health",
        "lease_rate_text",
        "top_performing_kpi",
        "top_performing_insight",
        "low_performing_kpi",
        "low_performing_insight",
        "risk_kpi_text",
        "low_kpi_text",
    ]
    list_display = ["project", "start", "created_by"]

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
            print("email_app::admin::PerformanceEmailAdmin::save_model::after async task")
        except Exception as e:
            print(error_text(e))

        print("email_app::admin::PerformanceEmailAdmin::save_model::bottom")
