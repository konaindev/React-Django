"""
A library of spreadsheet activators that take imported JSON data and push it
into our datastore.
"""

from ..kinds import SpreadsheetKind  # noqa
from .baseline_perf import BaselinePerfActivator
from .json_activators import CampaignPlanActivator


ACTIVATORS = {
    SpreadsheetKind.PERIODS: BaselinePerfActivator,
    SpreadsheetKind.CAMPAIGN: CampaignPlanActivator,
}


def get_activator_for_spreadsheet(spreadsheet):
    activator_class = ACTIVATORS.get(spreadsheet.kind)
    return activator_class(spreadsheet) if activator_class else None


__all__ = (get_activator_for_spreadsheet,)
