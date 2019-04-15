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


class UpdateSpreadsheetAdminMixin:
    def update_spreadsheet(self, request, obj, form):
        """Add current user and imported data, if available and not yet present."""
        if not obj.id:
            obj.uploaded_by = obj.uploaded_by or request.user
            obj.imported_data = obj.imported_data or form.cleaned_data["imported_data"]


@admin.register(Spreadsheet, site=admin_site)
class SpreadsheetAdmin(UpdateSpreadsheetAdminMixin, admin.ModelAdmin):
    form = SpreadsheetForm
    list_display = ["project", "created", "uploaded_by", "kind", "subkind"]
    pre_creation_readonly_fields = []
    post_creation_readonly_fields = [
        "project",
        "created",
        "uploaded_by",
        "file",
        "kind",
        "subkind",
        "imported_data",
    ]

    def save_model(self, request, obj, form, change):
        self.update_spreadsheet(request, obj, form)
        super().save_model(request, obj, form, change)

    def get_readonly_fields(self, request, obj=None):
        """Allow for fields to be edited in admin only during creation time."""
        return (
            self.post_creation_readonly_fields
            if obj is not None
            else self.pre_creation_readonly_fields
        )


class NewSpreadsheetInline(admin.StackedInline):
    """
    Inline Admin for adding *new* spreadsheets to a project.
    """

    verbose_name = "New Spreadsheet"
    verbose_name_plural = "New Spreadsheets"

    model = Spreadsheet
    form = SpreadsheetForm
    extra = 0
    list_display = ["created", "kind", "file"]
    readonly_fields = ["save_button"]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.none()

    def has_add_permission(self, request, obj):
        return True

    def has_change_permission(self, request, obj):
        return True

    def has_delete_permission(self, request, obj):
        return False

    @mark_safe
    def save_button(self, obj):
        return '<input type="submit" value="Save" name="_continue">'

    save_button.short_description = ""


class ExistingSpreadsheetInline(admin.TabularInline):
    """
    Inline Admin for displaying read-only *existing* spreadsheet records.

    This works around a particularly gnarly design/arch issue in the Django
    admin, as documented here: https://code.djangoproject.com/ticket/15602
    """

    verbose_name = "Existing Spreadsheet"
    verbose_name_plural = "Existing Spreadsheets"

    model = Spreadsheet
    fields = [
        "is_active",
        "created",
        "uploaded_by",
        "kind",
        "subkind",
        "file",
        "has_imported_data",
    ]
    readonly_fields = [
        "is_active",
        "created",
        "uploaded_by",
        "kind",
        "subkind",
        "file",
        "has_imported_data",
    ]
    show_change_link = True
    extra = 1
    max_num = 0

    def has_imported_data(self, obj):
        return bool(obj.imported_data)

    has_imported_data.boolean = True

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False

    def is_active(self, obj):
        return obj.is_latest_for_kind()

    is_active.boolean = True


@admin.register(Period, site=admin_site)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


class PeriodInline(admin.TabularInline):
    model = Period
    fields = PERIOD_FIELD_NAMES_TARGETS_LAST
    readonly_fields = PERIOD_FIELD_NAMES_TARGETS_LAST
    show_change_link = True

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(Project, site=admin_site)
class ProjectAdmin(UpdateSpreadsheetAdminMixin, admin.ModelAdmin):
    save_on_top = True
    inlines = (NewSpreadsheetInline, ExistingSpreadsheetInline, PeriodInline)
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

    def save_formset(self, request, form, formset, change):
        # Force
        if formset.model == Spreadsheet:
            for formset_form in formset:
                obj = formset_form.instance
                self.update_spreadsheet(request, obj, formset_form)
        super().save_formset(request, form, formset, change=change)
