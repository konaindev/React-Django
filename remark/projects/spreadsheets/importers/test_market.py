from django.test import TestCase

from .market import MarketImporter
from .test_base import SpreadsheetFileTestCaseMixin


class MarketTestCase(SpreadsheetFileTestCaseMixin, TestCase):
    importer_class = MarketImporter
    spreadsheet_file_name = "market.xlsx"
    schema_file_name = "market.schema.json"

    def test_example_data(self):
        """Sanity check a small amount of data from the imported sheet."""
        super().test_example_data()
        self.assertEqual(self.importer.cleaned_data["location"], "Seattle,WA")
        self.assertEqual(
            self.importer.cleaned_data["estimated_population"]["population"], 63353
        )
