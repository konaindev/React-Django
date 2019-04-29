from django import forms
from django.core.exceptions import ValidationError
from django.utils.safestring import mark_safe

from .models import Project, Spreadsheet
from .reports.selectors import ReportLinks
from .spreadsheets import get_importer_for_kind, SpreadsheetKind


class SpreadsheetForm(forms.ModelForm):
    """
    Hooks into validation of spreadsheet content to ensure that only
    valid spreadsheets can be provided to the admin and other form-using
    APIs.
    """

    def clean(self):
        cleaned_data = super().clean()

        if cleaned_data["kind"] != SpreadsheetKind.MODELING and cleaned_data["subkind"]:
            raise ValidationError(
                "For non-modeling spreadsheets, 'subkind' must be blank."
            )

        # Attempt to import and validate the spreadsheet contents
        importer = get_importer_for_kind(cleaned_data["kind"], cleaned_data["file"])
        if importer is None:
            raise ValidationError(
                f"No spreadsheet importer available for {cleaned_data['kind']}"
            )
        if not importer.is_valid():
            raise ValidationError(f"Could not validate spreadsheet: {importer.errors}")

        # If this is a modeling spreadsheet, set the subkind based on the model name.
        if cleaned_data["kind"] == SpreadsheetKind.MODELING:
            cleaned_data["subkind"] = importer.cleaned_data["name"]

        # Success! We read the spreadsheet just fine.
        cleaned_data["imported_data"] = importer.cleaned_data

        return cleaned_data

    class Meta:
        model = Spreadsheet
        fields = ["project", "kind", "subkind", "file"]
        # You're not allowed to set the subkind directly.
        widgets = {"subkind": forms.HiddenInput()}


class ProjectForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        is_existing_instance = kwargs.get("instance") is not None
        super(ProjectForm, self).__init__(*args, **kwargs)
        field_maps = {
            "is_baseline_report_public": "baseline",
            "is_tam_public": "market",
            "is_performance_report_public": "performance",
            "is_modeling_public": "modeling",
            "is_campaign_plan_public": "campaign_plan",
        }

        if is_existing_instance:
            report_links = ReportLinks.for_project(self.instance)
            for k, v in field_maps.items():
                if isinstance(report_links[v], dict):
                    link = report_links[v]["url"]
                elif isinstance(report_links[v], list):
                    link = report_links[v][0]["url"]
                else:
                    continue
                self.fields[k].label = mark_safe(
                    self.fields[k].label
                    + '&nbsp; (URL: <a target="_blank" href="{}">{}</a>)'.format(
                        link, link
                    )
                )

    class Meta:
        model = Project
        exclude = []


def multiline_text_to_str_array(text):
    return [str(item) for item in text.replace("\r", "").split("\n")]


def multiline_text_to_int_array(text):
    return [int(item) for item in text.replace("\r", "").split("\n")]


class TAMExportForm(forms.Form):
    radius = forms.FloatField(
        label="Radius",
        help_text="Radius (in miles)",
        required=False,
    )
    zip_codes = forms.CharField(
        widget=forms.Textarea,
        label="Zip codes",
        help_text="List of Zip Codes",
        required=False,
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
    )
    rti_rental_rates = forms.CharField(
        widget=forms.Textarea,
        label="RTI Rent Groups",
        help_text="A list of integers representing monthly rents (e.g. $500, $800, $1000, $1200)",
    )
    income_groups = forms.CharField(
        widget=forms.Textarea,
        label="Income Segments",
        help_text="A list of integers representing annual salaries that is used differently than above (e.g. $30000, $40000, $50000)",
    )

    def clean_radius(self):
        if not self.data["radius"] and not self.data["zip_codes"]:
            raise forms.ValidationError("You should enter either one of Radius or Zip Codes")

    def clean_zip_codes(self):
        if self.data["radius"] and self.data["zip_codes"]:
            raise forms.ValidationError("You should enter either one of Radius or Zip Codes")
        return multiline_text_to_str_array(self.cleaned_data["zip_codes"])

    def clean_income_groups(self):
        return multiline_text_to_int_array(self.cleaned_data["income_groups"])

    def clean_rti_income_groups(self):
        return multiline_text_to_int_array(self.cleaned_data["rti_income_groups"])

    def clean_rti_rental_rates(self):
        return multiline_text_to_int_array(self.cleaned_data["rti_rental_rates"])
