"""
A library of spreadsheet importers that provide critical data to Project
instances. Builds on top of our generic remark.lib.spreadsheets library.
"""
from .baseline_perf import BaselinePerfImporter


# TODO think about layercake here -Dave
def get_importer(kind, f):

    from remark.projects.models import Spreadsheet

    IMPORTERS_FOR_KIND = {Spreadsheet.KIND_PERIODS: BaselinePerfImporter}
    importer_class = IMPORTERS_FOR_KIND.get(kind)
    return importer_class(f) if importer_class is not None else None


__all__ = (get_importer, BaselinePerfImporter)

