from remark.lib.spreadsheets import ExcelImporter, SchemaCell, DataType, loc


class ProjectExcelImporter(ExcelImporter):
    """
    An excel importer base class with tools specifically tailored to
    remarkably-style excel templates for projects.
    """

    expected_type = None
    expected_version = None

    SPREADSHEET_TYPE_SCELL = SchemaCell(loc("VERSION!B1"), DataType.STRING, str)
    SPREADSHEET_VERSION_SCELL = SchemaCell(loc("VERSION!B2"), DataType.NUMERIC, int)

    def clean(self):
        """
        Clean a remarkably-style excel spreadsheet.
        """
        self.check_version()

    def check_version(self):
        """
        Validate the VERSION tab of the spreadsheet.
        """
        self.check_schema_value(
            self.SPREADSHEET_TYPE_SCELL, expected=self.expected_type
        )
        self.check_schema_value(
            self.SPREADSHEET_VERSION_SCELL, expected=self.expected_version
        )
