from django.test import TestCase

from .campaign_plan import CampaignPlanImporter
from .test_base import SpreadsheetFileTestCaseMixin


class CampaignPlanTestCase(SpreadsheetFileTestCaseMixin, TestCase):
    importer_class = CampaignPlanImporter
    spreadsheet_file_name = "campaign-plan.xlsx"
    schema_file_name = "campaign-plan.schema.json"

    def test_example_data(self):
        """Sanity check a small amount of data from the imported sheet."""
        super().test_example_data()
        self.assertEqual(self.importer.cleaned_data["meta"]["campaign_days"], 63)
