from django.contrib import admin

from remark.admin import admin_site
from .models import Business


@admin.register(Business, site=admin_site)
class BusinessAdmin(admin.ModelAdmin):
    pass
