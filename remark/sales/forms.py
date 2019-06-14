from django import forms

from .states import STATES


PRODUCT_TYPES = [
    ("Accelerate", "Accelerate"),
    ("Stabilize", "Optimize"),
    ("Ground Up", "Ground Up"),
    ("Other", "Not Sure"),
]


class PropertyForm(forms.Form):
    property_name = forms.CharField(required=True, max_length=255)
    street_address_1 = forms.CharField(required=True, max_length=255)
    street_address_2 = forms.CharField(required=True, max_length=255)
    city = forms.CharField(required=True, max_length=128)
    state = forms.ChoiceField(required=True, choices=STATES)
    zip_code = forms.RegexField(required=True, regex=r"^\d{5}$")
    product_type = forms.ChoiceField(required=True, choices=PRODUCT_TYPES)
    building_photo = forms.ImageField(required=True)
