from django.test import TestCase

from .geocode import GeocodeResult
from .models import Address
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
