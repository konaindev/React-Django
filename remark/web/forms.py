from django import forms
from django.core.exceptions import ValidationError

from .constants import LANGUAGES
from .models import Localization, LocalizationVersion


class LocalizationAdminForm(forms.ModelForm):
    class Meta:
        model = Localization
        fields = "__all__"


class LocalizationVersionAdminForm(forms.ModelForm):
    class Meta:
        model = LocalizationVersion
        fields = "__all__"


class LocalizationForm(forms.Form):
    version = forms.CharField(label="Version", required=False)
    language = forms.ChoiceField(
        label="Language", choices=LANGUAGES, required=False
    )


class CsvImportForm(forms.Form):
    csv_file = forms.FileField(required=False, label="")
    allow_override = forms.BooleanField(required=False, initial=True, label="Override Strings with Duplicate Key?")

    def clean(self):
        csv_file = self.cleaned_data.get("csv_file", None)
        if not csv_file:
            raise ValidationError("No spreadsheet file chosen.")
        else:
            return self.cleaned_data
