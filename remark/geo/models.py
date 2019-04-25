from django.core.exceptions import ValidationError
from django.db import models
from jsonfield import JSONField
import googlemaps
import os


class Country(models.Model):
    """
    holds all of the countries in the world.
    """
    name = models.CharField(
        help_text="Country Name",
        max_length=250,
    )

    code = models.CharField(
        help_text="Country Code",
        max_length=4,
        unique=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Countries"


class State(models.Model):
    """
    holds all of the states/provinces in the world
    """
    name = models.CharField(
        help_text="State Name",
        max_length=250,
    )

    code = models.CharField(
        help_text="State Code",
        max_length=4,
        null=True,
        blank=True,
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="states",
    )

    def __str__(self):
        return self.name


class City(models.Model):
    """
    holds all of the cities in the world linked to their state/province and country.
    """
    name = models.CharField(
        help_text="City Name",
        max_length=250,
    )

    state = models.ForeignKey(
        State,
        on_delete=models.CASCADE,
        related_name="cities",
        null=True,
        blank=True,
    )

    country = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name="cities",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Cities"


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
