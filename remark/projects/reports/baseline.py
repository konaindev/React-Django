from .common import CommonReport

from remark.lib.metrics import BareMultiPeriod


class BaselineReport(CommonReport):
    """
    Provides Baseline report data (and the ability to ask whether such data
    exists) for a project.
    """

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
