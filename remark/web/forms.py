from django import forms

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
    csv_file = forms.FileField(required=False, label="please select a file")

    def clean(self):
        pass
