from django.contrib import admin

from remark.admin import admin_site

from .models import Project, Period


@admin.register(Period, site=admin_site)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


@admin.register(Project, site=admin_site)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "public_id",
        "number_of_periods",
        "baseline_start",
        "baseline_end",
    ]

    def number_of_periods(self, obj):
        return obj.periods.all().count()
