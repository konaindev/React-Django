from unittest import TestCase

from parameterized import parameterized

from .urls import check_url_is_active


class CheckUrlTestCase(TestCase):

    @parameterized.expand([
        ("https://python.org", True),
        ("https://remarkably.io", True),
        ("https://badbabdbabd.com", False),
    ])
    def test_different_urls(self, url, active):
        self.assertEqual(active, check_url_is_active(url))
