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


class CsvImportFormView(FormView):
    template_name = "localization/csv_form.html"
    form_class = CsvImportForm

    def get_success_url(self):
        return reverse("admin:web_localization_changelist")

    def get_context_data(self, **kwargs):    
        context = {
            **admin_site.each_context(self.request),
            **super().get_context_data(**kwargs),
            "opts": Localization._meta,
            "has_view_permission": True,
        }
        return context

    def get_configured_languages(self):
        languages = LocalizationVersion.objects.all().values_list("language", flat=True)
        return languages

    def post(self, request, *args, **kwargs):
        form = self.get_form()

        if form.is_valid():
            logger.info("LocalizationAdmin::csv_import::top")

            csv_file = form.cleaned_data["csv_file"]
            allow_override = form.cleaned_data["allow_override"]
            languages = self.get_configured_languages()

            """
            @TODO: better to use pandas or at least create a utility function to parse csv file
            """
            try:
                file_data = csv_file.read().decode("utf-8-sig")
                rows = file_data.split("\r\n")
                column_indexes = dict() # index by column name
                created_rows = 0
                updated_rows = 0
                skipped_rows = 0

                for row_index, row in enumerate(rows):
                    fields_arr = row.split(",")
                    if row_index == 0:
                        for field_index, field in enumerate(fields_arr):
                            field_name= field.lower()
                            if field_name == "key" or field_name in languages:
                                column_indexes[field_name] = field_index
                        logger.info(f"LocalizationAdmin::csv_import::header {column_indexes}")
                    else:
                        # last line is parsed as ['']
                        if len(fields_arr) < 2:
                            if row_index < len(rows) - 1:
                                skipped_rows += 1
                            continue
                        try:
                            data_to_save = dict()
                            for column, index in column_indexes.items():
                                data_to_save[column] = fields_arr[index]
                        except IndexError:
                            skipped_rows +=1
                            continue
                        try:
                            model_obj = Localization.objects.get(key=data_to_save["key"])
                            if allow_override:
                                for key, value in data_to_save.items():
                                    setattr(model_obj, key, value)
                                model_obj.save()
                                updated_rows += 1
                            else:
                                skipped_rows += 1
                        except Localization.DoesNotExist:
                            Localization.objects.create(**data_to_save)
                            created_rows += 1
                messages.success(
                    request, f"{created_rows} rows created, {updated_rows} rows updated, {skipped_rows} skipped."
                )
                logger.info("LocalizationAdmin::csv_import::bottom")
                return self.form_valid(form)
            except Exception as e:
                logger.error(error_text(e))
                messages.error(request, e)
                return self.form_invalid(form)
        else:
            return self.form_invalid(form)
