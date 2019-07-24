import itertools


from .common import CommonReport
from .periods import ComputedPeriod

from remark.lib.metrics import BareMultiPeriod, Weekday


class BaselineReport(CommonReport):
    """
    Provides Baseline report data (and the ability to ask whether such data
    exists) for a project.
    """

    def __init__(
        self, project, period, previous_period=None, whiskers=None, multiperiod=None
    ):
        super().__init__(
            project, period, previous_period=previous_period, whiskers=whiskers
        )
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
        return cls(project, baseline_period, multiperiod=multiperiod)

    @staticmethod
    def build_targets(period_values):
        """
        A baseline report is based on historical or past performance and
        thus is not tied to any campaign or model.
        As such, there should be no targets on the baseline report page.
        """
        return None

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

    def to_jsonable(self):
        data = super().to_jsonable()
        competitors = []
        for project in self.project.competitors.all():
            report = BaselineReport.for_baseline(project)
            if report:
                competitors.append(report.build_json_data())
        data["competitors"] = competitors
        return data
