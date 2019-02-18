import datetime
import decimal

from remark.lib.computed import computed_value, ComputedValueMixin
from remark.lib.math import (
    sum_or_0,
    sum_or_none,
    sub_or_none,
    mult_or_0,
    mult_or_none,
    d_div_or_0,
    d_div_or_none,
    d_quant,
    d_quant_perc,
    d_quant_currency,
    round_or_none,
)
from remark.lib.metrics import BareMultiPeriod


class ComputedPeriod(ComputedValueMixin):
    """
    Implements all computed properties for a single project Period.

    Also surfaces the raw contents of the underlying Period and -- like
    the Period model itself -- acts as a metrics PeriodBase.
    """

    # NOTE this exists mostly to reduce the amount of noise in the Period
    # model class itself. This might be unnatural; it might just be better
    # to move all computations into the model directly. -Dave
    def __init__(self, period):
        self.period = period

    # ------------------------------------------------------
    # Logical activity (lease)
    # ------------------------------------------------------

    @computed_value
    def delta_leases(self):
        """The net number of new leases obtained during the period."""
        return self.leases_executed - self.leases_ended

    @computed_value
    def occupiable_units(self):
        """The total number of occupiable units in effect at the end of the period."""
        # This doesn't change throughout the period.
        return self.occupiable_units_start

    @computed_value
    def leased_units(self):
        """The total number of leases in effect at the end of the period."""
        return sum_or_0(self.leased_units_start, self.delta_leases)

    @computed_value
    def leased_rate(self):
        """The percentage of leasable units that are actually leased at end of period."""
        return d_quant_perc(d_div_or_0(self.leased_units, self.occupiable_units))

    @computed_value
    def renewal_rate(self):
        """The percentage of lease renewals as a total of leases due to expire."""
        # XXX I'm utterly unconvinced that this is a sensible metric, but it is
        # specified in Sprint 1. -Dave
        return d_quant_perc(
            d_div_or_0(self.lease_renewal_notices, self.leases_due_to_expire)
        )

    @computed_value
    def lease_cd_rate(self):
        """The percentage of lease cancellations as a total of lease applications."""
        # XXX this also seems like a nonsense number to me. -Dave
        return d_quant_perc(d_div_or_0(self.lease_cds, self.lease_applications))

    # ------------------------------------------------------
    # TARGETS: Logical activity (lease)
    # ------------------------------------------------------

    @computed_value
    def target_leased_units(self):
        """The target number of leased units we'd like to achieve."""
        return d_quant(
            mult_or_none(self.target_lease_percent, self.occupiable_units),
            decimal.Decimal(1),
            decimal.ROUND_HALF_UP,
        )

    @computed_value
    def target_renewal_rate(self):
        """The target number of leased units we'd like to achieve."""
        return d_quant_perc(
            d_div_or_none(
                self.target_lease_renewal_notices, self.target_leases_due_to_expire
            )
        )

    # ------------------------------------------------------
    # Physical activity (occupancy)
    # ------------------------------------------------------

    @computed_value
    def occupied_units(self):
        """The total occupancy in effect at the end of the period."""
        return self.occupied_units_start + self.move_ins - self.move_outs

    @computed_value
    def occupancy_rate(self):
        """The percentage of occupiable units that are actually occupied at end of period."""
        return d_quant_perc(d_div_or_0(self.occupied_units, self.occupiable_units))

    # ------------------------------------------------------
    # TARGETS: Physical activity (occupancy)
    # ------------------------------------------------------

    @computed_value
    def target_occupied_units(self):
        """Return the target number of occupiable units."""
        # NOTE for now, we simply assume this is the same as the target leased units.
        return self.target_leased_units

    @computed_value
    def target_occupancy_rate(self):
        """The target percentage of occupiable units that are actually occupied at end of period."""
        return d_quant_perc(
            d_div_or_none(self.target_occupied_units, self.occupiable_units)
        )

    # ------------------------------------------------------
    # Investment
    # ------------------------------------------------------

    @computed_value
    def acq_investment(self):
        """The total acqusition investment (in dollars)."""
        return (
            self.acq_reputation_building
            + self.acq_demand_creation
            + self.acq_leasing_enablement
            + self.acq_market_intelligence
        )

    @computed_value
    def ret_investment(self):
        """The total retention investment (in dollars)."""
        return (
            self.ret_reputation_building
            + self.ret_demand_creation
            + self.ret_leasing_enablement
            + self.ret_market_intelligence
        )

    @computed_value
    def investment(self):
        """The total investment (in dollars)."""
        return self.acq_investment + self.ret_investment

    @computed_value
    def estimated_acq_revenue_gain(self):
        """
        Return an estimate of how much new annualk revenue will be obtained on the 
        basis of this period's acquisition funnel outcomes.
        """
        return mult_or_0(self.delta_leases, self.monthly_average_rent, 12)

    @computed_value
    def estimated_ret_revenue_gain(self):
        """
        Return an estimate of how much new annual revenue will be obtained on the 
        basis of this period's acquisition funnel outcomes.
        """
        return mult_or_0(self.lease_renewals, self.monthly_average_rent, 12)

    @computed_value
    def estimated_revenue_gain(self):
        """
        Return an estimate of how much new annual revenue will be obtained
        on the basis of this period's full investment.
        """
        return sum_or_0(
            self.estimated_acq_revenue_gain, self.estimated_ret_revenue_gain
        )

    @computed_value
    def acq_romi(self):
        """
        Return an estimate of how effective acquisition spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        return round(d_div_or_0(self.estimated_acq_revenue_gain, self.acq_investment))

    @computed_value
    def ret_romi(self):
        """
        Return an estimate of how effective retention spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        return round(d_div_or_0(self.estimated_ret_revenue_gain, self.ret_investment))

    @computed_value
    def romi(self):
        """
        Return an estimate of how effective marketing spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        acq_weight = d_div_or_0(self.acq_investment, self.investment)
        ret_weight = decimal.Decimal(1) - acq_weight
        weighted_acq_romi = mult_or_0(self.acq_romi, acq_weight)
        weighted_ret_romi = mult_or_0(self.ret_romi, ret_weight)
        return round(sum_or_0(weighted_acq_romi, weighted_ret_romi))

    # ------------------------------------------------------
    # TARGETS: Investment
    # ------------------------------------------------------

    @computed_value
    def target_investment(self):
        """The target total investment (in dollars)."""
        return sum_or_none(self.target_acq_investment, self.target_ret_investment)

    @computed_value
    def target_estimated_acq_revenue_gain(self):
        """The target estimated acquisition leasing revenue gain."""
        return mult_or_none(self.target_delta_leases, self.monthly_average_rent, 12)

    @computed_value
    def target_estimated_ret_revenue_gain(self):
        """The target estimated ret leasing revenue gain."""
        return mult_or_none(self.target_lease_renewals, self.monthly_average_rent, 12)

    @computed_value
    def target_estimated_revenue_gain(self):
        """The target estimated total leasing revenue gain."""
        return sum_or_none(
            self.target_estimated_acq_revenue_gain,
            self.target_estimated_ret_revenue_gain,
        )

    @computed_value
    def target_acq_romi(self):
        """The target acquisition ROMI"""
        d_target = d_div_or_none(
            self.target_estimated_acq_revenue_gain, self.target_acq_investment
        )
        return round_or_none(d_target)

    @computed_value
    def target_ret_romi(self):
        """The target retention ROMI"""
        d_target = d_div_or_none(
            self.target_estimated_ret_revenue_gain, self.target_ret_investment
        )
        return round_or_none(d_target)

    @computed_value
    def target_romi(self):
        """The overall target ROMI"""
        total_target_romi = sum_or_none(self.target_acq_romi, self.target_ret_romi)
        avg_target_romi = d_div_or_none(total_target_romi, 2)
        return round_or_none(avg_target_romi)

    # ------------------------------------------------------
    # Acquisition Funnel
    # ------------------------------------------------------

    @computed_value
    def usv_inq_perc(self):
        """The conversation rate from usvs to inquiries."""
        return d_quant_perc(d_div_or_0(self.inquiries, self.usvs))

    @computed_value
    def inq_tou_perc(self):
        """The conversion rate from inquiries to tours."""
        return d_quant_perc(d_div_or_0(self.tours, self.inquiries))

    @computed_value
    def tou_app_perc(self):
        """The conversion rate from tours to lease applications."""
        return d_quant_perc(d_div_or_0(self.lease_applications, self.tours))

    @computed_value
    def app_exe_perc(self):
        """The conversion rate from lease applications to executions."""
        return d_quant_perc(d_div_or_0(self.leases_executed, self.lease_applications))

    @computed_value
    def usv_exe_perc(self):
        """The conversation rate from usvs to lease executions."""
        return d_quant_perc(d_div_or_0(self.leases_executed, self.usvs))

    # ------------------------------------------------------
    # TARGETS: Acquisition Funnel
    # ------------------------------------------------------

    @computed_value
    def target_usv_inq_perc(self):
        """The conversation rate from usvs to inquiries."""
        return d_quant_perc(d_div_or_none(self.target_inquiries, self.target_usvs))

    @computed_value
    def target_inq_tou_perc(self):
        """The conversion rate from inquiries to tours."""
        return d_quant_perc(d_div_or_none(self.target_tours, self.target_inquiries))

    @computed_value
    def target_tou_app_perc(self):
        """The conversion rate from tours to lease applications."""
        return d_quant_perc(
            d_div_or_none(self.target_lease_applications, self.target_tours)
        )

    @computed_value
    def target_app_exe_perc(self):
        """The conversion rate from lease applications to executions."""
        return d_quant_perc(
            d_div_or_none(self.target_leases_executed, self.target_lease_applications)
        )

    @computed_value
    def target_usv_exe_perc(self):
        """The conversation rate from usvs to lease executions."""
        return d_quant_perc(
            d_div_or_none(self.target_leases_executed, self.target_usvs)
        )

    # ------------------------------------------------------
    # Funnel Costs
    # ------------------------------------------------------

    @computed_value
    def cost_per_usv(self):
        """Return the estimated cost to obtain a unique site visitor in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.usvs))

    @computed_value
    def cost_per_inq(self):
        """Return the estimated cost to obtain an inbound inquiry in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.inquiries))

    @computed_value
    def cost_per_tou(self):
        """Return the estimated cost to obtain an inbound tour in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.tours))

    @computed_value
    def cost_per_app(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(
            d_div_or_0(self.acq_investment, self.lease_applications)
        )

    @computed_value
    def cost_per_exe(self):
        """Return the estimated cost to obtain a lease execution in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.leases_executed))

    @computed_value
    def cost_per_exe_vs_monthly_average_rent(self):
        """Return the percentage of the monthly rent required to get a lease execution."""
        return d_quant_perc(d_div_or_0(self.cost_per_exe, self.monthly_average_rent))

    # ------------------------------------------------------
    # TARGETS: Funnel Costs
    # ------------------------------------------------------

    @computed_value
    def target_cost_per_usv(self):
        """Return the target cost to obtain a unique site visitor in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_usvs)
        )

    @computed_value
    def target_cost_per_inq(self):
        """Return the estimated cost to obtain an inbound inquiry in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_inquiries)
        )

    @computed_value
    def target_cost_per_tou(self):
        """Return the estimated cost to obtain an inbound tour in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_tours)
        )

    @computed_value
    def target_cost_per_app(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_lease_applications)
        )

    @computed_value
    def target_cost_per_exe(self):
        """Return the estimated cost to obtain a lease execution in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_leases_executed)
        )

    @computed_value
    def target_cost_per_exe_vs_monthly_average_rent(self):
        """Return the target percentage of the monthly rent required to get a lease execution."""
        return d_quant_perc(
            d_div_or_none(self.target_cost_per_exe, self.monthly_average_rent)
        )

    # ------------------------------------------------------
    # Forwarding implementations to the underlying Period
    # ------------------------------------------------------

    def __getattr__(self, name):
        """
        For convenience, return all values on the underlying period.

        Raise an exception if *that* isn't found.
        """
        return self.period.get_value(name)

    # TODO these methods demonstrate that ComputedPeriod is kinda-sorta a PeriodBase.
    # But PeriodBase requires exposure of Metric and Value instances, neither of
    # which strictly makes sense for the @computed_properties. Maybe I need to loosen
    # some restrictions? -Dave

    def get_start(self):
        return self.period.get_start()

    def get_end(self):
        return self.period.get_end()

    def get_values(self):
        """
        Return a mapping from metric names to (lowercase) values.
        """
        underlying_values = self.period.get_values()
        computed_values = self.get_computed_values()
        return dict(**underlying_values, **computed_values)


class PeriodDelta:
    """
    A delta between two underlying periods. The two periods must have
    identical timespans. Metrics not found on both periods are ignored.
    """

    # TODO figure out how much of this actually belongs in lib/metrics.py. -Dave
    def __init__(self, lhs, rhs):
        self.lhs = lhs
        self.rhs = rhs

    def get_lhs_start(self):
        return self.lhs.get_start()

    def get_lhs_end(self):
        return self.lhs.get_end()

    def get_rhs_start(self):
        return self.rhs.get_start()

    def get_rhs_end(self):
        return self.rhs.get_end()

    def _build_values(self):
        """
        Return a mapping from delta metric names to (lowercase) delta values.
        """
        lhs_values = self.lhs.get_values()
        rhs_values = self.rhs.get_values()
        names = set(lhs_values.keys()) & set(rhs_values.keys())
        self._values = {
            f"delta_{name}": sub_or_none(lhs_values[name], rhs_values[name])
            for name in names
        }

    def _ensure_values(self):
        if not hasattr(self, "_values"):
            self._build_values()

    def get_values(self):
        self._ensure_values()
        return dict(self._values)


class Report:
    @classmethod
    def for_baseline(cls, project):
        """
        Return a Report that strictly covers the project's baseline period.
        """
        period = project.get_baseline_period()
        return cls(period)

    @classmethod
    def for_time_delta_from_end(cls, project, time_delta, end=None):
        """
        Return a Report that covers the a time_delta span of time ending
        at the provided end date. If no end date is provided, the natural
        end date for the project is used.
        """
        all_periods = project.get_periods()
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

        return cls(period, previous_period)

    @classmethod
    def for_last_weeks(cls, project, weeks):
        """
        Return a Report that covers the project's last N weeks. This is the
        final weeks preceeding the end of the project's available period data.
        """
        return cls.for_time_delta_from_end(
            project, time_delta=datetime.timedelta(weeks=weeks)
        )

    @classmethod
    def for_dates(cls, project, start, end):
        """
        Return a Report for an arbitrary set of dates.
        """
        return cls.for_time_delta_from_end(project, time_delta=end - start, end=end)

    @classmethod
    def for_campaign_to_date(cls, project):
        """
        Return a Report that covers the project's entire campaign duration.
        """
        all_periods = project.get_periods()
        multiperiod = BareMultiPeriod.from_periods(all_periods)
        break_times = [project.get_campaign_start(), project.get_campaign_end()]
        period = multiperiod.get_periods(*break_times)[0]
        return cls(period)

    def __init__(self, period, previous_period=None):
        self.period = ComputedPeriod(period)
        if previous_period:
            previous_period = ComputedPeriod(previous_period)
            self.delta = PeriodDelta(self.period, previous_period)
        else:
            self.delta = None

    def to_jsonable(self):
        """
        Return a structure that can be converted to a JSON string.
        """
        period_values = self.period.get_values()
        delta_values = {} if self.delta is None else self.delta.get_values()

        return dict(
            start=self.period.get_start(),
            end=self.period.get_end(),
            **period_values,
            **delta_values,
        )

