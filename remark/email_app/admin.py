from django.contrib import admin
from .models import PerformanceEmail, PerformanceEmailKPI

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
        "send_datetime",
        "lease_rate_text",
        "top_performing_kpi",
        "top_performing_insight",
        "low_performing_kpi",
        "low_performing_insight"
    ]

    #@transaction.atomic
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        obj.end = obj.start + datetime.timedelta(days=7)
        success = send_performance_email(obj)
        super().save_model(request, obj, form, change)
        #if success:
        #    obj.campaign_id = campaign_id
        #    obj.save()
        #else:
        #    raise Exception("Email could not be sent!")
