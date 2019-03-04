import datetime

from .periods import ComputedPeriod


# TODO this should be considered temporary/scratch code


class WhiskerSeries:
    """
    Utility class for generating a named time series used in a whisker plot.
    """

    # TODO This whisker stuff will need a lot more thought in the near-term. -Dave

    # Mapping from the target metric name to the name of its dependencies.
    # This is primarily used for performance; we can kill it if it's annoying.
    # TODO can we generate this automagically in the future? -Dave
    WHISKER_METRICS = {
        ("leased_rate", "leased_rate"): [
            "leased_units_start",
            "occupiable_units_start",
            "leases_executed",
            "leases_ended",
        ],
        ("renewal_rate", "renewal_rate"): [
            "lease_renewal_notices",
            "leases_due_to_expire",
        ],
        ("occupancy_rate", "occupancy_rate"): [
            "occupied_units_start",
            "move_ins",
            "move_outs",
            "occupiable_units_start",
        ],
        ("investment", "investment"): [
            "acq_reputation_building",
            "acq_demand_creation",
            "acq_leasing_enablement",
            "acq_market_intelligence",
            "ret_reputation_building",
            "ret_demand_creation",
            "ret_leasing_enablement",
            "ret_market_intelligence",
        ],
        ("usv_exe_perc", "usv_exe"): ["leases_executed", "usvs"],
        ("lease_cd_rate", "lease_cd_rate"): ["lease_cds", "lease_applications"],
        ("cost_per_exe_vs_monthly_average_rent", "cost_per_exe_vs_rent"): [
            "acq_reputation_building",
            "acq_demand_creation",
            "acq_leasing_enablement",
            "acq_market_intelligence",
            "monthly_average_rent",
            "leases_executed",
        ],
    }

    WHISKER_SOURCE_METRICS = list(
        set(
            [
                source_metric
                for _, source_metrics in WHISKER_METRICS.items()
                for source_metric in source_metrics
            ]
        )
    )

    @classmethod
    def build_weekly_series(cls, project, mutliperiod, end):
        """
        Return a dictionary mapping a target metric name to a time-ordered series of values
        for that target metric.
        """
        # XXX this whole WhiskerSeries class exposes totally weird API at the moment.
        # I dunno what it should *actually* look like, but this doesn't feel like it! -Dave
        campaign_start = project.get_campaign_start()
        whisker_mp = mutliperiod.only(*cls.WHISKER_SOURCE_METRICS)
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
            for attr_target_metric, public_target in cls.WHISKER_METRICS.keys()
        }
        return weekly_series

