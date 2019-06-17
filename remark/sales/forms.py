from django import forms

from remark.geo.models import Address

from .models import ProductInquiry
from .states import STATES


class PropertyForm(forms.ModelForm):
    building_photo = forms.ImageField(required=False)

    class Meta:
        model = ProductInquiry
        fields = ["property_name", "product_type"]


class AddressForm(forms.ModelForm):
    state = forms.ChoiceField(required=True, choices=STATES)
    zip_code = forms.RegexField(required=True, regex=r"^\d{5}$")
    country = forms.CharField(required=False, max_length=128, initial="US")

    class Meta:
        model = Address
        fields = [
            "street_address_1",
            "street_address_2",
            "city",
            "state",
            "zip_code",
            "country",
        ]
