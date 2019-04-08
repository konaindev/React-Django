"""
A library of spreadsheet importers that provide critical data to Project
instances. Builds on top of our generic remark.lib.spreadsheets library.
"""
from .baseline_perf import BaselinePerfImporter


class SpreadsheetKind:
    PERIODS = "periods"  # Baseline and perf periods spreadsheet
    MODELING = "modeling"  # Modeling report (any kind)
    MARKET = "market"  # TAM
    CAMPAIGN = "campaign"  # Campaign Plan

    CHOICES = [
        (PERIODS, "Periods"),
        (MODELING, "Modeling (must provide a subkind, too)"),
        (MARKET, "Market Report"),
        (CAMPAIGN, "Campaign Plan"),
    ]

    IMPORTERS = {PERIODS: BaselinePerfImporter}


def get_importer_for_kind(kind, f):
    importer_class = SpreadsheetKind.IMPORTERS.get(kind)
    return importer_class(f) if importer_class is not None else None


__all__ = (SpreadsheetKind, get_importer_for_kind, BaselinePerfImporter)

