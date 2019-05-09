"""
A library of spreadsheet exporters that build spreadsheets from Project data. 
Builds on top of our generic remark.lib.spreadsheets library.
"""

# flake8: noqa

from ..kinds import SpreadsheetKind  # noqa

# TODO coming soon!
EXPORTERS = {}


def get_exporter_for_kind(project, kind):
    exporter_class = EXPORTERS.get(kind)
    return exporter_class(project, kind) if exporter_class else None

