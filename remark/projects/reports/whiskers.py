import datetime

from .periods import ComputedPeriod


# TODO this should be considered temporary/scratch code


class WhiskerSeries:
    """
    Utility class for generating a named time series used in a whisker plot.
    """

    WHISKER_METRICS = [
        ("leased_rate", "leased_rate"),
        ("renewal_rate", "renewal_rate"),
        ("occupancy_rate", "occupancy_rate"),
        ("investment", "investment"),
        ("usv_exe_perc", "usv_exe"),
        ("lease_cd_rate", "lease_cd_rate"),
        ("cost_per_exe_vs_lowest_monthly_rent", "cost_per_exe_vs_rent"),
    ]

    @classmethod
    def build_weekly_series(cls, project, mutliperiod, end):
        """
        Return a dictionary mapping a target metric name to a time-ordered series of values
        for that target metric.
        """
        # XXX this whole WhiskerSeries class exposes totally weird API at the moment.
        # I dunno what it should *actually* look like, but this doesn't feel like it! -Dave
        campaign_start = project.get_campaign_start()
        whisker_mp = mutliperiod
        whisker_periods = whisker_mp.get_delta_periods(
            time_delta=datetime.timedelta(weeks=4)
        )
        computed_periods = [
            ComputedPeriod(whisker_period)
            for whisker_period in whisker_periods
            if whisker_period.get_start() >= campaign_start
            and whisker_period.get_end() <= end
        ]
        weekly_series = {
            public_target: [
                getattr(computed_period, attr_target_metric)
                for computed_period in computed_periods
            ]
            for attr_target_metric, public_target in cls.WHISKER_METRICS
        }
        return weekly_series

