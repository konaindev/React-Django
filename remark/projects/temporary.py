import decimal

from django.db import models

from remark.lib.math import d_div, d_quant_perc, d_quant_currency
from remark.lib.metrics import Behavior


class Foo:
    # ------------------------------------------------------
    # XXX UNKNOWN BELOW HERE...
    # ------------------------------------------------------

    # TODO consider moving this to project -Dave
    leasable_units = models.IntegerField(
        default=0,
        help_text="The number of units that *are* or *can* be leased at the end of this period.",
    )
    leasable_units.behavior = Behavior.POINT_IN_TIME_LATEST_KEEP

    # TODO DAVEPECK FIXME -- this belongs away from period.
    previous_leased_rate = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=4,
        decimal_places=3,
        help_text="The leased rate as percentage of leasable for the previous period. (Enter 0.9 for 90%)",
    )

    # --------------------------------------------------------------------------
    # Inbound funnel (computed)
    # --------------------------------------------------------------------------

    @property
    def net_lease_change(self):
        """The net number of new leases during this period."""
        return self.leases_executed - self.leases_ended

    @property
    def leased_units(self):
        """The total number of leases in effect at the end of the period."""
        return self.leased_units_start + self.net_lease_change

    @property
    def target_leased_units(self):
        """The target number of leased units we'd like to achieve."""
        return decimal.Decimal(
            self.target_lease_percent * self.leasable_units
        ).quantize(decimal.Decimal(1), rounding=decimal.ROUND_HALF_UP)

    @property
    def leased_rate(self):
        """The percentage of leasable units that are actually leased at end of period."""
        return d_quant_perc(d_div(self.leased_units, self.leasable_units))

    @property
    def leased_rate_change(self):
        """The change in leased rate as compared to the previous period."""
        return self.leased_rate - self.previous_leased_rate

    @property
    def usvs_to_inquiries_percent(self):
        """The conversation rate from usvs to inquiries."""
        return d_quant_perc(d_div(self.inquiries, self.usvs))

    @property
    def inquiries_to_tours_percent(self):
        """The conversion rate from inquiries to tours."""
        return d_quant_perc(d_div(self.tours, self.inquiries))

    @property
    def tours_to_lease_applications_percent(self):
        """The conversion rate from lease applications to tours."""
        return d_quant_perc(d_div(self.lease_applications, self.tours))

    @property
    def lease_applications_to_leases_executed_percent(self):
        """The conversion rate from lease executions to tours."""
        return d_quant_perc(d_div(self.leases_executed, self.lease_applications))

    # --------------------------------------------------------------------------
    # Marketing investment and return (entered)
    # --------------------------------------------------------------------------

    # --------------------------------------------------------------------------
    # Marketing investment and return (computed)
    # --------------------------------------------------------------------------

    @property
    def marketing_investment(self):
        """Return the total marketing investment in this period, across all categories."""
        return (
            self.investment_reputation_building
            + self.investment_demand_creation
            + self.investment_leasing_enablement
            + self.investment_market_intelligence
            + self.investment_resident_retention
        )

    @property
    def estimated_monthly_revenue_change(self):
        """
        Return an estimate of how much new monthly revenue will be obtained on the 
        basis of this period's inbound funnel outcomes.
        """
        return self.net_lease_change * self.monthly_average_rent

    @property
    def estimated_annual_revenue_change(self):
        """
        Return an estimate of how much new annual revenue will be obtained on the 
        basis of this period's inbound funnel outcomes.
        """
        return self.estimated_monthly_revenue_change * 12

    @property
    def return_on_marketing_investment(self):
        """
        Return an estimate of how effective marketing spend is, as a rough
        integer multiple of current investment.

        Returns 0 if the marketing investment in this period is $0.
        """
        # TODO CONSIDER this multiple comes from un-like timeframes: the
        # investment dollars considered are for a single period, but the
        # return is for a full year. This might make sense given that leases
        # are rarely terminated in their first year, but it also might provide
        # misleadingly large numbers. -Dave

        # TODO CONSIDER as currently defined, this multiple considers *net*
        # leases in any given period. But it should *perhaps* only consider
        # *new* leases executed, since currently our marketing dollars are
        # entirely spent on the inbound funnel. In addition, perhaps we need
        # to categorize marketing dollars as applicable to a given funnel
        # (inbound or retention) and then use only inbound dollars here. -Dave

        # TODO maybe make the int(round(...)) bit a view-layer consideration? -Dave
        return round(
            d_div(self.estimated_annual_revenue_change, self.marketing_investment)
        )

    # --------------------------------------------------------------------------
    # Cost Pers (computed)
    # --------------------------------------------------------------------------

    @property
    def cost_per_usv(self):
        """Return the estimated cost to obtain a unique site visitor in this period."""
        return d_quant_currency(
            d_div(
                self.investment_reputation_building
                + self.investment_demand_creation
                + self.investment_market_intelligence,
                self.usvs,
            )
        )

    @property
    def cost_per_inquiry(self):
        """Return the estimated cost to obtain an inbound inquiry in this period."""
        return d_quant_currency(
            d_div(
                self.investment_reputation_building
                + self.investment_demand_creation
                + self.investment_market_intelligence,
                self.inquiries,
            )
        )

    @property
    def cost_per_tour(self):
        """Return the estimated cost to obtain an inbound tour in this period."""
        return d_quant_currency(d_div(self.marketing_investment, self.tours))

    @property
    def cost_per_lease_application(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(
            d_div(self.marketing_investment, self.lease_applications)
        )

    @property
    def cost_per_lease_execution(self):
        """Return the estimated cost to obtain a lease application in this period."""
        return d_quant_currency(d_div(self.marketing_investment, self.leases_executed))

    def __str__(self):
        return "from {} to {}".format(self.start, self.end)

    # --------------------------------------------------------------------------
    # Goals
    # --------------------------------------------------------------------------

    leases_executed_goal = models.IntegerField(
        default=0,
        help_text="The period goal for number of new leases executed during this period.",
    )
    leases_executed_goal.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    leases_renewed_goal = models.IntegerField(
        default=0,
        help_text="The period goal for number of lease renewals signed in the period.",
    )
    leases_renewed_goal.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    leases_ended_goal = models.IntegerField(
        default=0,
        help_text="The period goal for number of leases ended (expired) during this period.",
    )
    leases_ended_goal.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    net_lease_change_goal = models.IntegerField(
        default=0,
        help_text="The period goal for net number of new leases during this period.",
    )
    net_lease_change_goal.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    lease_applications_goal = models.IntegerField(
        default=0,
        help_text="The goal_for number of lease applications during this period.",
    )
    lease_applications_goal.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    usvs_to_inquiries_percent_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="The goal for conversation rate from usvs to inquiries.",
    )

    inquiries_to_tours_percent_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="The goal for conversion rate from inquiries to tours.",
    )

    tours_to_lease_applications_percent_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="The goal for conversion rate from lease applications to tours.",
    )

    lease_applications_to_leases_executed_percent_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="The goal for conversion rate from lease executions to tours.",
    )

    marketing_investment_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="Return the total marketing investment in this period, across all categories.",
    )

    return_on_marketing_investment_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="Goal for return on marketing investment.",
    )

    estimated_annual_revenue_change_goal = models.DecimalField(
        default=0,
        max_digits=10,
        decimal_places=2,
        help_text="Goal for estimated annual revenue change",
    )
