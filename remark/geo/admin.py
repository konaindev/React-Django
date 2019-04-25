from django.contrib import admin

from remark.admin import admin_site
from .models import Address, Country, State, City


@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    readonly_fields = ("geocode_json",)


@admin.register(Country, site=admin_site)
class CountryAdmin(admin.ModelAdmin):
    list_display = ("code", "name")
    ordering = ("pk",)
    search_fields = ("name",)


@admin.register(State, site=admin_site)
class StateAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "country")
    ordering = ("pk",)
    search_fields = ("name",)


@admin.register(City, site=admin_site)
class CityAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "country")
    ordering = ("pk",)
    search_fields = ("name",)
