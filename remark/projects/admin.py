from django.contrib import admin

from remark.admin import admin_site

from .models import Project, Period


def _build_period_field_names_with_targets_last():
    """
    Build a list of period field names. Keep the order they appear in our
    Model object, except for target fields, which get moved to last.
    """
    names = [field.name for field in Period._meta.get_fields()]
    nontarget_names = [name for name in names if not name.startswith("target_")]
    target_names = [name for name in names if name.startswith("target_")]
    return nontarget_names + target_names


PERIOD_FIELD_NAMES_TARGETS_LAST = _build_period_field_names_with_targets_last()


@admin.register(Period, site=admin_site)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


class PeriodInline(admin.TabularInline):
    model = Period
    fields = PERIOD_FIELD_NAMES_TARGETS_LAST
    readonly_fields = PERIOD_FIELD_NAMES_TARGETS_LAST

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(Project, site=admin_site)
class ProjectAdmin(admin.ModelAdmin):
    save_on_top = True
    inlines = (PeriodInline,)
    list_display = [
        "name",
        "public_id",
        "number_of_periods",
        "baseline_start",
        "baseline_end",
        "average_tenant_age",
        "highest_monthly_rent",
        "average_monthly_rent",
        "lowest_monthly_rent",
    ]

    def number_of_periods(self, obj):
        return obj.periods.all().count()
