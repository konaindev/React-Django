from django import forms
from django.core.exceptions import ValidationError

from .models import Spreadsheet
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
