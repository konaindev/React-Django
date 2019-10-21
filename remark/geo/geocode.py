"""
A simple wrapper around the google geocode APIs.
"""
from django.conf import settings

import googlemaps

from remark.lib.logging import getLogger

logger = getLogger(__name__)


class GeocodeError(Exception):
    pass


class GeocodeResult:
    """
    Wrapper around a raw JSON blob returned by the google Geocoding API.

    Provides convenience accessors to the data we want.
    """

    def __init__(self, geocode_json):
        if not isinstance(geocode_json, list):
            raise GeocodeError(f"Got a geocode_json that wasn't a list: {geocode_json}")
        if not geocode_json:
            raise GeocodeError(f"Got an empty geocode response.")
        self.geocode_json = geocode_json
        self.first_result = geocode_json[0]

    def get_address_component(self, type_):
        """
        Returns the (long_name, short_name) for the first address component
        matching the requested type_. If no components match, return (None, None)
        """
        for component in self.first_result.get("address_components", []):
            if type_ in component.get("types", []):
                return (component.get("long_name"), component.get("short_name"))
        return (None, None)

    def get_long_component(self, type_):
        """
        Returns the long name for the first address component matching
        the requested type_. If no components match, return None.
        """
        return self.get_address_component(type_)[0]

    def get_short_component(self, type_):
        """
        Returns the short name for the first address component matching
        the requested type_. If no components match, return None.
        """
        return self.get_address_component(type_)[1]

    @property
    def latitude(self):
        """Return the geocoded latitude, or None."""
        return self.first_result.get("geometry", {}).get("location", {}).get("lat")

    @property
    def longitude(self):
        """Return the geocoded longitude, or None."""
        return self.first_result.get("geometry", {}).get("location", {}).get("lng")

    @property
    def formatted_address(self):
        """Return the canonical formatted address, if available."""
        return self.first_result.get("formatted_address")

    @property
    def street_address(self):
        """Return the street, if known. (ex: 2901 NE Blakeley Street)"""
        number = self.get_short_component("street_number") or ""
        route = self.get_short_component("route") or ""
        unit = self.get_short_component("subpremise") or ""
        return f"{number} {route}, #{unit}".strip() if unit else f"{number} {route}".strip() or None

    @property
    def city(self):
        """Return the full city name, if known. (Seattle)"""
        maybe_city = self.get_long_component("locality")
        if not maybe_city:
            maybe_city = self.get_long_component("postal_town")
        if not maybe_city:
            maybe_city = self.get_long_component("sublocality")
        return maybe_city or None

    @property
    def state(self):
        """Return the short state name, if known. (WA)"""
        return self.get_short_component("administrative_area_level_1")

    @property
    def country(self):
        """Return the short country name, if known. (US)"""
        return self.get_short_component("country")

    @property
    def postal_code(self):
        """Return the postal code, if available."""
        return self.get_long_component("postal_code")

    @property
    def zip5(self):
        """Return an explicit 5-digit zipcode, if available."""
        maybe_postal = self.postal_code or ""
        return maybe_postal[:5] or None

    @property
    def is_complete(self):
        """Return True if all basic address components are availale."""
        components = [
            self.latitude,
            self.longitude,
            self.street_address,
            self.city,
            self.state,
            self.country,
            self.postal_code,
        ]
        return all([bool(component) for component in components])


def geocode(location):
    """
    Given an arbitrary location description (like 'University Of Washington'
    or '1600 Pennsylvania Ave'), attempt to geocode the location.

    On error, return None. On success, return a GeocodeResult.
    """
    try:
        client = googlemaps.Client(key=settings.GOOGLE_GEOCODE_API_KEY)
        geocode_json = client.geocode(location)
        result = GeocodeResult(geocode_json)
    except Exception as e:
        logger.error(f"Unable to geocode '{location}': {e}")
        result = None
    return result
