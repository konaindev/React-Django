from django.contrib import admin
from django.contrib.admin.utils import unquote
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.safestring import mark_safe

from adminsortable2.admin import SortableInlineAdminMixin

from remark.admin import admin_site, custom_titled_filter
from remark.analytics.admin import InlineAnalyticsProviderAdmin
from .forms import ProjectForm, SpreadsheetForm, CampaignModelUploadForm
from .models import (
    Fund,
    Project,
    Campaign,
    CampaignModel,
    Period,
    Spreadsheet,
    Spreadsheet2,
    TargetPeriod,
    TAMExportLog,
    Tag,
)
from .views import TAMExportView


class UpdateSpreadsheetAdminMixin:
    def update_spreadsheet(self, request, obj, form):
        """Add current user and imported data, if available and not yet present."""
        if not obj.id:
            obj.uploaded_by = obj.uploaded_by or request.user
            obj.imported_data = (
                getattr(obj, "imported_data", None)
                or form.cleaned_data["imported_data"]
            )


@admin.register(Spreadsheet, site=admin_site)
class SpreadsheetAdmin(UpdateSpreadsheetAdminMixin, admin.ModelAdmin):
    form = SpreadsheetForm
    list_display = ["project", "created", "uploaded_by", "kind"]
    pre_creation_readonly_fields = []
    post_creation_readonly_fields = [
        "project",
        "created",
        "uploaded_by",
        "file",
        "kind",
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
        "file",
        "has_imported_data",
    ]
    readonly_fields = [
        "is_active",
        "created",
        "uploaded_by",
        "kind",
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


@admin.register(Spreadsheet2, site=admin_site)
class Spreadsheet2Admin(admin.ModelAdmin):
    list_display = ["file_url"]
    readonly_fields = ["kind", "file_url"]


@admin.register(CampaignModel, site=admin_site)
class CampaignModelAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "project_link",
        "campaign_link",
        "is_selected",
        "active",
        "model_index",
        "model_start",
        "model_end",
    ]
    list_filter = (("campaign__project__name", custom_titled_filter("Project")),)
    ordering = ["campaign__project__name"]
    fields = [
        "project_link",
        "campaign_link",
        "name",
        "model_start",
        "model_end",
        "model_index",
        "active",
        "selected",
        "spreadsheet_link",
        "json_data",
    ]
    readonly_fields = [
        "project_link",
        "campaign_link",
        "selected",
        "spreadsheet_link",
        "json_data",
    ]

    def has_add_permission(self, request):
        return False

    def project_link(self, obj):
        return mark_safe(
            '<a href="{}" target="_blank">{}</a>'.format(
                reverse("admin:projects_project_change", args=(obj.project.pk,)),
                obj.project.name,
            )
        )
    project_link.short_description = "Project"

    def campaign_link(self, obj):
        return mark_safe(
            '<a href="{}" target="_blank">{}</a>'.format(
                reverse("admin:projects_campaign_change", args=(obj.campaign.pk,)),
                obj.campaign.name,
            )
        )
    campaign_link.short_description = "Campaign"

    def spreadsheet_link(self, obj):
        return mark_safe(
            '<a href="{}" target="_blank">{}</a>'.format(
                reverse(
                    "admin:projects_spreadsheet2_change", args=(obj.spreadsheet.pk,)
                ),
                obj.spreadsheet.pk,
            )
        )
    spreadsheet_link.short_description = "Spreadsheet"

    def is_selected(self, obj):
        return bool(obj.selected)
    is_selected.boolean = True


class CampaignModelUploadInline(admin.StackedInline):
    """
    Inline Admin for adding *new* campaign model to a campaign.
    """

    verbose_name = "campaign model"
    verbose_name_plural = "New Campaign Model"
    model = CampaignModel
    form = CampaignModelUploadForm
    extra = 0
    max_num = 1
    readonly_fields = ["upload_button"]

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.none()

    @mark_safe
    def upload_button(self, obj):
        return '<input type="submit" value="Upload" name="_continue">'

    upload_button.short_description = ""


class CampaignModelTableInline(SortableInlineAdminMixin, admin.TabularInline):
    verbose_name = "Campaign Model"
    verbose_name_plural = "Campaign Models"

    model = CampaignModel
    fields = [
        "name",
        "is_selected",
        "active",
        "model_index",
        "model_start",
        "model_end",
    ]
    readonly_fields = ["is_selected"]
    show_change_link = True
    extra = 0
    max_num = 0
    ordering = ["model_index"]

    def is_selected(self, obj):
        return bool(obj.selected)

    is_selected.boolean = True


class UploadCampaignModelAdminMixin:
    def fill_spreadsheet_data(self, request, obj, form):
        # check if it's new campaign model formset
        # i.e. from CampaignModelUploadInline, not CampaignModelTableInline
        spreadsheet = form.cleaned_data.get("spreadsheet", None)
        if spreadsheet is not None:
            obj.name = form.cleaned_data["name"]
            obj.spreadsheet = form.cleaned_data["spreadsheet"]
            obj.model_start = form.cleaned_data["model_start"]
            obj.model_end = form.cleaned_data["model_end"]


@admin.register(Campaign, site=admin_site)
class CampaignAdmin(UploadCampaignModelAdminMixin, admin.ModelAdmin):
    list_display = ["name", "project_link", "selected_campaign_model"]
    list_filter = (("project__name", custom_titled_filter("Project")),)
    fields = ["name", "project", "selected_campaign_model"]
    readonly_fields_on_create = ("selected_campaign_model",)
    readonly_fields_on_update = ("project",)
    inlines = (CampaignModelUploadInline, CampaignModelTableInline)
    ordering = ["project__name"]

    def project_link(self, obj):
        return mark_safe(
            '<a href="{}" target="_blank">{}</a>'.format(
                reverse("admin:projects_project_change", args=(obj.project.pk,)),
                obj.project.name,
            )
        )

    project_link.short_description = "Project"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "selected_campaign_model":
            object_id = unquote(request.resolver_match.kwargs["object_id"])
            kwargs["queryset"] = CampaignModel.objects.filter(
                campaign__pk=object_id
            ).order_by("model_index")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def get_readonly_fields(self, request, obj=None):
        return (
            self.readonly_fields_on_update
            if obj is not None
            else self.readonly_fields_on_create
        )

    # hide new campaign form on create view
    def get_inline_instances(self, request, obj=None):
        if obj is None:
            return ()
        else:
            return [inline(self.model, self.admin_site) for inline in self.inlines]

    def save_formset(self, request, form, formset, change):
        if formset.model == CampaignModel:
            for formset_form in formset:
                obj = formset_form.instance
                self.fill_spreadsheet_data(request, obj, formset_form)
        super().save_formset(request, form, formset, change=change)


class CampaignInline(admin.TabularInline):
    model = Campaign
    list_display = ["name", "selected_campaign_model"]
    readonly_fields = ["selected_campaign_model"]
    show_change_link = True
    extra = 0
    ordering = ["name"]


@admin.register(Period, site=admin_site)
class PeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


class PeriodInline(admin.TabularInline):
    model = Period
    show_change_link = True

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


@admin.register(TargetPeriod, site=admin_site)
class TargetPeriodAdmin(admin.ModelAdmin):
    list_display = ["project", "start", "end"]


class TargetPeriodInline(admin.TabularInline):
    model = TargetPeriod
    show_change_link = True

    def has_add_permission(self, request, obj):
        return False

    def has_change_permission(self, request, obj):
        return False

    def has_delete_permission(self, request, obj):
        return False


class TAMExportMixin:
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                "<pk>/tam-export/",
                self.admin_site.admin_view(TAMExportView.as_view()),
                name="tam_export",
            )
        ]
        return my_urls + urls


@admin.register(Project, site=admin_site)
class ProjectAdmin(UpdateSpreadsheetAdminMixin, TAMExportMixin, admin.ModelAdmin):
    save_on_top = True
    inlines = (
        CampaignInline,
        NewSpreadsheetInline,
        ExistingSpreadsheetInline,
        PeriodInline,
        TargetPeriodInline,
        InlineAnalyticsProviderAdmin,
    )
    list_display = [
        "name",
        "public_id",
        "customer_name",
        "number_of_periods",
        "baseline_start",
        "baseline_end",
        "average_tenant_age",
        "highest_monthly_rent",
        "average_monthly_rent",
        "lowest_monthly_rent",
    ]

    fields = [
        "name",
        "account",
        "asset_manager",
        "property_manager",
        "property_owner",
        "fund",
        "customer_name",
        "custom_tags",
        "email_distribution_list",
        "building_logo",
        "building_image",
        "baseline_start",
        "baseline_end",
        "tmp_market_report_json",
        "tmp_campaign_plan_json",
        "total_units",
        "average_tenant_age",
        "highest_monthly_rent",
        "average_monthly_rent",
        "lowest_monthly_rent",
        "is_baseline_report_public",
        "is_tam_public",
        "is_performance_report_public",
        "is_modeling_public",
        "is_campaign_plan_public",
        "is_baseline_report_shared",
        "is_tam_shared",
        "is_performance_report_shared",
        "is_modeling_shared",
        "is_campaign_plan_shared",
        "competitors",
        "address",
        "users",
        "view_group",
    ]

    readonly_fields = ["customer_name"]

    form = ProjectForm

    def number_of_periods(self, obj):
        return obj.periods.all().count()

    def save_formset(self, request, form, formset, change):
        # Force spreadsheet updating
        if formset.model == Spreadsheet:
            for formset_form in formset:
                obj = formset_form.instance
                self.update_spreadsheet(request, obj, formset_form)
        super().save_formset(request, form, formset, change=change)

    class Media:
        js = ("js/project_admin.js",)


@admin.register(Tag, site=admin_site)
class TagAdmin(admin.ModelAdmin):
    pass

@admin.register(TAMExportLog, site=admin_site)
class TAMExportLogAdmin(admin.ModelAdmin):
    pass


@admin.register(Fund, site=admin_site)
class FundAdmin(admin.ModelAdmin):
    pass
