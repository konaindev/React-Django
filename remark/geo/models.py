from django.core.exceptions import ValidationError
from django.db import models
from jsonfield import JSONField
import googlemaps
import os


class Address(models.Model):
    """
    Represents an address with Google geocoding
    """
    street_address_1 = models.CharField(
        help_text="Street address 1",
        max_length=255,
    )

    street_address_2 = models.CharField(
        help_text="Street address 2",
        max_length=255,
        blank=True,
        null=True
    )

    city = models.CharField(max_length=128)

    state = models.CharField(
        help_text="State / Province",
        max_length=128
    )

    zip_code = models.CharField(
        help_text="Zipcode",
        blank=True,
        max_length=32
    )

    country = models.CharField(max_length=128)

    geo_code_json = JSONField(
        help_text="Google Geo Code JSON"
    )
