from django.contrib import admin
from remark.admin import admin_site

from remark.lib.logging import error_text, getLogger

from .models import Insight

from adminsortable2.admin import SortableAdminMixin

logger = getLogger(__name__)

@admin.register(Insight, site=admin_site)
class InsightAdmin(SortableAdminMixin, admin.ModelAdmin):
    list_display = ["name", "include_in_email"]
