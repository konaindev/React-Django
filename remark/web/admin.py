import csv

from django.contrib import admin
from django.shortcuts import render
from django.urls import path

from remark.admin import admin_site
from .models import Localization, LocalizationVersion
from .forms import LocalizationAdminForm, LocalizationVersionAdminForm, CsvImportForm


@admin.register(Localization, site=admin_site)
class LocalizationAdmin(admin.ModelAdmin):
    form = LocalizationAdminForm
    list_display = ["key", "en_us"]
    change_list_template = "localization/changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),
        ]
        return my_urls + urls

    def import_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_file"]
            self.message_user(request, "Your csv file has been imported")
        form = CsvImportForm()
        payload = {"form": form}
        return render(
            request, "localization/csv_form.html", payload
        )


@admin.register(LocalizationVersion, site=admin_site)
class LocalizationVersionAdmin(admin.ModelAdmin):
    form = LocalizationVersionAdminForm
    list_display = ["language", "version"]
