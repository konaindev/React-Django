from django.test import TestCase


from .geocode import GeocodeResult


class TestCompleteGeocodeResult(TestCase):
    # geocode("University Zoka Coffee, Seattle")
    TEST_GEOCODE_JSON = [
        {
            "address_components": [
                {"long_name": "2901", "short_name": "2901", "types": ["street_number"]},
                {
                    "long_name": "Northeast Blakeley Street",
                    "short_name": "NE Blakeley St",
                    "types": ["route"],
                },
                {
                    "long_name": "Northeast Seattle",
                    "short_name": "Northeast Seattle",
                    "types": ["neighborhood", "political"],
                },
                {
                    "long_name": "Seattle",
                    "short_name": "Seattle",
                    "types": ["locality", "political"],
                },
                {
                    "long_name": "King County",
                    "short_name": "King County",
                    "types": ["administrative_area_level_2", "political"],
                },
                {
                    "long_name": "Washington",
                    "short_name": "WA",
                    "types": ["administrative_area_level_1", "political"],
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"],
                },
                {"long_name": "98105", "short_name": "98105", "types": ["postal_code"]},
            ],
            "formatted_address": "2901 NE Blakeley St, Seattle, WA 98105, USA",
            "geometry": {
                "location": {"lat": 47.666069, "lng": -122.297606},
                "location_type": "ROOFTOP",
                "viewport": {
                    "northeast": {"lat": 47.6674179802915, "lng": -122.2962570197085},
                    "southwest": {"lat": 47.6647200197085, "lng": -122.2989549802915},
                },
            },
            "place_id": "ChIJXfLA8YYUkFQR6Zimch60wH0",
            "plus_code": {
                "compound_code": "MP82+CX Seattle, Washington, United States",
                "global_code": "84VVMP82+CX",
            },
            "types": ["cafe", "establishment", "food", "point_of_interest", "store"],
        },
        {
            "address_components": [
                {"long_name": "1220", "short_name": "1220", "types": ["street_number"]},
                {
                    "long_name": "West Nickerson Street",
                    "short_name": "W Nickerson St",
                    "types": ["route"],
                },
                {
                    "long_name": "Seattle",
                    "short_name": "Seattle",
                    "types": ["locality", "political"],
                },
                {
                    "long_name": "Washington",
                    "short_name": "WA",
                    "types": ["administrative_area_level_1", "political"],
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"],
                },
                {"long_name": "98119", "short_name": "98119", "types": ["postal_code"]},
            ],
            "formatted_address": "1325, 1220 W Nickerson St, Seattle, WA 98119, United States",
            "geometry": {
                "location": {"lat": 47.6558453, "lng": -122.373121},
                "location_type": "ROOFTOP",
                "viewport": {
                    "northeast": {"lat": 47.65719428029149, "lng": -122.3717720197085},
                    "southwest": {"lat": 47.6544963197085, "lng": -122.3744699802915},
                },
            },
            "place_id": "ChIJn5yWtKQVkFQRIY0mu9deQLo",
            "plus_code": {
                "compound_code": "MJ4G+8Q Seattle, Washington, United States",
                "global_code": "84VVMJ4G+8Q",
            },
            "types": ["establishment", "food", "point_of_interest"],
        },
    ]

    def setUp(self):
        super().setUp()
        self.result = GeocodeResult(self.TEST_GEOCODE_JSON)

    def test_latitude(self):
        self.assertEqual(self.result.latitude, 47.666069)

    def test_longitude(self):
        self.assertEqual(self.result.longitude, -122.297606)

    def test_formatted_address(self):
        self.assertEqual(
            self.result.formatted_address, "2901 NE Blakeley St, Seattle, WA 98105, USA"
        )

    def test_street_address(self):
        self.assertEqual(self.result.street_address, "2901 NE Blakeley St")

    def test_city(self):
        self.assertEqual(self.result.city, "Seattle")

    def test_state(self):
        self.assertEqual(self.result.state, "WA")

    def test_country(self):
        self.assertEqual(self.result.country, "US")

    def test_postal_code(self):
        self.assertEqual(self.result.postal_code, "98105")

    def test_zip5(self):
        self.assertEqual(self.result.zip5, "98105")

    def test_is_complete(self):
        self.assertTrue(self.result.is_complete)


class TestIncompleteGeocodeResult(TestCase):
    # geocode("University Of Washington in Seattle")
    TEST_GEOCODE_JSON = [
        {
            "address_components": [
                {
                    "long_name": "Seattle",
                    "short_name": "Seattle",
                    "types": ["locality", "political"],
                },
                {
                    "long_name": "King County",
                    "short_name": "King County",
                    "types": ["administrative_area_level_2", "political"],
                },
                {
                    "long_name": "Washington",
                    "short_name": "WA",
                    "types": ["administrative_area_level_1", "political"],
                },
                {
                    "long_name": "United States",
                    "short_name": "US",
                    "types": ["country", "political"],
                },
                {"long_name": "98195", "short_name": "98195", "types": ["postal_code"]},
            ],
            "formatted_address": "Seattle, WA 98195, USA",
            "geometry": {
                "location": {"lat": 47.65533509999999, "lng": -122.3035199},
                "location_type": "GEOMETRIC_CENTER",
                "viewport": {
                    "northeast": {"lat": 47.65668408029149, "lng": -122.3021709197085},
                    "southwest": {"lat": 47.65398611970849, "lng": -122.3048688802915},
                },
            },
            "place_id": "ChIJ6zWFnZIUkFQRoyu4AXksdGs",
            "plus_code": {
                "compound_code": "MM4W+4H Seattle, Washington, United States",
                "global_code": "84VVMM4W+4H",
            },
            "types": ["establishment", "point_of_interest", "university"],
        }
    ]

    def setUp(self):
        super().setUp()
        self.result = GeocodeResult(self.TEST_GEOCODE_JSON)

    def test_latitude(self):
        self.assertEqual(self.result.latitude, 47.65533509999999)

    def test_longitude(self):
        self.assertEqual(self.result.longitude, -122.3035199)

    def test_formatted_address(self):
        self.assertEqual(self.result.formatted_address, "Seattle, WA 98195, USA")

    def test_street_address(self):
        self.assertEqual(self.result.street_address, None)

    def test_city(self):
        self.assertEqual(self.result.city, "Seattle")

    def test_state(self):
        self.assertEqual(self.result.state, "WA")

    def test_country(self):
        self.assertEqual(self.result.country, "US")

    def test_postal_code(self):
        self.assertEqual(self.result.postal_code, "98195")

    def test_zip5(self):
        self.assertEqual(self.result.zip5, "98195")

    def test_is_complete(self):
        self.assertFalse(self.result.is_complete)

