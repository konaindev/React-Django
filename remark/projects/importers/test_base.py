import os
from django.test import TestCase

from .base import ProjectExcelImporter


class TestImporter(ProjectExcelImporter):
    pass


class TestVersionCheck(TestCase):
    TEST_FILE_NAME = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "../../../xls/examples/elcortez-baseline-perf.xlsx",
    )

    def test_pass(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "baseline_perf"
        importer.expected_version = 1
        self.assertTrue(importer.is_valid())

    def test_fail(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "nope"
        importer.expected_version = 0
        self.assertFalse(importer.is_valid())
        self.assertEqual(len(importer.errors), 1)
