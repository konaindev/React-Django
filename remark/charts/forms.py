import re

from django import forms


HEX_RE = re.compile(r"^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")
CHARTS_TYPES = [
    ("png", "png"),
    ("svg", "svg"),
]


class DonutForm(forms.Form):
    goal = forms.IntegerField(required=True, min_value=0, max_value=100)
    goal_date = forms.DateField(required=True)
    current = forms.IntegerField(required=True, min_value=0, max_value=100)
    bg = forms.RegexField(required=True, regex=HEX_RE)
    bg_target = forms.RegexField(required=True, regex=HEX_RE)
    bg_current = forms.RegexField(required=True, regex=HEX_RE)
    type = forms.ChoiceField(
        required=False,
        choices=CHARTS_TYPES,
        initial="png",
    )

    def clean_type(self):
        type_ = self.cleaned_data["type"]
        if type_ in (None, ""):
            return self.fields["type"].initial
        return type_
