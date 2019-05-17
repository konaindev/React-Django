import itertools
from datetime import timedelta


from .common import CommonReport
from .periods import ComputedPeriod

from remark.lib.math import avg_or_0
from remark.lib.metrics import BareMultiPeriod, Weekday


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
        four_week_computed_periods=None,
        multiperiod=None,
    ):
        super().__init__(
            project, period, previous_period=previous_period, whiskers=whiskers
        )
        self.four_week_computed_periods = four_week_computed_periods
        self.multiperiod = multiperiod

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
        baseline_target_periods = project.get_baseline_target_periods()
        multiperiod = BareMultiPeriod.from_periods(
            list(baseline_periods) + list(baseline_target_periods)
        )
        baseline_period = multiperiod.get_cumulative_period()
        only_funnel_multiperiod = multiperiod.only(
            "usvs",
            "inquiries",
            "tours",
            "lease_applications",
            "leases_executed",
            "acq_reputation_building",
            "acq_demand_creation",
            "acq_leasing_enablement",
            "acq_market_intelligence",
            "ret_reputation_building",
            "ret_demand_creation",
            "ret_leasing_enablement",
            "ret_market_intelligence",
        )
        four_week_periods = only_funnel_multiperiod.get_delta_periods(
            time_delta=timedelta(weeks=4), after_end=False
        )
        four_week_computed_periods = \
            [ComputedPeriod(p) for p in four_week_periods]

        return cls(
            project,
            baseline_period,
            four_week_computed_periods=four_week_computed_periods,
            multiperiod=multiperiod,
        )

    def build_four_week_averages(self):
        def _avg(name):
            return round(
                avg_or_0([getattr(p, name) for p in self.four_week_computed_periods])
            )

        return {
            "usv": _avg("usvs"),
            "inq": _avg("inquiries"),
            "tou": _avg("tours"),
            "app": _avg("lease_applications"),
            "exe": _avg("leases_executed"),
            "investment": _avg("investment"),
            "acq_investment": _avg("acq_investment"),
            "ret_investment": _avg("ret_investment"),
        }

    def build_funnel_history(self):
        if self.multiperiod is None:
            return []

        key_map_for_volumes = {
            "usv": "usvs",
            "inq": "inquiries",
            "tou": "tours",
            "app": "lease_applications",
            "exe": "leases_executed",
        }
        key_map_for_conversions = {
            "usv_inq": "usv_inq_perc",
            "inq_tou": "inq_tou_perc",
            "tou_app": "tou_app_perc",
            "app_exe": "app_exe_perc",
            "usv_exe": "usv_exe_perc",
        }

        funnel_history = []

        week_periods = self.multiperiod.get_week_periods(
            weekday=Weekday.MONDAY, precise_start=True, precise_end=True
        )

        week_periods_by_month = itertools.groupby(
            week_periods, lambda period: period.get_start().__format__("%Y-%m")
        )

        for month, week_periods_grouper in week_periods_by_month:
            week_periods = list(week_periods_grouper)

            month_period = BareMultiPeriod.from_periods(week_periods)
            cumulative_month_period = month_period.get_cumulative_period()
            computed_period = ComputedPeriod(cumulative_month_period)
            month_values = computed_period.get_values()

            week_values_list = []
            for week_period in week_periods:
                computed_period = ComputedPeriod(week_period)
                week_values_list.append(computed_period.get_values())

            month_funnel = dict(
                month=month,
                monthly_volumes={
                    new_key: month_values[old_key]
                    for new_key, old_key in key_map_for_volumes.items()
                },
                monthly_conversions={
                    new_key: month_values[old_key]
                    for new_key, old_key in key_map_for_conversions.items()
                },
                weekly_volumes={
                    new_key: [week_values[old_key] for week_values in week_values_list]
                    for new_key, old_key in key_map_for_volumes.items()
                },
                weekly_conversions={
                    new_key: [week_values[old_key] for week_values in week_values_list]
                    for new_key, old_key in key_map_for_conversions.items()
                },
            )

            funnel_history.append(month_funnel)

        return funnel_history
