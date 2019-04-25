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

    @property
    def latitude(self):
        try:
            return self.geo_code_json["geometry"]["location"]["lat"]
        except:
            return None

    @property
    def longitude(self):
        try:
            return self.geo_code_json["geometry"]["location"]["lng"]
        except:
            return None

    def save(self, *args, **kwargs):
        full_address = ", ".join(
            [item for item in [
                self.street_address_1,
                self.street_address_2,
                self.city,
                self.state,
                self.zip_code,
                self.country
            ] if item is not None and item != ""]
        )

        gmaps = googlemaps.Client(key=os.environ.get("GOOGLE_GEOCODE_API_KEY"))
        geocode_result = gmaps.geocode(full_address)
        self.process_geocode_response(geocode_result)
        return super().save(*args, **kwargs)

    def process_geocode_response(self, geocode_result):
        try:
            address_components = geocode_result[0]["address_components"]
        except:
            raise ValidationError("Address components not found")

        street_number_matches = [
            item["short_name"] for item in address_components \
            if "street_number" in item["types"]
        ]
        route_matches = [
            item["short_name"] for item in address_components \
            if "route" in item["types"]
        ]

        street_address_1_lines = street_number_matches + route_matches
        if len(street_address_1_lines) > 0:
            self.street_address_1 = " ".join(street_address_1_lines)
        else:
            raise ValidationError("Street address 1 not found")

        self.street_address_2 = None

        city_matches = [
            item["short_name"] for item in address_components \
            if "administrative_area_level_2" in item["types"]
        ]
        if len(city_matches) > 0:
            self.city = city_matches[0]
        else:
            raise ValidationError("City not found")

        state_matches = [
            item["short_name"] for item in address_components \
            if "administrative_area_level_1" in item["types"]
        ]
        if len(state_matches) > 0:
            self.state = state_matches[0]
        else:
            raise ValidationError("State not found")

        country_matches = [
            item["short_name"] for item in address_components \
            if "country" in item["types"]
        ]
        if len(country_matches) > 0:
            self.country = country_matches[0]
        else:
            raise ValidationError("Country not found")

        zip_code_matches = [
            item["short_name"] for item in address_components \
            if "postal_code" in item["types"]
        ]
        if len(zip_code_matches) > 0:
            self.zip_code = zip_code_matches[0]
        else:
            raise ValidationError("Zipcode not found")

        try:
            lat = geocode_result[0]["geometry"]["location"]["lat"]
        except:
            raise ValidationError("Latitude not found")

        try:
            lng = geocode_result[0]["geometry"]["location"]["lng"]
        except:
            raise ValidationError("Longitude not found")

        self.geo_code_json = geocode_result
