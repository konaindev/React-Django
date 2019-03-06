import datetime

from remark.lib.metrics import BareMultiPeriod
from .periods import ComputedPeriod, DeltaPeriod
from .whiskers import WhiskerSeries


# Map from our internal flat values structure to the outward
# schema defined in BaslineReport.ts, etc, and expected props.
#
# CONSIDER stuff like this makes the mismatch between our backend
# very flat storage and our frontend visualization needs painfully
# apparent. Does it always need to be thus? -Dave
SCHEMA_MAP = {
    "property": {
        "monthly_average_rent": "monthly_average_rent",
        "lowest_monthly_rent": "lowest_monthly_rent",
        "cost_per_exe_vs_rent": "cost_per_exe_vs_lowest_monthly_rent",
        "leasing": {
            "change": "delta_leases",
            "cds": "lease_cds",
            "cd_rate": "lease_cd_rate",
            "renewal_notices": "lease_renewal_notices",
            "renewals": "lease_renewals",
            "renewal_rate": "renewal_rate",
            "resident_decisions": "resident_decisions",
            "vacation_notices": "lease_vacation_notices",
            "rate": "leased_rate",
            "units": "leased_units",
        },
        "occupancy": {
            "move_ins": "move_ins",
            "move_outs": "move_outs",
            "rate": "occupancy_rate",
            "units": "occupied_units",
            "occupiable": "occupiable_units",
        },
    },
    "funnel": {
        "volumes": {
            "usv": "usvs",
            "inq": "inquiries",
            "tou": "tours",
            "app": "lease_applications",
            "exe": "leases_executed",
        },
        "costs": {
            "usv": "cost_per_usv",
            "inq": "cost_per_inq",
            "tou": "cost_per_tou",
            "app": "cost_per_app",
            "exe": "cost_per_exe",
        },
        "conversions": {
            "usv_inq": "usv_inq_perc",
            "inq_tou": "inq_tou_perc",
            "tou_app": "tou_app_perc",
            "app_exe": "app_exe_perc",
            "usv_exe": "usv_exe_perc",
        },
    },
    "investment": {
        "acquisition": {
            "total": "acq_investment",
            "romi": "acq_romi",
            "estimated_revenue_gain": "estimated_acq_revenue_gain",
            "expenses": {
                "demand_creation": "acq_demand_creation",
                "leasing_enablement": "acq_leasing_enablement",
                "market_intelligence": "acq_market_intelligence",
                "reputation_building": "acq_reputation_building",
            },
        },
        "retention": {
            "total": "ret_investment",
            "romi": "ret_romi",
            "estimated_revenue_gain": "estimated_ret_revenue_gain",
            "expenses": {
                "demand_creation": "ret_demand_creation",
                "leasing_enablement": "ret_leasing_enablement",
                "market_intelligence": "ret_market_intelligence",
                "reputation_building": "ret_reputation_building",
            },
        },
        "total": {
            "total": "investment",
            "romi": "romi",
            "estimated_revenue_gain": "estimated_revenue_gain",
        },
    },
}


def recursive_map(d, fn):
    """
    Walk down a dictionary hierarchy recursively, calling the mapping function 
    on each leaf value. If the mapping function returns recrusive_map.DONT_INCLUDE,
    we don't include the key in the resulting dictionary at all. All other
    return values are included.
    """

    def _map(name, value):
        if isinstance(value, dict):
            mapped_value = recursive_map(value, fn)
        else:
            mapped_value = fn(value)
        return mapped_value

    result = {}
    for name, value in d.items():
        mapped = _map(name, value)
        if mapped != recursive_map.DONT_INCLUDE:
            result[name] = mapped
    return result


recursive_map.DONT_INCLUDE = "__DONT_INCLUDE__"


# Map from our internal flat target_* values structure to the outward
# schema defined in BaslineReport.ts, etc, and expected props.
TARGET_SCHEMA_MAP = recursive_map(SCHEMA_MAP, lambda source: f"target_{source}")


def unflatten(schema_map, flat):
    """
    Take a flattened period dictionary and explode it out into a schema.

    If a value is not found, raise an exception.    
    """
    return recursive_map(schema_map, lambda source: flat[source])


def unflatten_optional(schema_map, flat):
    """
    Take a flattened period dictionary and explode it out into a schema.
    
    If a value is not found, don't include it
    """

    def _map(source):
        raw = flat.get(source, None)
        return recursive_map.DONT_INCLUDE if raw is None else raw

    return recursive_map(schema_map, _map)


class Report:
    """
    The primary class for creating and representing a performance (or baseline)
    report. Builds on top of all other mechanisms (Metrics, ComputedPeriods, etc.) 
    in order to generate valid, complete data.
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

    @classmethod
    def has_time_delta_from_end(cls, project, time_delta, end=None):
        """
        Return True if it's possible to build a perf report for this project
        given the time_delta from end.
        """
        end = end or project.get_campaign_end()
        # Check if the project has a perf date range at all
        if end is None:
            return False

        # Make sure the project perf range starts *at or after* extant data.
        delta_start = end - time_delta
        return project.get_campaign_periods().filter(start__gte=delta_start).exists()

    @classmethod
    def for_time_delta_from_end(cls, project, time_delta, end=None):
        """
        Return a Report that covers the a time_delta span of time ending
        at the provided end date. If no end date is provided, the natural
        end date for the project is used.

        Return None if no such data exists.
        """
        if not cls.has_time_delta_from_end(project, time_delta, end=end):
            return None
        all_periods = project.get_campaign_periods()
        multiperiod = BareMultiPeriod.from_periods(all_periods)
        end = end or multiperiod.get_end()

        # Get the period under question (this will always be constructed)
        break_times = [end - time_delta, end]
        period = multiperiod.get_periods(*break_times)[0]

        # If the previous period lives within a sane tineframe, create it.
        previous_period = None
        previous_start = end - time_delta - time_delta
        if previous_start >= multiperiod.get_start():
            break_times = [previous_start, end - time_delta]
            previous_period = multiperiod.get_periods(*break_times)[0]

        whiskers = WhiskerSeries.build_weekly_series(project, multiperiod, end)

        return cls(project, period, previous_period, whiskers)

    @classmethod
    def has_last_weeks(cls, project, weeks):
        """
        Return True if it's possible to build a perf report for the past N weeks.
        """
        return cls.has_time_delta_from_end(
            project, time_delta=datetime.timedelta(weeks=weeks)
        )

    @classmethod
    def for_last_weeks(cls, project, weeks):
        """
        Return a Report that covers the project's last N weeks. This is the
        final weeks preceeding the end of the project's available period data.

        Return None if no such data exists.
        """
        return cls.for_time_delta_from_end(
            project, time_delta=datetime.timedelta(weeks=weeks)
        )

    @classmethod
    def has_dates(cls, project, start, end):
        """
        Return True if it's possible to build a perf report for these dates.
        """
        return cls.has_time_delta_from_end(project, time_delta=end - start, end=end)

    @classmethod
    def for_dates(cls, project, start, end):
        """
        Return a Report for an arbitrary set of dates.

        Return None if no such perf data exists in this span.
        """
        return cls.for_time_delta_from_end(project, time_delta=end - start, end=end)

    @classmethod
    def has_campaign_to_date(cls, project):
        """
        Return True if the project has perf campaign data.
        """
        return project.get_campaign_periods().exists()

    @classmethod
    def for_campaign_to_date(cls, project):
        """
        Return a Report that covers the project's entire campaign duration.

        Return None if no such data exists.
        """
        if not cls.has_campaign_to_date(project):
            return None
        all_periods = project.get_campaign_periods()
        multiperiod = BareMultiPeriod.from_periods(all_periods)
        break_times = [project.get_campaign_start(), project.get_campaign_end()]
        period = multiperiod.get_periods(*break_times)[0]
        whiskers = WhiskerSeries.build_weekly_series(
            project, multiperiod, break_times[-1]
        )
        return cls(project, period, previous_period=None, whiskers=whiskers)

    def __init__(self, project, period, previous_period=None, whiskers=None):
        self.project = project
        self.period = ComputedPeriod(period)
        self.whiskers = whiskers or {}
        if previous_period:
            previous_period = ComputedPeriod(previous_period)
            self.delta = DeltaPeriod(self.period, previous_period)
        else:
            self.delta = None

    def to_jsonable(self):
        """
        Return a structure that can be converted to a JSON string.

        This must match the schemee in our typescript.
        """
        dates = {"start": self.period.get_start(), "end": self.period.get_end()}

        flat_period_values = self.period.get_values()
        property_report = unflatten(SCHEMA_MAP, flat_period_values)

        # TODO implement this
        four_week_funnel_averages = {"usv": 0, "inq": 0, "tou": 0, "app": 0, "exe": 0}

        targets = unflatten_optional(TARGET_SCHEMA_MAP, flat_period_values)

        if self.delta is None:
            deltas = {}
        else:
            flat_delta_values = self.delta.get_values()
            deltas = unflatten_optional(SCHEMA_MAP, flat_delta_values)

        return dict(
            dates=dates,
            property_name=self.project.name,
            **property_report,
            targets=targets,
            four_week_funnel_averages=four_week_funnel_averages,
            whiskers=self.whiskers,
            deltas=deltas,
        )

