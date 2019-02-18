import decimal

from django.db import models

from remark.lib.tokens import public_id
from remark.lib.metrics import Metric, Behavior, ModelPeriod


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

    def get_periods(self):
        """
        Return a queryset of all periods, including the baseline.
        """
        return self.periods.all()

    def get_baseline_period(self):
        """
        Return the baseline period for this project.
        """
        # CONSIDER for now, this is always the first. Maybe this should change?
        return self.periods.first()

    def get_baseline_start(self):
        """
        Return the start date (inclusive) of the baseline period.
        """
        return self.get_baseline_period().get_start()

    def get_baseline_end(self):
        """
        Return the end date (exclusive) of the baseline period.
        """
        return self.get_baseline_period().get_end()

    def get_campaign_periods(self):
        """
        Return the campaign periods for this project -- aka all periods except
        the baseline.
        """
        # CONSIDER: for now, this is the rest. Maybe this should change?
        return self.periods.all()[1:]

    def get_campaign_start(self):
        """
        Return the start date (inclusive) of the campaign.
        """
        first_campaign_period = self.periods.all()[1:].first()
        return first_campaign_period.get_start()

    def get_campaign_end(self):
        """
        Return the end date (exclusive) of the campaign.
        """
        last_campaign_period = self.periods.order_by("-start")[1:].first()
        return last_campaign_period.get_end()

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""
        return {"public_id": self.public_id, "name": self.name}

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class PeriodManager(models.Manager):
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
        default=None,
        null=True,
        blank=True,
        help_text="Number of leased units at period start. If not specified, will be pulled from a previous period.",
    )
    leased_units_start.metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)

    leases_ended = models.IntegerField(
        default=0, help_text="Number of leases ended (roughly: move outs)"
    )
    leases_ended.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    lease_applications = models.IntegerField(
        default=0, help_text="Number of lease applications"
    )
    lease_applications.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    leases_executed = models.IntegerField(
        default=0, help_text="Number of new leases executed"
    )
    leases_executed.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    lease_cds = models.IntegerField(
        default=0, help_text="Number of lease cancellations and denials"
    )
    lease_cds.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    leases_due_to_expire = models.IntegerField(
        default=0, help_text="Number of leases due to expire in period"
    )
    leases_due_to_expire.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    lease_renewal_notices = models.IntegerField(
        default=0, help_text="Number of lease renewals signed"
    )
    lease_renewal_notices.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    lease_renewals = models.IntegerField(
        default=0, help_text="Number of lease renewals that took effect"
    )
    lease_renewals.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    lease_vacation_notices = models.IntegerField(
        default=0, help_text="Number of notices to vacate leases"
    )
    lease_vacation_notices.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

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
    target_lease_percent.metric = Metric(Behavior.INTERVAL_AVERAGE_KEEP)

    target_lease_applications = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease applications"
    )
    target_lease_applications.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_leases_executed = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: leases execfuted"
    )
    target_leases_executed.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_lease_renewal_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewal notices"
    )
    target_lease_renewal_notices.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_leases_due_to_expire = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: leases due to expire"
    )
    target_leases_due_to_expire.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_lease_renewals = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewals"
    )
    target_lease_renewals.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_lease_vacation_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease vacation notices"
    )
    target_lease_vacation_notices.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_lease_cds = models.IntegerField(
        null=True,
        blank=True,
        default=None,
        help_text="Target: lease cancellations and denials",
    )
    target_lease_cds.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_delta_leases = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: delta: leases"
    )
    target_delta_leases.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # Physical activity (occupancy)
    # ------------------------------------------------------

    occupiable_units_start = models.IntegerField(
        default=None,
        null=True,
        blank=True,
        help_text="Number of units that can possibly be at period start. If not specified, will be pulled from a previous period.",
    )
    occupiable_units_start.metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)

    occupied_units_start = models.IntegerField(
        default=0,
        null=True,
        blank=True,
        help_text="Number of units occupied at period start. If not specified, will be pulled from a previous period.",
    )
    occupied_units_start.metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)

    move_ins = models.IntegerField(default=0, help_text="Number of units moved into")
    move_ins.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    move_outs = models.IntegerField(default=0, help_text="Number of units moved out of")
    move_outs.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # TARGETS: Physical activity (occupancy)
    # ------------------------------------------------------

    target_move_ins = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move ins"
    )
    target_move_ins.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_move_outs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move outs"
    )
    target_move_outs.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # Acquisition Investment
    # ------------------------------------------------------

    acq_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition reputation building",
    )
    acq_reputation_building.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    acq_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition demand creation",
    )
    acq_demand_creation.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    acq_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition leasing enablement",
    )
    acq_leasing_enablement.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    acq_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition market intelligence",
    )
    acq_market_intelligence.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # XXX This number is a mess. It requires clarification about timeframes. -Dave
    monthly_average_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Average rent tenants pay in the month including this period. If not specified, it will be pulled from an earlier period.",
    )
    monthly_average_rent.metric = Metric(Behavior.POINT_IN_TIME_EARLIEST_KEEP)

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
    target_acq_investment.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # Retention Investment
    # ------------------------------------------------------

    ret_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention reputation building",
    )
    ret_reputation_building.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    ret_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention demand creation",
    )
    ret_demand_creation.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    ret_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention leasing enablement",
    )
    ret_leasing_enablement.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    ret_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention market intelligence",
    )
    ret_market_intelligence.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

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
    target_ret_investment.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # Acquisition Funnel
    # ------------------------------------------------------

    usvs = models.IntegerField(
        default=0, help_text="The number of unique site visitors during this period."
    )
    usvs.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    inquiries = models.IntegerField(
        default=0, help_text="The number of site inquiries during this period."
    )
    inquiries.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    tours = models.IntegerField(
        default=0, help_text="The number of tours during this period."
    )
    tours.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # TARGETS: Acquisition Funnel
    # ------------------------------------------------------

    target_usvs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: USVs"
    )
    target_usvs.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_inquiries = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: INQs"
    )
    target_inquiries.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    target_tours = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: tours"
    )
    target_tours.metric = Metric(Behavior.INTERVAL_SUM_AMORTIZE)

    # ------------------------------------------------------
    # Meta, etc.
    # ------------------------------------------------------

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]

