import decimal

from django.db import models

from remark.lib.tokens import public_id
from remark.lib.metrics import Behavior, ModelPeriod, ModelPeriodSet


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

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""
        return {"public_id": self.public_id, "name": self.name}

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class PeriodManager(ModelPeriodSet, models.Model):
    pass


class Period(ModelPeriod, models.Model):
    """
    Represents a snapshot of a property's basic activity over a period of time.
    """

    objects = PeriodManager()

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="periods"
    )

    start = models.DateField(
        db_index=True, help_text="The first date, inclusive, that this period tracks."
    )

    end = models.DateField(
        db_index=True, help_text="The final date, exclusive, that this period tracks."
    )

    # ------------------------------------------------------
    # Logical activity (lease)
    # ------------------------------------------------------

    leased_units_start = models.IntegerField(
        default=0, help_text="Number of leased units at period start"
    )
    leased_units_start.behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP

    leases_ended = models.IntegerField(
        default=0, help_text="Number of leases ended (roughly: move outs)"
    )
    leases_ended.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    lease_applications = models.IntegerField(
        default=0, help_text="Number of lease applications"
    )
    lease_applications.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    leases_executed = models.IntegerField(
        default=0, help_text="Number of new leases executed"
    )
    leases_executed.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    lease_cds = models.IntegerField(
        default=0, help_text="Number of lease cancellations and denials"
    )
    lease_cds.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    leases_due_to_expire = models.IntegerField(
        default=0, help_text="Number of leases due to expire in period"
    )
    leases_due_to_expire = Behavior.INTERVAL_SUM_AMORTIZE

    lease_renewal_notices = models.IntegerField(
        default=0, help_text="Number of lease renewals signed"
    )
    lease_renewal_notices.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    lease_renewals = models.IntegerField(
        default=0, help_text="Number of lease renewals that took effect"
    )
    lease_renewals.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    lease_vacation_notices = models.IntegerField(
        default=0, help_text="Number of notices to vacate leases"
    )
    lease_vacation_notices.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # TARGETS: logical activity (lease)
    # ------------------------------------------------------

    target_lease_percent = models.DecimalField(
        null=True,
        blank=True,
        default=None,
        max_digits=4,
        decimal_places=3,
        help_text="Target: lease percentage (like 0.9)",
    )
    target_lease_percent.behavior = Behavior.INTERVAL_AVERAGE_KEEP

    target_lease_applications = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease applications"
    )
    target_lease_applications.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_leases_executed = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: leases execfuted"
    )
    target_leases_executed.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_lease_renewal_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewal notices"
    )
    target_lease_renewal_notices.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_lease_renewals = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewals"
    )
    target_lease_renewals.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_lease_vacation_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease vacation notices"
    )
    target_lease_vacation_notices.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_delta_leases = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: delta: leases"
    )
    target_delta_leases.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # Physical activity (occupancy)
    # ------------------------------------------------------

    occupiable_units = models.IntegerField(
        default=0,
        help_text="Number of units that can possibly be occupied at period end",
    )
    occupiable_units.behavior = Behavior.POINT_IN_TIME_LATEST_KEEP

    occupied_units_start = models.IntegerField(
        default=0, help_text="Number of units occupied at period start"
    )
    occupied_units_start.behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP

    move_ins = models.IntegerField(default=0, help_text="Number of units moved into")
    move_ins.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    move_outs = models.IntegerField(default=0, help_text="Number of units moved out of")
    move_outs.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # TARGETS: Physical activity (occupancy)
    # ------------------------------------------------------

    target_move_ins = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move ins"
    )
    target_move_ins.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_move_outs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move outs"
    )
    target_move_outs.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # Acquisition Investment
    # ------------------------------------------------------

    acq_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition reputation building",
    )
    acq_reputation_building.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    acq_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition demand creation",
    )
    acq_demand_creation.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    acq_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition leasing enablement",
    )
    acq_leasing_enablement.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    acq_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition market intelligence",
    )
    acq_market_intelligence.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # XXX This number is a mess. It requires clarification about timeframes. -Dave
    monthly_average_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=decimal.Decimal(1),
        help_text="Average rent tenants pay in the month including this period",
    )
    monthly_average_rent.behavior = Behavior.POINT_IN_TIME_EARLIEST_KEEP

    # ------------------------------------------------------
    # TARGETS: Acquisition Investment
    # ------------------------------------------------------

    target_acq_investment = models.DecimalField(
        null=True,
        default=None,
        max_digits=10,
        decimal_places=2,
        help_text="Target: total acquisition investment",
    )
    target_acq_investment.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # Retention Investment
    # ------------------------------------------------------

    ret_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention reputation building",
    )
    ret_reputation_building.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    ret_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention demand creation",
    )
    ret_demand_creation.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    ret_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention leasing enablement",
    )
    ret_leasing_enablement.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    ret_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention market intelligence",
    )
    ret_market_intelligence.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # TARGETS: Retention Investment
    # ------------------------------------------------------

    target_ret_investment = models.DecimalField(
        null=True,
        default=None,
        max_digits=10,
        decimal_places=2,
        help_text="Target: total retention investment",
    )
    target_acq_investment.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # Acquisition Funnel
    # ------------------------------------------------------

    usvs = models.IntegerField(
        default=0, help_text="The number of unique site visitors during this period."
    )
    usvs.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    inquiries = models.IntegerField(
        default=0, help_text="The number of site inquiries during this period."
    )
    inquiries.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    tours = models.IntegerField(
        default=0, help_text="The number of tours during this period."
    )
    tours.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # TARGETS: Acquisition Funnel
    # ------------------------------------------------------

    target_usvs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: USVs"
    )
    target_usvs.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_inquiries = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: INQs"
    )
    target_inquiries.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    target_tours = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: tours"
    )
    target_tours.behavior = Behavior.INTERVAL_SUM_AMORTIZE

    # ------------------------------------------------------
    # Meta, etc.
    # ------------------------------------------------------

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]

    def to_jsonable(self):
        """
        Return a jsonable version of all metrics and values, plus
        the period start/end.
        """
        return dict(start=self.get_start(), end=self.get_end(), **self.get_raw_values())
