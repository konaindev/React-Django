"""
A library of spreadsheet importers that provide critical data to Project
instances. Builds on top of our generic remark.lib.spreadsheets library.
"""
from ..kinds import SpreadsheetKind
from .baseline_perf import BaselinePerfImporter
from .campaign_plan import CampaignPlanImporter
from .market import MarketImporter


IMPORTERS = {
    SpreadsheetKind.PERIODS: BaselinePerfImporter,
    SpreadsheetKind.CAMPAIGN: CampaignPlanImporter,
    SpreadsheetKind.MARKET: MarketImporter,
}


def get_importer_for_kind(kind, f):
    importer_class = IMPORTERS.get(kind)
    return importer_class(f) if importer_class is not None else None


__all__ = (get_importer_for_kind,)

