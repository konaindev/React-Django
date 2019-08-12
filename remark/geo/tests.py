from decimal import *

from django.test import TestCase

from .geocode import GeocodeResult
from .models import Address, Zipcode
from .test_geocode import TestCompleteGeocodeResult, TestIncompleteGeocodeResult


class AddressManagerTestCase(TestCase):
    def test_complete_result(self):
        result = GeocodeResult(TestCompleteGeocodeResult.TEST_GEOCODE_JSON)
        address = Address.objects.create_with_geocode_result(result)
        self.assertTrue(address is not None)
        self.assertEqual(
            address.geocode_result.geocode_json,
            TestCompleteGeocodeResult.TEST_GEOCODE_JSON,
        )
        self.assertEqual(address.latitude, address.geocode_result.latitude)
        self.assertEqual(address.longitude, address.geocode_result.longitude)

    def test_incomplete_result(self):
        result = GeocodeResult(TestIncompleteGeocodeResult.TEST_GEOCODE_JSON)
        address = Address.objects.create_with_geocode_result(result)
        self.assertTrue(address is None)

    def test_none_result(self):
        result = None
        address = Address.objects.create_with_geocode_result(result)
        self.assertTrue(address is None)

class ZipcodeManagerTestCase(TestCase):
    """
    Cover geo.Zipcode model
    """

    def setUp(self):
        zipcode = Zipcode.objects.update_or_create(
            zip_code="97201",
            defaults=dict(
                state="OR",
                geometry={
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [-122.713058, 45.476042],
                            [-122.720757, 45.520582],
                            [-122.700411, 45.523881],
                            [-122.680616, 45.515083],
                            [-122.672918, 45.513983],
                            [-122.667419, 45.504635],
                            [-122.669619, 45.476042],
                            [-122.713058, 45.476042]
                        ]
                    ]
                },
                lat=45.482741,
                lon=-122.644441,
                land_area=6.326849507380239,
                water_area=1.0234371306268757
            )
        )

    def test_look_up_polygon(self):
        jsonable = Zipcode.objects.look_up_polygon("97201")
        self.assertTrue(jsonable is not None)
        self.assertEqual(type(jsonable), dict)
        self.assertEqual(type(jsonable["outline"]), dict)
        self.assertEqual(type(jsonable["properties"]), dict)

        center = jsonable["properties"]["center"]
        self.assertEqual(type(center), list)
        self.assertEqual(type(center[0]), Decimal)
        self.assertEqual(type(center[1]), Decimal)

        jsonable = Zipcode.objects.look_up_polygon("missing_zip")
        self.assertTrue(jsonable is None)
