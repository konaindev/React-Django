"""
A library of spreadsheet utilities that are specific to Remarkably projects.
Builds on top of our more generic remark.lib.spreadsheets.* package.

See the README.md in this directory for a bit more color.
"""
from .activators import get_activator_for_spreadsheet
from .exporters import get_exporter_for_kind
from .importers import get_importer_for_kind
from .kinds import SpreadsheetKind


__all__ = (
    get_activator_for_spreadsheet,
    get_exporter_for_kind,
    get_importer_for_kind,
    SpreadsheetKind,
)
