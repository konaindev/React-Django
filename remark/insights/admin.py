from django.contrib import admin

from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin

from remark.admin import admin_site
from remark.lib.logging import error_text, getLogger
from remark.insights.models import Insight, SuggestedAction, SuggestedActionTactic, KPI

logger = getLogger(__name__)

@admin.register(Insight, site=admin_site)
class InsightAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ["name", "include_in_email"]


class TacticTablularInline(SortableInlineAdminMixin, admin.TabularInline):
    MAX_TACTICS_COUNT = 8

    model = SuggestedAction.tactics.through
    verbose_name = "Tactic"
    verbose_name_plural = "Tactics"

    show_change_link = True
    extra = 1
    max_num = MAX_TACTICS_COUNT


@admin.register(SuggestedAction, site=admin_site)
class SuggestedActionAdmin(admin.ModelAdmin):
    list_display = ["title", "description"]
    inlines = (TacticTablularInline,)


@admin.register(SuggestedActionTactic, site=admin_site)
class SuggestedActionTacticAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(KPI, site=admin_site)
class KPIAdmin(admin.ModelAdmin):
    list_display = ["name", "definition"]
    readonly_fields = ["name"]
