"""
A library of spreadsheet importers that provide critical data to Project
instances. Builds on top of our generic remark.lib.spreadsheets library.
"""
from .baseline_perf import BaselinePerfImporter


class SpreadsheetKind:
    KIND_PERIODS = "periods"  # Baseline and perf periods spreadsheet
    KIND_MODELING = "modeling"  # Modeling report (any kind)
    KIND_MARKET = "market"  # TAM
    KIND_CAMPAIGN = "campaign"  # Campaign Plan

    CHOICES = [
        (KIND_PERIODS, "Periods"),
        (KIND_MODELING, "Modeling (must provide a subkind, too)"),
        (KIND_MARKET, "Market Report"),
        (KIND_CAMPAIGN, "Campaign Plan"),
    ]

    IMPORTERS = {KIND_PERIODS: BaselinePerfImporter}


def get_importer_for_kind(kind, f):
    importer_class = SpreadsheetKind.IMPORTERS.get(kind)
    return importer_class(f) if importer_class is not None else None


__all__ = (SpreadsheetKind, get_importer_for_kind, BaselinePerfImporter)

