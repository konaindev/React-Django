import decimal
import math

from django.db import models

from remark.lib.math import d_div, d_quant_perc, d_quant_currency
from remark.lib.tokens import public_id

from .reports import Report


def pro_public_id():
    """Public identifier for a project."""
    return public_id("pro")


class ProjectManager(models.Manager):
    pass


class Project(models.Model):
    """
    Represents an engagement with a customer on a specific property.
    """

    # TODO eventually, "customer", "specific property", the fundamentals of
    # the engagement, etc. belong here or somewhere related. -Dave
    objects = ProjectManager()

    public_id = models.CharField(
        primary_key=True,
        default=pro_public_id,
        help_text="A unique identifier for this project that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    name = models.CharField(
        max_length=255, help_text="The user-facing name of the project."
    )

    def baseline_period(self):
        """Return the baseline period for this project."""
        # TODO CONSIDER for now, we assume the baseline period is the first
        # period on any project. Alternatively, we could explicitly flag it?
        return self.periods.first()

    def current_period(self):
        """Return the most recent reported period for this project."""
        return self.periods.last()

    def baseline_report(self):
        """Generate a Report for the baseline period."""
        return Report([self.baseline_period()])

    def cumulative_report(self):
        """Generate a Report for the full length of this project."""
        return Report(self.periods.all())

    def report(self, start, end):
        """Generate a report for an arbitrary date range."""
        pass

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class PeriodManager(models.Model):
    pass


class Period(models.Model):
    """
    Represents a snapshot of a property's performance over a period of time.
    """

    objects = PeriodManager()

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="periods"
    )

    # TODO. Lots of things to consider.
    #
    # 1. I dislike both start and end dates being inclusive. But which side is more
    # naturally exclusive?
    #
    # 2. How should we enforce no overlapping date ranges across all periods in a Project?
    #
    # 3. Consider how best to enforce contiguity of ranges? Is this desirable?
    #
    # -Dave
    start = models.DateField(
        db_index=True, help_text="The first date, inclusive, that this period tracks."
    )

    end = models.DateField(
        db_index=True, help_text="The final date, inclusive, that this period tracks."
    )

    # --------------------------------------------------------------------------
    # Inbound funnel (entered)
    # --------------------------------------------------------------------------

    # TODO For manual entry values aside from dates, we need to be tolerant of them
    # not being entered. For now, I provide default values (usually, zero), but
    # we may well wish to distinguish between "they entered zero" and "they didn't enter
    # anything" down the road. NULL is the right answer here, but it obviously complicates
    # computations that flow through the system... so I've punted for now. -Dave

    # TODO the use of d_quant_perc(...) and d_quant_currency(...) may be better
    # moved to a view layer -- particularly if we're chaining computations. -Dave

    # TODO if we demand contiguous periods, this trivially carries over from the
    # previous period. -Dave
    leased_units_start = models.IntegerField(
        default=0,
        help_text="The absolute number of leased units at the start of this period.",
    )

    usvs = models.IntegerField(
        default=0, help_text="The number of unique site visitors during this period."
    )

    inquiries = models.IntegerField(
        default=0, help_text="The number of site inquiries during this period."
    )

    tours = models.IntegerField(
        default=0, help_text="The number of tours during this period."
    )

    lease_applications = models.IntegerField(
        default=0, help_text="The number of lease applications during this period."
    )

    lease_executions = models.IntegerField(
        default=0, help_text="The number of new leases executed during this period."
    )

    # TODO consider moving this to project -Dave
    leasable_units = models.IntegerField(
        default=0,
        help_text="The number of units that *are* or *can* be leased at the end of this period.",
    )

    # TODO consider moving this to project -Dave
    target_lease_percent = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=4,
        decimal_places=3,
        help_text="The target percentage of leasable units that we would like to actually lease. (Enter 0.9 for 90%)",
    )

    # TODO The distinction between "leases" and "occupied" is clear: leases are about
    # contracts; occupancy is about people in units. Unfortunately, at least for now, we
    # don't always properly capture this distinction. The good news is that
    # occupancy-related values, like move_ins, don't tend to drive computations... yet. -Dave
    move_ins = models.IntegerField(
        default=0, help_text="The number of units moved into during this period."
    )

    # --------------------------------------------------------------------------
    # Inbound funnel (computed)
    # --------------------------------------------------------------------------

    @property
    def net_new_leases(self):
        """The net number of new leases during this period."""
        return self.lease_executions - self.lease_terminations

    @property
    def leased_units(self):
        """The total number of leases in effect at the end of the period."""
        return self.leased_units_start + self.net_new_leases

    @property
    def target_leased_units(self):
        """The target number of leased units we'd like to achieve."""
        return math.floor(self.target_lease_percent * self.leasable_units)

    @property
    def lease_rate(self):
        """The percentage of leasable units that are actually leased at end of period."""
        return d_quant_perc(d_div(self.leased_units, self.leasable_units))

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
    def lease_applications_to_lease_executions_percent(self):
        """The conversion rate from lease executions to tours."""
        return d_quant_perc(d_div(self.lease_executions, self.lease_applications))

    # --------------------------------------------------------------------------
    # Retention funnel (entered)
    # --------------------------------------------------------------------------

    # TODO "notices to vacate" and "lease terminations" aren't the same thing, given
    # that you might issue a notice on day 1 and terminate on day 30. You'll probably move out
    # somewhere in between (so occupancy itself is yet *another* matter).
    # At least today, as with many of our funnel metrics, we don't account for time in a
    # particularly cogent fashion. Today, we can call these numbers the same thing. Shortly down
    # the road? No way. -Dave
    lease_terminations = models.IntegerField(
        default=0, help_text="The number of leases terminated during this period."
    )

    renewals = models.IntegerField(
        default=0, help_text="The number of lease renewals signed in the period."
    )

    occupied_units = models.IntegerField(
        default=0, help_text="The number of units occupied at the end of this period."
    )

    move_outs = models.IntegerField(
        default=0, help_text="The number of units moved out from during this period."
    )

    # --------------------------------------------------------------------------
    # Marketing investment and return (entered)
    # --------------------------------------------------------------------------

    investment_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="The dollar amount invested in reputation building during this period.",
    )

    investment_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="The dollar amount invested in demand creation during this period.",
    )

    investment_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="The dollar amount invested in leasing enablement during this period.",
    )

    investment_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="The dollar amount invested in market intelligence during this period.",
    )

    investment_other = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="The dollar amount invested in other marketing during this period.",
    )

    # TODO this number is messy. It requires clarification about timeframes. -Dave
    monthly_average_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=decimal.Decimal(1),
        help_text="The average rent tenants pay in any given month.",
    )

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
            + self.investment_other
        )

    @property
    def estimated_monthly_revenue_change(self):
        """
        Return an estimate of how much new monthly revenue will be obtained on the 
        basis of this period's inbound funnel outcomes.
        """
        return self.net_new_leases * self.monthly_average_rent

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
        return int(
            round(
                d_div(self.estimated_annual_revenue_change, self.marketing_investment)
            )
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
        return d_quant_currency(d_div(self.marketing_investment, self.lease_executions))

    def __str__(self):
        return "from {} to {}".format(self.start, self.end)

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]
