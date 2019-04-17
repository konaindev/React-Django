from django.contrib import admin

from remark.admin import admin_site

from .forms import LocationForm, AddressForm
from .models import Address, Country, State, City, ZipcodePolygon


@admin.register(Address, site=admin_site)
class AddressAdmin(admin.ModelAdmin):
    ADDRESS_FIELDS = [
        "formatted_address",
        "street_address_1",
        "street_address_2",
        "city",
        "state",
        "zip_code",
        "country",
        "geocode_json",
    ]

    LOCATION_FIELD = ["location"]

    def get_form(self, request, obj=None, **kwargs):
        kwargs["form"] = LocationForm if obj is None else AddressForm
        return super().get_form(request, obj, **kwargs)

    def get_fields(self, request, obj=None):
        return self.LOCATION_FIELD if obj is None else self.ADDRESS_FIELDS

    def get_readonly_fields(self, request, obj=None):
        return [] if obj is None else self.ADDRESS_FIELDS


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

@admin.register(ZipcodePolygon, site=admin_site)
class ZipcodePolygonsAdmin(admin.ModelAdmin):
    model = ZipcodePolygon
