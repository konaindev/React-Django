from django.db import models

from jsonfield import JSONField

from .geocode import geocode, GeocodeResult


class Country(models.Model):
    """
    holds all of the countries in the world.
    """

    name = models.CharField(help_text="Country Name", max_length=250)

    code = models.CharField(help_text="Country Code", max_length=4, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Countries"


class State(models.Model):
    """
    holds all of the states/provinces in the world
    """

    name = models.CharField(help_text="State Name", max_length=250)

    code = models.CharField(help_text="State Code", max_length=4, null=True, blank=True)

    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, related_name="states"
    )

    def __str__(self):
        return self.name


class City(models.Model):
    """
    holds all of the cities in the world linked to their state/province and country.
    """

    name = models.CharField(help_text="City Name", max_length=250)

    state = models.ForeignKey(
        State, on_delete=models.CASCADE, related_name="cities", null=True, blank=True
    )

    country = models.ForeignKey(
        Country, on_delete=models.CASCADE, related_name="cities", null=True, blank=True
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Cities"


class AddressManager(models.Manager):
    def create_with_location(self, location):
        """
        Given an arbitrary location string, attempt to *synchronously*
        perform a geocode and create an Address from the result.

        If the result is invalid, or geocoding fails, this will return None.
        Otherwise, it will return the newly created Address instance.

        If you want asynchronous behavior, you'll have to create it elsewhere.
        """
        result = geocode(location)
        return self.create_with_geocode_result(result)

    def create_with_geocode_result(self, result):
        """
        Given a GeocodeResult, validate it and return an Address.

        If the result is invalid, this will return None.
        """
        address = None
        if result and result.is_complete:
            address = self.create(
                formatted_address=result.formatted_address,
                street_address_1=result.street_address,
                street_address_2="",
                city=result.city,
                state=result.state,
                zip_code=result.zip5,
                country=result.country,
                geocode_json=result.geocode_json,
            )
        return address


class Address(models.Model):
    """
    Represents an address with Google geocoding
    """

    objects = AddressManager()

    formatted_address = models.CharField(
        blank=False, max_length=255, help_text="The address in canonical formatted form"
    )

    street_address_1 = models.CharField(
        blank=False, max_length=255, help_text="Street address 1"
    )

    street_address_2 = models.CharField(
        max_length=255, blank=True, default="", help_text="Street address 2"
    )

    city = models.CharField(blank=False, max_length=128)

    state = models.CharField(blank=False, help_text="State / Province", max_length=128)

    zip_code = models.CharField(blank=False, max_length=32, help_text="ZIP5")

    country = models.CharField(blank=False, max_length=128)

    geocode_json = JSONField(
        blank=True,
        null=True,
        default=None,
        help_text="Raw JSON response from google geocode",
    )

    @property
    def geocode_result(self):
        try:
            return GeocodeResult(self.geocode_json)
        except Exception:
            return None

    @property
    def latitude(self):
        result = self.geocode_result
        return result.latitude if result else None

    @property
    def longitude(self):
        result = self.geocode_result
        return result.longitude if result else None

    def __str__(self):
        return self.formatted_address or str(self.id)


class ZipcodePolygonManager(models.Manager):
    def fetch_zip_polygons(self, zip_code):
        try:
            row = self.get(zip_code=zip_code)
            return dict(
                properties=row.properties,
                geometry=row.geometry
            )
        except self.model.DoesNotExist:
            return None


class ZipcodePolygon(models.Model):
    """
    Polygon data per zip code
    """

    objects = ZipcodePolygonManager()

    zip_code = models.CharField(
        primary_key=True,
        help_text="5-digit ZIP code",
        max_length=5,
    )

    state = models.CharField(
        help_text="State abbreviation",
        max_length=2
    )

    geometry = JSONField(
        help_text="Geometry JSON data which includes 'type' and 'coordinates'"
    )

    properties = JSONField(
        help_text="Additional properties in JSON format"
    )
