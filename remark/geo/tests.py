from django.test import TestCase
from django.core.exceptions import ValidationError
from copy import copy

from .models import Address


class AddressModelTest(TestCase):
    """
    Test that all computed properties on a default Period instance
    return sane values.
    """

    def setUp(self):
        self.geocode_result = [
            {
                "address_components" : [
                    {
                        "long_name" : "1600",
                        "short_name" : "1600",
                        "types" : [ "street_number" ]
                    },
                    {
                        "long_name" : "Amphitheatre Pkwy",
                        "short_name" : "Amphitheatre Pkwy",
                        "types" : [ "route" ]
                    },
                    {
                        "long_name" : "Mountain View",
                        "short_name" : "Mountain View",
                        "types" : [ "locality", "political" ]
                    },
                    {
                        "long_name" : "Santa Clara County",
                        "short_name" : "Santa Clara County",
                        "types" : [ "administrative_area_level_2", "political" ]
                    },
                    {
                        "long_name" : "California",
                        "short_name" : "CA",
                        "types" : [ "administrative_area_level_1", "political" ]
                    },
                    {
                        "long_name" : "United States",
                        "short_name" : "US",
                        "types" : [ "country", "political" ]
                    },
                    {
                        "long_name" : "94043",
                        "short_name" : "94043",
                        "types" : [ "postal_code" ]
                    }
                ],
                "formatted_address" : "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
                "geometry" : {
                    "location" : {
                        "lat" : 37.4224764,
                        "lng" : -122.0842499
                    },
                    "location_type" : "ROOFTOP",
                    "viewport" : {
                        "northeast" : {
                            "lat" : 37.4238253802915,
                            "lng" : -122.0829009197085
                        },
                        "southwest" : {
                            "lat" : 37.4211274197085,
                            "lng" : -122.0855988802915
                        }
                    }
                },
                "place_id" : "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
                "types" : [ "street_address" ]
            }
        ]

    def test_process_geocode_response_with_correct_response(self):
        address = Address()
        address.process_geocode_response(self.geocode_result)
        self.assertEqual(address.street_address_1, "1600 Amphitheatre Pkwy")
        self.assertEqual(address.street_address_2, None)
        self.assertEqual(address.city, "Santa Clara County")
        self.assertEqual(address.state, "CA")
        self.assertEqual(address.country, "US")

    def test_process_geocode_response_with_missing_street_address_1(self):
        mal_geocode_result = copy(self.geocode_result)
        # street addres 1 is omitted
        mal_geocode_result[0]["address_components"] = self.geocode_result[0]["address_components"][2:]
        address = Address()
        self.assertRaises(
            ValidationError,
            address.process_geocode_response,
            mal_geocode_result
        )
