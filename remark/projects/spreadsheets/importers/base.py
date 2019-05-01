from remark.lib.spreadsheets import ExcelImporter, find_row, StrCell, IntCell


def find_version(predicate):
    """Return a locator that scans the VERSION!A column for header values and returns values in VERSION!B"""
    return find_row("VERSION!A", predicate, target="B")


class ProjectExcelImporter(ExcelImporter):
    """
    An excel importer base class with tools specifically tailored to
    remarkably-style excel templates for projects.
    """

    expected_type = None
    expected_version = None

    SPREADSHEET_KIND = StrCell(find_version("spreadsheet_kind"))
    SPREADSHEET_VERSION = IntCell(find_version("spreadsheet_version"))

    def clean(self):
        """
        Clean a remarkably-style excel spreadsheet.
        """
        self.check_version()

    def check_version(self):
        """
        Validate the VERSION tab of the spreadsheet.
        """
        self.check_value(self.SPREADSHEET_KIND, expected=self.expected_type)
        self.check_value(self.SPREADSHEET_VERSION, expected=self.expected_version)
