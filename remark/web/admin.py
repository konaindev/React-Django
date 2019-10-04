from django.contrib import admin

from remark.admin import admin_site
from .models import Localization, LocalizationVersion
from .forms import LocalizationAdminForm, LocalizationVersionAdminForm


@admin.register(Localization, site=admin_site)
class LocalizationAdmin(admin.ModelAdmin):
    form = LocalizationAdminForm
    list_display = ["key", "en_us"]


@admin.register(LocalizationVersion, site=admin_site)
class LocalizationAdmin(admin.ModelAdmin):
    form = LocalizationVersionAdminForm
    list_display = ["language", "version"]
