from django import forms
from django.core.exceptions import ValidationError

from .geocode import geocode
from .models import Address


class LocationForm(forms.ModelForm):
    """A simple form that *only* exposes a Location."""

    location = forms.CharField(
        max_length=255,
        required=True,
        help_text='Any address or description of a place that Google can covert into a street address. (ex: "El Cortez Apartments, Phoenix")',
    )

    def clean_location(self):
        location = self.cleaned_data["location"]
        self.result = geocode(location)
        if self.result is None:
            raise ValidationError(f"Unable to geocode '{location}'")
        if not self.result.is_complete:
            raise ValidationError(
                f"Geocoded result is not complete: '{self.result.formatted_address}'"
            )
        return location

    def save(self, commit=True, *args, **kwargs):
        obj = super().save(commit=False, *args, **kwargs)
        obj.formatted_address = self.result.formatted_address
        obj.street_address_1 = self.result.street_address
        obj.street_address_2 = ""
        obj.city = self.result.city
        obj.state = self.result.state
        obj.zip_code = self.result.zip5
        obj.country = self.result.country
        obj.geocode_json = self.result.geocode_json
        if commit:
            obj.save()
        return obj

    class Meta:
        model = Address
        exclude = [
            "formatted_address",
            "street_address_1",
            "street_address_2",
            "city",
            "state",
            "zip_code",
            "country",
            "geocode_json",
        ]


class AddressForm(forms.ModelForm):
    """A simple form that exposes address contents direclty."""

    class Meta:
        model = Address
        fields = "__all__"
