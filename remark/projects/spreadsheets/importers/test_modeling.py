from django.test import TestCase

from .modeling import ModelingImporter
from .test_base import SpreadsheetFileTestCaseMixin


class ModelingTestCase(SpreadsheetFileTestCaseMixin, TestCase):
    importer_class = ModelingImporter
    spreadsheet_file_name = "modeling.xlsx"
    schema_file_name = "modeling.schema.json"

    def test_example_data(self):
        """Sanity check a small amount of data from the imported sheet."""
        super().test_example_data()
        self.assertEqual(self.importer.cleaned_data["name"], "Deadline Driven (June)")
