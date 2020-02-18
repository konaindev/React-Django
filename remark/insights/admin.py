from django.contrib import admin

from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

from remark.admin import admin_site
from remark.lib.logging import error_text, getLogger
from remark.insights.models import Insight, SuggestedAction, SuggestedActionTactic, KPI

logger = getLogger(__name__)

@admin.register(Insight, site=admin_site)
class InsightAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ["name", "include_in_email"]


# class SuggestedActionTacticTableInline(SortableInlineAdminMixin, admin.TabularInline):
class SuggestedActionTacticTableInline(admin.TabularInline):
    verbose_name = "Suggested Action Tactic"

    model = SuggestedActionTactic
    # fields = [ "name" ]
    # readonly_fields = [ ]
    show_change_link = True
    extra = 0
    max_num = 0
    # ordering = ["sort_order"]


@admin.register(SuggestedAction, site=admin_site)
class SuggestedActionAdmin(admin.ModelAdmin):
    list_display = ["title", "description"]
    # inlines = (SuggestedActionTacticTableInline,)


@admin.register(SuggestedActionTactic, site=admin_site)
class SuggestedActionTacticAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(KPI, site=admin_site)
class KPIAdmin(admin.ModelAdmin):
    list_display = ["name", "definition"]
    readonly_fields = ["name"]
