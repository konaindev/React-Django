from django.test import TestCase
from xls.exporters.tam_data import build_tam_data


class TAMExcelIntegrationTestCase(TestCase):
    """
    """

    def setUp(self):
        self.args = [
            ["98103"],
            47.6931622,
            -122.3596313,
            "Seattle, WA",
            3.0,
            [50000, 75000, 90000],
            [50000, 60000, 70000, 80000, 90000, 100000],
            [1000, 1500, 2000, 2500, 3000],
            0.33,
            33,
            3000,
            2000,
            1500,
            [0, 0, 0, 0, 0, 0],
        ]

    def test_tam_generation(self):
        build_tam_data(*self.args)
