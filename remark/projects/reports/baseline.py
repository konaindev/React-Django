from .common import CommonReport
from .periods import ComputedPeriod

from remark.lib.metrics import BareMultiPeriod


HACK_BASELINE_OVERRIDES = {
    # Meridian SLC -- override computed props
    "pro_nqcu73oiinomuvn7": {"leased_units": 162},
    # El Cortez
    "pro_xujf7pnznggt5dny": {"leased_units": 113, "occupiable_units": 158},
    # Lincoln Example
    # "pro_eekgau8mfkbc34iq": {"leased_units": 456},
}


class BaselineReport(CommonReport):
    """
    Provides Baseline report data (and the ability to ask whether such data
    exists) for a project.
    """

    def build_computed_period(self, period):
        overrides = HACK_BASELINE_OVERRIDES.get(self.project.public_id)
        return ComputedPeriod(period, overrides=overrides)

    @classmethod
    def has_baseline(cls, project):
        """
        Return True if it's possible to build a baseline report for this project.
        """
        return project.get_baseline_periods().exists()

    @classmethod
    def for_baseline(cls, project):
        """
        Return a Report that strictly covers the project's baseline period.

        Return None if no baseline data exists.
        """
        if not cls.has_baseline(project):
            return None
        baseline_periods = project.get_baseline_periods()
        multiperiod = BareMultiPeriod.from_periods(baseline_periods)
        baseline_period = multiperiod.get_cumulative_period()
        return cls(project, baseline_period)

