class ReportBase:
    """Abstract base class for all reports."""

    # CONSIDER Eventually I assume we'll do more here? -Dave

    def to_jsonable(self):
        """Returns data that can be serialized to JSON."""
        # Derived classes must implement this.
        raise NotImplementedError()
