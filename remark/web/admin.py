import csv

from django.contrib import admin, messages
from django.shortcuts import render
from django.urls import path

from remark.admin import admin_site
from remark.lib.logging import error_text, getLogger
from .models import Localization, LocalizationVersion
from .forms import LocalizationAdminForm, LocalizationVersionAdminForm, CsvImportForm

logger = getLogger(__name__)


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
        if request.method == "GET":
            form = CsvImportForm()
            payload = {"form": form}
            return render(
                request, "localization/csv_form.html", payload
            )

        if request.method == "POST":
            logger.info("LocalizationAdmin::import_csv::top")
            try:
                csv_file = request.FILES["csv_file"]
                file_data = csv_file.read().decode("utf-8")
                lines = file_data.split("\n")
                line_count = 0
                localization_objects = []
                for line in lines:
                    line_count += 1
                    if line_count == 1:
                        logger.info(f"Column header: {line}")
                    else:
                        fields = line.split(",")
                        if len(fields) > 1:
                            localization_objects.append(Localization(key=fields[0], en_us=fields[1]))
                logger.info(f"Processed {len(localization_objects)} rows.")
                Localization.objects.bulk_create(localization_objects)
                self.message_user(request, "Your csv file has been imported")
            except Exception as e:
                logger.error(error_text(e))
                self.message_user(request, e, messages.ERROR)
            logger.info("LocalizationAdmin::import_csv::bottom")
            return render(
                request, "localization/csv_form.html"
            )


@admin.register(LocalizationVersion, site=admin_site)
class LocalizationVersionAdmin(admin.ModelAdmin):
    form = LocalizationVersionAdminForm
    list_display = ["language", "version"]
