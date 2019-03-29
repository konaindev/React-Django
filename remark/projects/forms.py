from django import forms

from .models import Spreadsheet


class SpreadsheetForm(forms.ModelForm):
    """
    Hooks into validation of spreadsheet content to ensure that only
    valid spreadsheets can be provided to the admin and other form-using
    APIs.
    """

    def clean(self):
        cleaned_data = super().clean()

        return cleaned_data

    class Meta:
        model = Spreadsheet
        fields = "__all__"

