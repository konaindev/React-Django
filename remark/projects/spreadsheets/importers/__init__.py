"""
A library of spreadsheet importers that provide critical data to Project
instances. Builds on top of our generic remark.lib.spreadsheets library.
"""
from ..kinds import SpreadsheetKind
from .baseline_perf import BaselinePerfImporter
from .campaign_plan import CampaignPlanImporter
from .modeling import ModelingImporter
from .market import MarketImporter


IMPORTERS = {
    SpreadsheetKind.CAMPAIGN: CampaignPlanImporter,
    SpreadsheetKind.MARKET: MarketImporter,
    SpreadsheetKind.MODELING: ModelingImporter,
    SpreadsheetKind.PERIODS: BaselinePerfImporter,
}


def get_importer_for_kind(kind, f):
    importer_class = IMPORTERS.get(kind)
    return importer_class(f) if importer_class is not None else None


__all__ = (get_importer_for_kind,)

