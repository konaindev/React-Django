from django.contrib import admin

from remark.admin import admin_site
from .models import Address


@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    readonly_fields = ["geo_code_json",]
