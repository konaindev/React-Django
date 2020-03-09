from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from jsonfield import JSONField

from .geocode import geocode, GeocodeResult
from remark.lib.geo import distance_between_two_geopoints


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

    full_state = models.CharField(blank=True, help_text="State / Province Full name", max_length=128)

    zip_code = models.CharField(blank=False, max_length=32, help_text="ZIP5")

    country = models.CharField(blank=False, max_length=128)

    geocode_json = JSONField(
        blank=True,
        null=True,
        default=None,
        help_text="Raw JSON response from google geocode",
    )

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""
        return {
            "street_address_1": self.street_address_1,
            "street_address_2": self.street_address_2,
            "city": self.city,
            "state": self.state,
            "zip_code": self.zip_code,
            "country": self.country,
            "formatted_address": self.formatted_address,
        }

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


class ZipcodeManager(models.Manager):
    def look_up_polygon(self, zip_code):
        try:
            zipcode = self.get(zip_code=zip_code)

            return dict(
                zip=zip_code,
                outline=zipcode.geometry,
                properties=dict(center=[zipcode.lon, zipcode.lat]),
            )
        except self.model.DoesNotExist:
            return None


    def look_up_polygons_in_circle(self, center_coords, radius_in_mile, state):
        zipcodes = []
        zipcodes_in_expand_radius = []

        if radius_in_mile < 5:
            expand_rate = 5
        elif radius_in_mile < 10:
            expand_rate = 3
        else:
            expand_rate = 2

        expand_radius_in_mile = radius_in_mile * expand_rate

        query = dict()
        if state is not None:
            query["state"] = state

        for zipcode in self.filter(**query).iterator():
            distance_in_mile = distance_between_two_geopoints(
                center_coords[0],
                center_coords[1],
                zipcode.lon,
                zipcode.lat,
            )
            if distance_in_mile < expand_radius_in_mile:
                zipcodes_in_expand_radius.append(dict(
                    zip=zipcode.zip_code,
                    outline=zipcode.geometry,
                    properties=dict(center=[zipcode.lon, zipcode.lat]),
                ))

        for zipcode in zipcodes_in_expand_radius:
            if zipcode["outline"]["type"] == "Polygon":
                number_outline_coordinates = len(zipcode["outline"]["coordinates"][0])
            else: 
                number_outline_coordinates = len(zipcode["outline"]["coordinates"][-1][0])

            num = 0

            while num < number_outline_coordinates:
                if zipcode["outline"]["type"] == "Polygon":
                    distance_between_outlinepoint_and_center_in_mile = distance_between_two_geopoints(
                        center_coords[0],
                        center_coords[1],
                        zipcode["outline"]["coordinates"][0][num][0],
                        zipcode["outline"]["coordinates"][0][num][1],
                    )
                else:
                    distance_between_outlinepoint_and_center_in_mile = distance_between_two_geopoints(
                        center_coords[0],
                        center_coords[1],
                        zipcode["outline"]["coordinates"][-1][0][num][0],
                        zipcode["outline"]["coordinates"][-1][0][num][1],
                    )

                if distance_between_outlinepoint_and_center_in_mile < radius_in_mile:
                    zipcodes.append(zipcode)
                    break
                else:
                    num = num + int(number_outline_coordinates / 20)

        return zipcodes    


class Zipcode(models.Model):
    """
    Polygon data per zip code
    """

    objects = ZipcodeManager()

    zip_code = models.CharField(
        primary_key=True, help_text="5-digit ZIP code", max_length=5
    )

    state = models.CharField(help_text="State abbreviation", max_length=2)

    geometry = JSONField(
        help_text="Geometry JSON data which includes 'type' and 'coordinates'"
    )

    lat = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        default=None,
        null=True,
        help_text="Latitude of zipcode center",
    )

    lon = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        default=None,
        null=True,
        help_text="Longitude of zipcode center",
    )

    land_area = models.FloatField(default=0, help_text="Land area in square miles")

    water_area = models.FloatField(default=0, help_text="Water area in square miles")

    has_population = models.BooleanField(
        null=True,
        help_text="Flag to identify dead zipcodes, based on Atlas service",
    )


class USACensusZip(models.Model):
    total_population = models.PositiveIntegerField()

    number_of_households = models.PositiveIntegerField()

    zipcode = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return f"Found population {self.total_population} and households {self.number_of_households} in zipcode {self.zipcode}"


class USACensusPopulationByAge(models.Model):
    usa_census_zip = models.ForeignKey(
        USACensusZip, on_delete=models.CASCADE, related_name="age_segments"
    )

    start_age = models.IntegerField()

    end_age = models.IntegerField()

    population_percentage = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )


class USACensusHouseholdByType(models.Model):
    class HouseholdType:
        MARRIED = "Married"
        SINGLE_FEMALE = "Single Female"
        SINGLE_MALE = "Single Male"
        ONE_PERSON = "One Person"
        NON_FAMILY = "Non-Family"

        CHOICES = [
            (MARRIED, MARRIED),
            (SINGLE_FEMALE, SINGLE_FEMALE),
            (SINGLE_MALE, SINGLE_MALE),
            (ONE_PERSON, ONE_PERSON),
            (NON_FAMILY, NON_FAMILY),
        ]

    usa_census_zip = models.ForeignKey(
        USACensusZip, on_delete=models.CASCADE, related_name="households"
    )

    household_type = models.CharField(max_length=20, choices=HouseholdType.CHOICES)

    household_percentage = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )


class USACensusIncomeDistribution(models.Model):
    usa_census_zip = models.ForeignKey(
        USACensusZip, on_delete=models.CASCADE, related_name="income_distributions"
    )

    income_start = models.IntegerField()

    income_end = models.IntegerField()

    income_distribution_percentage = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(1.0)]
    )
