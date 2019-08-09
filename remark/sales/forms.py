from django import forms
from image_cropping import ImageCropWidget

from remark.geo.models import Address

from .models import ProductInquiry
from .states import STATES


class ProductInquiryForm(forms.ModelForm):
    building_photo = forms.ImageField(required=False, label="Building photo")

    class Meta:
        model = ProductInquiry
        fields = ["property_name", "product_type"]


class AddressForm(forms.ModelForm):
    state = forms.ChoiceField(required=True, choices=STATES, label="State")
    zip_code = forms.RegexField(
        required=True, regex=r"^\d{5}$", label="Zipcode")
    country = forms.CharField(
        required=False, max_length=128, initial="US", label="Country")

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


class ProductInquiryAdminForm(forms.ModelForm):
    class Meta:
        model = ProductInquiry
        fields = "__all__"
        widgets = {
            "building_photo": ImageCropWidget,
        }
