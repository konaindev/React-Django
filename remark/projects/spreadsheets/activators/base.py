class ActivationError(Exception):
    pass


class ActivatorBase:
    # Derived classes should specify this.
    spreadsheet_kind = None

    def __init__(self, spreadsheet):
        self.spreadsheet = spreadsheet
        self.project = spreadsheet.project
        self.data = spreadsheet.imported_data
        self.check_preconditions()

    def check_preconditions(self):
        # Check that the spreadsheet kind matches the expectation
        if self.spreadsheet_kind != self.spreadsheet.kind:
            raise ActivationError(
                f"Attempted to activate the wrong type of spreadsheet: got '{self.spreadsheet.kind}' but expected '{self.spreadsheet_kind}'"
            )

        # Check that the spreadsheet has imported data
        if not self.spreadsheet.has_imported_data():
            raise ActivationError(
                f"Attempted to activate a spreadsheet without imported data."
            )

    def activate(self):
        raise NotImplementedError("Derived classes should implement activate!")

