from datetime import datetime

from django import forms
from django.core.exceptions import ValidationError
from django.utils.safestring import mark_safe

from remark.lib.validators import (
    validate_linebreak_separated_numbers_list,
    validate_linebreak_separated_strings_list,
)
from .models import Project, CampaignModel, Spreadsheet, Spreadsheet2
from .reports.selectors import ReportLinks
from .spreadsheets import get_importer_for_kind, SpreadsheetKind

from remark.lib.logging import error_text, getLogger

logger = getLogger(__name__)


class CampaignModelUploadForm(forms.ModelForm):
    # Custom field to allow spreadsheet file upload
    spreadsheet_file = forms.FileField()

    """
    When the form is submitted with "spreadsheet_file" (custom field) left blank, clean() method is not called at all.
    "helper_field" (which is hidden) helps triggering validation.

    IMPORTANT: if you are not going to upload, you should close the inline form and save page.
    @ref: https://code.djangoproject.com/ticket/29087
    @ref: https://github.com/django/django/pull/11504/files
    """
    helper_field = forms.CharField(widget=forms.widgets.HiddenInput({"value": "any"}))

    def clean(self):
        cleaned_data = super().clean()

        try:
            # if spreadsheet file is empty, show error on UI
            spreadsheet_file = cleaned_data.get("spreadsheet_file", None)
            if spreadsheet_file is None:
                raise ValidationError("No spreadsheet file chosen.")

            importer = get_importer_for_kind(
                SpreadsheetKind.MODELING, cleaned_data["spreadsheet_file"]
            )
            if importer is None:
                raise ValidationError(f"No spreadsheet importer available for model")
            if not importer.is_valid():
                raise ValidationError(
                    f"Could not validate spreadsheet: {importer.errors}"
                )

            spreadsheet = Spreadsheet2(
                file_url=cleaned_data["spreadsheet_file"],
                json_data=importer.cleaned_data,
                kind=SpreadsheetKind.MODELING,
            )
            # creates temporary fields required to generate "upload_to" path
            spreadsheet.project = cleaned_data["campaign"].project
            spreadsheet.created = datetime.now()
            spreadsheet.save()

            cleaned_data["spreadsheet"] = spreadsheet
            cleaned_data["name"] = importer.cleaned_data["name"]
            cleaned_data["model_start"] = importer.cleaned_data["dates"]["start"]
            cleaned_data["model_end"] = importer.cleaned_data["dates"]["end"]

            return cleaned_data
        except ValidationError as e:
            raise e
        except Exception as e:
            etxt = error_text(e)
            logger.error(etxt)
            raise Exception(f"Unexpected error when cleaning spreadsheet: {etxt}")

    class Meta:
        model = CampaignModel
        fields = ["spreadsheet_file"]


class SpreadsheetForm(forms.ModelForm):
    """
    Hooks into validation of spreadsheet content to ensure that only
    valid spreadsheets can be provided to the admin and other form-using
    APIs.
    """

    # exclude MODELING spreadsheet since it's managed by CampaignModel
    kind = forms.ChoiceField(
        choices=[
            choice
            for choice in SpreadsheetKind.CHOICES
            if choice[0] is not SpreadsheetKind.MODELING
        ],
        required=True,
    )

    def clean(self):
        cleaned_data = super().clean()

        try:
            # validate file input
            if cleaned_data.get("file", None) is None:
                raise ValidationError("No spreadsheet file chosen.")

            # Attempt to import and validate the spreadsheet contents
            importer = get_importer_for_kind(cleaned_data["kind"], cleaned_data["file"])
            if importer is None:
                raise ValidationError(
                    f"No spreadsheet importer available for {cleaned_data['kind']}"
                )
            if not importer.is_valid():
                raise ValidationError(
                    f"Could not validate spreadsheet: {importer.errors}"
                )

            # Success! We read the spreadsheet just fine.
            cleaned_data["imported_data"] = importer.cleaned_data

            return cleaned_data
        except ValidationError as e:
            # It is important to raise ValidationError outward from a Django Form instance's
            # clean() method if the only problem is with validation. If you do this, the
            # form will simply return False for is_valid() and you can do normal form error
            # handling. If you *don't* do this -- for instance, if you catch the ValidationError
            # and re-raise a different exception of type Exception, then Django will assume
            # that something unexpected happened. This will result in a 500 error. -Dave
            raise e
        except Exception as e:
            etxt = error_text(e)
            logger.error(etxt)
            raise Exception(f"Unexpected error when cleaning spreadsheet: {etxt}")

    class Meta:
        model = Spreadsheet
        fields = ["project", "kind", "file"]


class ProjectForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.is_existing_instance = kwargs.get("instance") is not None
        super(ProjectForm, self).__init__(*args, **kwargs)
        self._map_public_and_shared_fields()

    def _map_public_and_shared_fields(self):
        def append_links_to_field_label(link_type, report_links, field_maps):
            for prefix, report_name in field_maps.items():
                field_name = prefix + link_type
                if isinstance(report_links[report_name], dict):
                    link = report_links[report_name]["url"]
                elif isinstance(report_links[report_name], list):
                    link = report_links[report_name][0]["url"]
                else:
                    continue
                self.fields[field_name].label = mark_safe(
                    self.fields[field_name].label
                    + '&nbsp; (URL: <a target="_blank" href="{}">{}</a>)'.format(
                        link, link
                    )
                )

        field_maps = {
            "is_baseline_report_": "baseline",
            "is_tam_": "market",
            "is_performance_report_": "performance",
            "is_modeling_": "modeling",
            "is_campaign_plan_": "campaign_plan",
        }

        if self.is_existing_instance:
            report_links = ReportLinks.for_project(self.instance)
            append_links_to_field_label("public", report_links, field_maps)
            report_links = ReportLinks.share_for_project(self.instance)
            append_links_to_field_label("shared", report_links, field_maps)

    def clean_competitors(self):
        max_competitors = 2
        competitors = self.cleaned_data.get("competitors")
        if competitors and competitors.count() > max_competitors:
            raise forms.ValidationError("Maximum %s competitors." % max_competitors)
        return competitors

    def clean_fund(self):
        if self.cleaned_data["fund"] is None:
            return None

        if self.cleaned_data["account"].id != self.cleaned_data["fund"].account_id:
            raise forms.ValidationError(
                "Fund do not match the Account attached to the Project"
            )
        return self.cleaned_data["fund"]

    class Meta:
        model = Project
        exclude = ["email_list_id"]


def multiline_text_to_str_array(text):
    return [str(item) for item in text.replace("\r", "").split("\n")]


def multiline_text_to_int_array(text):
    return [int(item) for item in text.replace("\r", "").split("\n")]


class TAMExportForm(forms.Form):
    radius = forms.FloatField(
        label="Radius", help_text="Radius (in miles)", required=False
    )
    zip_codes = forms.CharField(
        widget=forms.Textarea,
        label="Zip codes",
        help_text="List of Zip Codes",
        required=False,
        validators=[validate_linebreak_separated_strings_list],
    )
    rti_target = forms.FloatField(
        label="RTI Target",
        help_text="Rent-To-Income Target, allowed values are 0% to 100%",
        min_value=0,
        max_value=1,
    )
    rti_income_groups = forms.CharField(
        widget=forms.Textarea,
        label="RTI Income Groups",
        help_text="A list of integers representing annual salaries (e.g. $30000, $40000, $50000, $60000)",
        validators=[validate_linebreak_separated_numbers_list],
    )
    rti_rental_rates = forms.CharField(
        widget=forms.Textarea,
        label="RTI Rent Groups",
        help_text="A list of integers representing monthly rents (e.g. $500, $800, $1000, $1200)",
        validators=[validate_linebreak_separated_numbers_list],
    )
    income_groups = forms.CharField(
        widget=forms.Textarea,
        label="Income Segments",
        help_text="A list of integers representing annual salaries that is used differently than above (e.g. $30000, $40000, $50000)",
        validators=[validate_linebreak_separated_numbers_list],
    )

    def clean(self):
        if (
            not self.data["radius"]
            and not self.data["zip_codes"]
            or self.data["radius"]
            and self.data["zip_codes"]
        ):
            raise forms.ValidationError(
                "You should enter either one of Radius or Zip Codes", code="invalid"
            )

    def clean_zip_codes(self):
        return multiline_text_to_str_array(self.cleaned_data["zip_codes"])

    def clean_income_groups(self):
        return multiline_text_to_int_array(self.cleaned_data["income_groups"])

    def clean_rti_income_groups(self):
        return multiline_text_to_int_array(self.cleaned_data["rti_income_groups"])

    def clean_rti_rental_rates(self):
        return multiline_text_to_int_array(self.cleaned_data["rti_rental_rates"])
