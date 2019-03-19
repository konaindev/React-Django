from datetime import timedelta

from .common import CommonReport
from .periods import ComputedPeriod

from remark.lib.math import avg_or_0
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

    def __init__(
        self,
        project,
        period,
        previous_period=None,
        whiskers=None,
        four_week_funnel_values=None,
    ):
        super().__init__(
            project, period, previous_period=previous_period, whiskers=whiskers
        )
        self.four_week_funnel_values = four_week_funnel_values

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
        only_funnel_multiperiod = multiperiod.only(
            "usvs", "inquiries", "tours", "lease_applications", "leases_executed"
        )
        four_week_periods = only_funnel_multiperiod.get_delta_periods(
            time_delta=timedelta(weeks=4), after_end=False
        )
        four_week_funnel_values = [fwp.get_values() for fwp in four_week_periods]
        return cls(
            project, baseline_period, four_week_funnel_values=four_week_funnel_values
        )

    def build_computed_period(self, period):
        overrides = HACK_BASELINE_OVERRIDES.get(self.project.public_id)
        return ComputedPeriod(period, overrides=overrides)

    def build_four_week_averages(self):
        def _avg(name):
            return round(
                avg_or_0([fwfv[name] for fwfv in self.four_week_funnel_values])
            )

        return {
            "usv": _avg("usvs"),
            "inq": _avg("inquiries"),
            "tou": _avg("tours"),
            "app": _avg("lease_applications"),
            "exe": _avg("leases_executed"),
        }
