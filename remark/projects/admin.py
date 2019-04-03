from django.contrib import admin
from django.utils.safestring import mark_safe

from remark.admin import admin_site

from .forms import SpreadsheetForm
from .models import Project, Period, Spreadsheet


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


@admin.register(Spreadsheet, site=admin_site)
class SpreadsheetAdmin(admin.ModelAdmin):
    form = SpreadsheetForm
    list_display = ["project", "created", "user", "kind", "subkind"]
    pre_creation_readonly_fields = []
    post_creation_readonly_fields = [
        "project",
        "created",
        "user",
        "file",
        "kind",
        "subkind",
        "imported_data",
    ]

    def get_readonly_fields(self, request, obj=None):
        """Allow for fields to be edited in admin only during creation time."""
        return (
            self.post_creation_readonly_fields
            if obj is not None
            else self.pre_creation_readonly_fields
        )

    def save_model(self, request, obj, form, change):
        if obj.user is None:
            obj.user = request.user
        if not obj.imported_data:
            obj.imported_data = form.cleaned_data["imported_data"]
        super().save_model(request, obj, form, change)


class SpreadsheetInline(admin.StackedInline):
    model = Spreadsheet
    form = SpreadsheetForm
    extra = 1
    list_display = ["created", "kind", "subkind", "file"]
    pre_creation_readonly_fields = ["save_button"]
    post_creation_readonly_fields = [
        "project",
        "created",
        "user",
        "file",
        "kind",
        "subkind",
        "imported_data",
        "save_button",
    ]

    def has_add_permission(self, request, obj):
        return True

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False

    def get_readonly_fields(self, request, obj=None):
        """Allow for fields to be edited in admin only during creation time."""
        print(obj)
        return (
            self.post_creation_readonly_fields
            if obj is not None
            else self.pre_creation_readonly_fields
        )

    @mark_safe
    def save_button(self, obj):
        return '<input type="submit" value="Save" name="_continue">'

    save_button.short_description = ""


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
    # TODO add SpreadsheetInline
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
