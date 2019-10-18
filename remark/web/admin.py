import csv

from django.contrib import admin, messages
from django.shortcuts import render
from django.urls import path, reverse
from django.views.generic.edit import FormView

from remark.admin import admin_site
from remark.lib.logging import error_text, getLogger
from .models import Localization, LocalizationVersion
from .forms import LocalizationAdminForm, LocalizationVersionAdminForm, CsvImportForm

logger = getLogger(__name__)


@admin.register(LocalizationVersion, site=admin_site)
class LocalizationVersionAdmin(admin.ModelAdmin):
    form = LocalizationVersionAdminForm
    list_display = ["language", "version"]


@admin.register(Localization, site=admin_site)
class LocalizationAdmin(admin.ModelAdmin):
    form = LocalizationAdminForm
    list_display = ["key", "en_us"]
    change_list_template = "localization/changelist.html"

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path(
                "csv-import/",
                self.admin_site.admin_view(CsvImportFormView.as_view()),
                name="web_localization_csv_import",
            )
        ]
        return my_urls + urls


class PageMixin(object):
    def get_context_data(self, **kwargs):
        context = super(PageMixin, self).get_context_data(**kwargs)
        context["site_header"] = admin.site.site_header
        return context


class CsvImportFormView(FormView):
    template_name = "localization/csv_form.html"
    form_class = CsvImportForm

    def get_success_url(self):
        return reverse("admin:web_localization_changelist")

    def post(self, request, *args, **kwargs):
        form = self.get_form()

        if form.is_valid():
            csv_file = form.cleaned_data["csv_file"]
            logger.info("LocalizationAdmin::csv_import::top")
            try:
                file_data = csv_file.read().decode("utf-8")
                lines = file_data.split("\n")
                line_count = 0
                localization_objects = []
                for line in lines:
                    fields = line.split(",")
                    line_count += 1
                    if line_count == 1:
                        logger.info(f"LocalizationAdmin::csv_import::header {line}")
                    elif len(fields) > 1:
                        localization_objects.append(
                            Localization(key=fields[0], en_us=fields[1])
                        )
                Localization.objects.bulk_create(localization_objects)
                messages.success(
                    request, f"Imported {len(localization_objects)} rows successfully."
                )
                logger.info("LocalizationAdmin::csv_import::bottom")
                return self.form_valid(form)
            except Exception as e:
                logger.error(error_text(e))
                messages.error(request, e)
                return self.form_invalid(form)
        else:
            return self.form_invalid(form)
