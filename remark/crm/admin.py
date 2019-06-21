from django.contrib import admin

from remark.admin import admin_site
from .models import Business, Office, Person


@admin.register(Business, site=admin_site)
class BusinessAdmin(admin.ModelAdmin):
    pass

@admin.register(Office, site=admin_site)
class OfficeAdmin(admin.ModelAdmin):
    pass

@admin.register(Person, site=admin_site)
class PersonAdmin(admin.ModelAdmin):
    pass
