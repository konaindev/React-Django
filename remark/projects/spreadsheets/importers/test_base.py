import json
import os
import warnings

import jsonschema


from django.core.serializers.json import DjangoJSONEncoder
from django.test import TestCase

from .base import ProjectExcelImporter


class TestImporter(ProjectExcelImporter):
    pass


class TestVersionCheck(TestCase):
    TEST_FILE_NAME = os.path.join(
        os.path.abspath(os.path.dirname(__file__)),
        "../../../../xls/examples/elcortez-baseline-perf.xlsx",
    )

    def test_pass(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "baseline_perf"
        importer.expected_version = 1
        self.assertTrue(importer.is_valid({}))

    def test_fail(self):
        importer = TestImporter(self.TEST_FILE_NAME)
        importer.expected_type = "nope"
        importer.expected_version = 0
        self.assertFalse(importer.is_valid({}))
        self.assertEqual(len(importer.errors), 1)


class SpreadsheetFileTestCaseMixin:
    """
    Utilities for testing an importer based on a file and associated schema.
    """

    # The importer class under consideration
    importer_class = None

    # The name of the .xlsx file used in the test; this must be
    # in the test/ subdirectory.
    spreadsheet_file_name = None

    # The name of the .schema.json file used in the test; this must
    # be in the test/ subdirectory.
    schema_file_name = None

    def get_absolute_test_file_name(self, relative_name):
        return os.path.join(
            os.path.abspath(os.path.dirname(__file__)), f"./test/{relative_name}"
        )

    def get_absolute_spreadsheet_file_name(self):
        return self.get_absolute_test_file_name(self.spreadsheet_file_name)

    def get_absolute_schema_file_name(self):
        return self.get_absolute_test_file_name(self.schema_file_name)

    def setUpImporter(self):
        # openpyxl emits a bunch of warnings we don't care about in our tests.
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")

            # import and perform first pass at validation.
            self.importer = self.importer_class(
                self.get_absolute_spreadsheet_file_name()
            )
            if not self.importer.is_valid({}):
                raise self.importer.errors[0]

    def setUpSchema(self):
        with open(self.get_absolute_schema_file_name(), "rt") as schema_file:
            self.schema = json.load(schema_file)

    def setUp(self):
        super().setUp()
        self.setUpImporter()
        self.setUpSchema()

    def test_example_data(self):
        """
        Sanity check by validating at least a little of the imported data.

        Derived classes can override this, calling super(), to implement a 
        custom test to sanity check imported data.
        """
        # We could put generic sanity tests here.
        pass

    def test_schema_valid(self):
        """
        Validate that this importer, on the example spreadsheet, produces
        correct schema valid data.
        """
        json_string = DjangoJSONEncoder().encode(self.importer.cleaned_data)
        decoded_jsonable = json.loads(json_string)
        jsonschema.validate(instance=decoded_jsonable, schema=self.schema)
