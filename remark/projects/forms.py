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
        super(ProjectForm, self).__init__(*args, **kwargs)
        field_maps = {
            "is_baseline_report_public": "baseline",
            "is_tam_public": "market",
            "is_performance_report_public": "performance",
            "is_modeling_public": "modeling",
            "is_campaign_plan_public": "campaign_plan",
        }

        try:
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
        except Exception:
            # This happens when creating a new Project
            # Quick hack to get around that issue
            pass

    class Meta:
        model = Project
        exclude = []
