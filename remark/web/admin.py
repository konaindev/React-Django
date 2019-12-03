import csv
from io import StringIO

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

    def get_existing_locales(self):
        locales = LocalizationVersion.objects.all().values_list("language", flat=True)
        return list(locales)

    def post(self, request, *args, **kwargs):
        form = self.get_form()

        if form.is_valid():
            logger.info("LocalizationAdmin::csv_import::top")

            try:
                locales = self.get_existing_locales()
                allowed_fields = ["key"] + locales
                allow_override = form.cleaned_data["allow_override"]
                csv_file = form.cleaned_data["csv_file"]

                csv_file_byte = csv_file.read().decode("utf-8-sig")
                csv_file_text = StringIO(csv_file_byte)
                csv.register_dialect('myDialect', delimiter = ',', quoting=csv.QUOTE_ALL, skipinitialspace=True)
                csv_reader = csv.DictReader(csv_file_text, dialect='myDialect')

                created_rows = 0
                updated_rows = 0
                skipped_rows = 0

                for row in csv_reader:
                    # csv file might have more columns other than configured locales
                    # pick "key" and locales only
                    dict_row = { key: dict(row).get(key) for key in allowed_fields }

                    try:
                        model_obj = Localization.objects.get(key=dict_row["key"])
                        if allow_override:
                            for locale in locales:
                                setattr(model_obj, locale, dict_row[locale])
                            model_obj.save()
                            updated_rows += 1
                        else:
                            skipped_rows += 1
                    except Localization.DoesNotExist:
                        Localization.objects.create(**dict_row)
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
