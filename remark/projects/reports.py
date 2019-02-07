import decimal

from remark.lib.decorators import computed_property
from remark.lib.metrics import PeriodBase
from remark.lib.math import (
    sum_or_0,
    sum_or_none,
    mult_or_none,
    d_div_or_0,
    d_div_or_none,
    d_quant,
    d_quant_perc,
    d_quant_currency,
    round_or_none,
)


class ComputedPeriod(PeriodBase):
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

    @computed_property
    def leased_unit_change(self):
        """The net number of new leases obtained during the period."""
        return self.leases_executed - self.leases_ended

    @computed_property
    def leased_units(self):
        """The total number of leases in effect at the end of the period."""
        return self.leased_units_start + self.leased_unit_change

    @computed_property
    def leased_rate(self):
        """The percentage of leasable units that are actually leased at end of period."""
        return d_quant_perc(d_div_or_0(self.leased_units, self.occupiable_units))

    @computed_property
    def renewal_rate(self):
        """The percentage of lease renewals as a total of leases due to expire."""
        # XXX I'm utterly unconvinced that this is a sensible metric, but it is
        # specified in Sprint 1. -Dave
        return d_quant_perc(
            d_div_or_0(self.lease_renewal_notices, self.leases_due_to_expire)
        )

    @computed_property
    def lease_cd_rate(self):
        """The percentage of lease cancellations as a total of lease applications."""
        # XXX this also seems like a nonsense number to me. -Dave
        return d_quant_perc(d_div_or_0(self.lease_cds, self.lease_applications))

    # ------------------------------------------------------
    # TARGETS: Logical activity (lease)
    # ------------------------------------------------------

    @computed_property
    def target_leased_units(self):
        """The target number of leased units we'd like to achieve."""
        return d_quant(
            mult_or_none(self.target_lease_percent, self.occupiable_units),
            decimal.Decimal(1),
            decimal.ROUND_HALF_UP,
        )

    # ------------------------------------------------------
    # Physical activity (occupancy)
    # ------------------------------------------------------

    @computed_property
    def occupied_units(self):
        """The total occupancy in effect at the end of the period."""
        return self.occupied_units_start + self.move_ins - self.move_outs

    @computed_property
    def occupancy_rate(self):
        """The percentage of occupiable units that are actually occupied at end of period."""
        return d_quant_perc(d_div_or_0(self.occupied_units, self.occupiable_units))

    # ------------------------------------------------------
    # TARGETS: Physical activity (occupancy)
    # ------------------------------------------------------

    # No computed targets at the moment

    # ------------------------------------------------------
    # Investment
    # ------------------------------------------------------

    @computed_property
    def acq_investment(self):
        """The total acqusition investment (in dollars)."""
        return (
            self.acq_reputation_building
            + self.acq_demand_creation
            + self.acq_leasing_enablement
            + self.acq_market_intelligence
        )

    @computed_property
    def ret_investment(self):
        """The total retention investment (in dollars)."""
        return (
            self.ret_reputation_building
            + self.ret_demand_creation
            + self.ret_leasing_enablement
            + self.ret_market_intelligence
        )

    @computed_property
    def investment(self):
        """The total investment (in dollars)."""
        return self.acq_investment + self.ret_investment

    @computed_property
    def estimated_acq_revenue_gain(self):
        """
        Return an estimate of how much new annualk revenue will be obtained on the 
        basis of this period's acquisition funnel outcomes.
        """
        return self.leased_unit_change * self.monthly_average_rent * 12

    @computed_property
    def estimated_ret_revenue_gain(self):
        """
        Return an estimate of how much new annual revenue will be obtained on the 
        basis of this period's acquisition funnel outcomes.
        """
        return self.lease_renewals * self.monthly_average_rent * 12

    @computed_property
    def acq_romi(self):
        """
        Return an estimate of how effective acquisition spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        return round(d_div_or_0(self.estimated_acq_revenue_gain, self.acq_investment))

    @computed_property
    def ret_romi(self):
        """
        Return an estimate of how effective retention spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        return round(d_div_or_0(self.estimated_ret_revenue_gain, self.ret_investment))

    @computed_property
    def romi(self):
        """
        Return an estimate of how effective marketing spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        total_romi = sum_or_0(self.acq_romi, self.ret_romi)
        return round(d_div_or_0(total_romi, 2))

    # ------------------------------------------------------
    # TARGETS: Investment
    # ------------------------------------------------------

    @computed_property
    def target_investment(self):
        """The target total investment (in dollars)."""
        return sum_or_none(self.target_acq_investment, self.target_ret_investment)

    @computed_property
    def target_estimated_acq_revenue_gain(self):
        """The target estimated acquisition leasing revenue gain."""
        return mult_or_none(self.target_delta_leases, self.monthly_average_rent, 12)

    @computed_property
    def target_estimated_ret_revenue_gain(self):
        """The target estimated ret leasing revenue gain."""
        return mult_or_none(self.target_lease_renewals, self.monthly_average_rent, 12)

    @computed_property
    def target_acq_romi(self):
        """The target acquisition ROMI"""
        d_target = d_div_or_none(
            self.target_estimated_acq_revenue_gain, self.target_acq_investment
        )
        return round_or_none(d_target)

    @computed_property
    def target_ret_romi(self):
        """The target retention ROMI"""
        d_target = d_div_or_none(
            self.target_estimated_ret_revenue_gain, self.target_ret_investment
        )
        return round_or_none(d_target)

    @computed_property
    def target_romi(self):
        """The overall target ROMI"""
        total_target_romi = sum_or_none(self.target_acq_romi, self.target_ret_romi)
        avg_target_romi = d_div_or_none(total_target_romi, 2)
        return round_or_none(avg_target_romi)

    # ------------------------------------------------------
    # Acquisition Funnel
    # ------------------------------------------------------

    @computed_property
    def usv_inq_perc(self):
        """The conversation rate from usvs to inquiries."""
        return d_quant_perc(d_div_or_0(self.inquiries, self.usvs))

    @computed_property
    def inq_tou_perc(self):
        """The conversion rate from inquiries to tours."""
        return d_quant_perc(d_div_or_0(self.tours, self.inquiries))

    @computed_property
    def tou_app_perc(self):
        """The conversion rate from tours to lease applications."""
        return d_quant_perc(d_div_or_0(self.lease_applications, self.tours))

    @computed_property
    def app_exe_perc(self):
        """The conversion rate from lease applications to executions."""
        return d_quant_perc(d_div_or_0(self.leases_executed, self.lease_applications))

    @computed_property
    def usv_exe_perc(self):
        """The conversation rate from usvs to lease executions."""
        return d_quant_perc(d_div_or_0(self.leases_executed, self.usvs))

    # ------------------------------------------------------
    # TARGETS: Acquisition Funnel
    # ------------------------------------------------------

    @computed_property
    def target_usv_inq_perc(self):
        """The conversation rate from usvs to inquiries."""
        return d_quant_perc(d_div_or_none(self.target_inquiries, self.target_usvs))

    @computed_property
    def target_inq_tou_perc(self):
        """The conversion rate from inquiries to tours."""
        return d_quant_perc(d_div_or_none(self.target_tours, self.target_inquiries))

    @computed_property
    def target_tou_app_perc(self):
        """The conversion rate from tours to lease applications."""
        return d_quant_perc(
            d_div_or_none(self.target_lease_applications, self.target_tours)
        )

    @computed_property
    def target_app_exe_perc(self):
        """The conversion rate from lease applications to executions."""
        return d_quant_perc(
            d_div_or_none(self.target_leases_executed, self.target_lease_applications)
        )

    @computed_property
    def target_usv_exe_perc(self):
        """The conversation rate from usvs to lease executions."""
        return d_quant_perc(
            d_div_or_none(self.target_leases_executed, self.target_usvs)
        )

    # ------------------------------------------------------
    # Funnel Costs
    # ------------------------------------------------------

    @computed_property
    def cost_per_usv(self):
        """Return the estimated cost to obtain a unique site visitor in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.usvs))

    @computed_property
    def cost_per_inq(self):
        """Return the estimated cost to obtain an inbound inquiry in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.inquiries))

    @computed_property
    def cost_per_tou(self):
        """Return the estimated cost to obtain an inbound tour in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.tours))

    @computed_property
    def cost_per_app(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(
            d_div_or_0(self.acq_investment, self.lease_applications)
        )

    @computed_property
    def cost_per_exe(self):
        """Return the estimated cost to obtain a lease execution in this period."""
        return d_quant_currency(d_div_or_0(self.acq_investment, self.leases_executed))

    # ------------------------------------------------------
    # TARGETS: Funnel Costs
    # ------------------------------------------------------

    @computed_property
    def target_cost_per_usv(self):
        """Return the target cost to obtain a unique site visitor in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_usvs)
        )

    @computed_property
    def target_cost_per_inq(self):
        """Return the estimated cost to obtain an inbound inquiry in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_inquiries)
        )

    @computed_property
    def target_cost_per_tou(self):
        """Return the estimated cost to obtain an inbound tour in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_tours)
        )

    @computed_property
    def target_cost_per_app(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_lease_applications)
        )

    @computed_property
    def target_cost_per_exe(self):
        """Return the estimated cost to obtain a lease execution in this period."""
        return d_quant_currency(
            d_div_or_none(self.target_acq_investment, self.target_leases_executed)
        )

    # ------------------------------------------------------
    # Forwarding implementations to the underlying Period
    # ------------------------------------------------------

    def __getattr__(self, name):
        """
        For convenience, return all attributes on the period itself.

        Raise an exception if *that* isn't found.
        """
        return getattr(self.period, name)

    def get_start(self):
        return self.period.get_start()

    def get_end(self):
        return self.period.get_end()

    def get_metric_names(self):
        return self.period.get_metric_names()

    def get_metric(self, metric_name):
        return self.period.get_metric(metric_name)

    def get_values(self):
        return self.period.get_values()

    def get_value(self, metric_or_name):
        return self.period.get_value(metric_or_name)

    def to_jsonable(self):
        # HACK HACK we'll want to really do something smarter/less scary here. -Dave
        period_jsonable = self.period.to_jsonable()

        def exclude_attr(name):
            return name.startswith("__") or name.startswith("get_")

        computed_jsonable = {
            name: getattr(self, name) for name in dir(self) if not exclude_attr(name)
        }

        return dict(**period_jsonable, **computed_jsonable)


class Report:
    def __init__(self, period):
        self.period = ComputedPeriod(period)

    def to_jsonable(self):
        """
        Return a structure that can be converted to a JSON string.

        (I call such things 'jsonables' to distinguish them from json strings
        themselves, but your milage may vary. :-)
        """
        return self.period.to_jsonable()
