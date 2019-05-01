from django.test import TestCase

from .market import MarketImporter
from .test_base import SpreadsheetFileTestCaseMixin


class MarketTestCase(SpreadsheetFileTestCaseMixin, TestCase):
    importer_class = MarketImporter
    spreadsheet_file_name = "market.xlsx"
    schema_file_name = "market.schema.json"

    def test_example_data(self):
        """
        An integration test that ensures that both our checked-in
        example baseline/perf spreadsheet *and* our importer are in
        agreement. If they aren't... boom!
        """
        super().test_example_data()

        self.assertEqual(self.importer.cleaned_data["location"], "Seattle,WA")
        self.assertEqual(
            self.importer.cleaned_data["estimated_population"]["population"], 63353
        )
