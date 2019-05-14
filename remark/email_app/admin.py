from django.contrib import admin
from .models import PerformanceEmail, PerformanceEmailKPI
from remark.admin import admin_site
from .reports.weekly_performance import send_performance_email
import datetime

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
        "lease_rate_text",
        "top_performing_kpi",
        "top_performing_insight",
        "low_performing_kpi",
        "low_performing_insight"
    ]

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.end = obj.start + datetime.timedelta(days=7)
        super().save_model(request, obj, form, change)
        send_performance_email.apply_async(args=(obj.id,), countdown=2)
