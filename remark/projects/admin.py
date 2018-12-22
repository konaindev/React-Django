from django.contrib import admin

from remark.admin import admin_site

from .models import Project, Period


@admin.register(Period, site=admin_site)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


class PeriodInline(admin.StackedInline):
    model = Period
    extra = 0
    # TODO consider providing a better default ordering here.
    # TODO consider providing nicer values for calculated percents, and accepting nicer values for inputs
    # TODO consider providing nicer values with dollar signs for, well, dollar amounts
    readonly_fields = [
        "net_new_leases",
        "leased_units",
        "target_leased_units",
        "lease_rate",
        "usvs_to_inquiries_percent",
        "inquiries_to_tours_percent",
        "tours_to_lease_applications_percent",
        "lease_applications_to_lease_executions_percent",
        "marketing_investment",
        "estimated_monthly_revenue_change",
        "estimated_annual_revenue_change",
        "return_on_marketing_investment",
        "cost_per_usv",
        "cost_per_inquiry",
        "cost_per_tour",
        "cost_per_lease_application",
        "cost_per_lease_execution",
    ]


@admin.register(Project, site=admin_site)
class ProjectAdmin(admin.ModelAdmin):
    inlines = (PeriodInline,)
    list_display = ["name", "public_id", "number_of_periods"]

    def number_of_periods(self, obj):
        return obj.periods.all().count()
