"""
Defines the CommonReport base, which is capable of producing
Baseline-like, Performance-like, and Modeling-section-like reports.
"""
from . import ReportBase
from .periods import ComputedPeriod, DeltaPeriod

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


class CommonReport(ReportBase):
    """
    A lot of our reports (Baseline, Performance, parts of Modeling) have the
    same structure. CommonReport provides tools for generating this structure
    from our underlying data.

    Builds on top of all other mechanisms (Metrics, ComputedPeriods, etc.) 
    in order to generate valid, complete data.
    """

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

