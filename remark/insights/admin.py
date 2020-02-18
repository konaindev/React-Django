from django.contrib import admin
from remark.admin import admin_site

from remark.lib.logging import error_text, getLogger

from .models import Insight, SuggestedAction, SuggestedActionTactic, KPI

from adminsortable2.admin import SortableAdminMixin

logger = getLogger(__name__)

@admin.register(Insight, site=admin_site)
class InsightAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ["name", "include_in_email"]


@admin.register(SuggestedAction, site=admin_site)
class SuggestedActionAdmin(admin.ModelAdmin):
    list_display = ["title", "description"]


@admin.register(SuggestedActionTactic, site=admin_site)
class SuggestedActionTacticAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]


@admin.register(KPI, site=admin_site)
class KPIAdmin(admin.ModelAdmin):
    list_display = ["name", "definition"]
    readonly_fields = ["name"]
