from django.contrib import admin  # noqa

from remark.admin import admin_site
from .models import AnalyticsProvider


@admin.register(AnalyticsProvider, site=admin_site)
class AnalyticsProviderAdmin(admin.ModelAdmin):
    pass


class InlineAnalyticsProviderAdmin(admin.TabularInline):
    """
    Inline Admin for displaying read-only *existing* analytics provider records.

    This works around a particularly gnarly design/arch issue in the Django
    admin, as documented here: https://code.djangoproject.com/ticket/15602
    """
    model = AnalyticsProvider

