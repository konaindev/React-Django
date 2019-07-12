import decimal

from datetime import datetime
from django.db import models

from remark.lib.metrics import (
    PointMetric,
    EndPointMetric,
    SumIntervalMetric,
    ModelPeriod,
)

class RemarkablyPortfolioAveragePeriodManager(models.Manager):
    pass

class RemarkablyPortfolioAveragePeriod(ModelPeriod, models.Model):
    """
    Represents a snapshot of Remarkably's client's properties activity over a period of time.
    """

    objects = RemarkablyPortfolioAveragePeriodManager()

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
        help_text="Number of leased units at period start."
    )
    leased_units_start.metric = PointMetric()

    # This ultimately surfaces as `leased_units` on `ComputedPeriod` if
    # it's provided here; otherwise, ComputedPeriod actually computes a value.
    leased_units_end = models.IntegerField(
        null=True,
        default=None,
        editable=False,
        help_text="Number of leased units at period end. (Cannot be edited.)",
    )
    leased_units_end.metric = EndPointMetric()

    leases_ended = models.IntegerField(
        default=0, help_text="Number of leases ended (roughly: move outs)"
    )
    leases_ended.metric = SumIntervalMetric()

    lease_applications = models.IntegerField(
        default=0, help_text="Number of lease applications"
    )
    lease_applications.metric = SumIntervalMetric()

    leases_executed = models.IntegerField(
        default=0, help_text="Number of new leases executed"
    )
    leases_executed.metric = SumIntervalMetric()

    lease_cds = models.IntegerField(
        default=0, help_text="Number of lease cancellations and denials"
    )
    lease_cds.metric = SumIntervalMetric()

    lease_renewal_notices = models.IntegerField(
        default=0, help_text="Number of lease renewals signed"
    )
    lease_renewal_notices.metric = SumIntervalMetric()

    lease_renewals = models.IntegerField(
        default=0, help_text="Number of lease renewals that took effect"
    )
    lease_renewals.metric = SumIntervalMetric()

    lease_vacation_notices = models.IntegerField(
        default=0, help_text="Number of notices to vacate leases"
    )
    lease_vacation_notices.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # Physical activity (occupancy)
    # ------------------------------------------------------

    occupiable_units_start = models.IntegerField(
        default=None,
        null=True,
        blank=True,
        help_text="Number of units that can possibly be at period start. If not specified, will be pulled from a previous period.",
    )
    occupiable_units_start.metric = PointMetric()

    occupied_units_start = models.IntegerField(
        help_text="Number of units occupied at period start."
    )
    occupied_units_start.metric = PointMetric()

    # This ultimately surfaces as `leased_units` on `ComputedPeriod` if
    # it's provided here; otherwise, ComputedPeriod actually computes a value.
    occupied_units_end = models.IntegerField(
        null=True,
        default=None,
        editable=False,
        help_text="Number of units occupied at period end. (Cannot be edited.)",
    )
    occupied_units_end.metric = EndPointMetric()

    move_ins = models.IntegerField(default=0, help_text="Number of units moved into")
    move_ins.metric = SumIntervalMetric()

    move_outs = models.IntegerField(default=0, help_text="Number of units moved out of")
    move_outs.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # Acquisition Investment
    # ------------------------------------------------------

    acq_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition reputation building",
    )
    acq_reputation_building.metric = SumIntervalMetric()

    acq_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition demand creation",
    )
    acq_demand_creation.metric = SumIntervalMetric()

    acq_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition leasing enablement",
    )
    acq_leasing_enablement.metric = SumIntervalMetric()

    acq_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in acquisition market intelligence",
    )
    acq_market_intelligence.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # Retention Investment
    # ------------------------------------------------------

    ret_reputation_building = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention reputation building",
    )
    ret_reputation_building.metric = SumIntervalMetric()

    ret_demand_creation = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention demand creation",
    )
    ret_demand_creation.metric = SumIntervalMetric()

    ret_leasing_enablement = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention leasing enablement",
    )
    ret_leasing_enablement.metric = SumIntervalMetric()

    ret_market_intelligence = models.DecimalField(
        default=decimal.Decimal(0),
        max_digits=10,
        decimal_places=2,
        help_text="Amount invested in retention market intelligence",
    )
    ret_market_intelligence.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # Acquisition Funnel
    # ------------------------------------------------------

    usvs = models.IntegerField(
        default=0, help_text="The number of unique site visitors during this period."
    )
    usvs.metric = SumIntervalMetric()

    inquiries = models.IntegerField(
        default=0, help_text="The number of site inquiries during this period."
    )
    inquiries.metric = SumIntervalMetric()

    tours = models.IntegerField(
        default=0, help_text="The number of tours during this period."
    )
    tours.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # TARGETS: logical activity (lease)
    # ------------------------------------------------------

    target_leased_rate = models.DecimalField(
        null=True,
        blank=True,
        default=None,
        max_digits=4,
        decimal_places=3,
        help_text="Target: lease percentage (like 0.9)",
    )
    target_leased_rate.metric = EndPointMetric()

    target_lease_applications = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease applications"
    )
    target_lease_applications.metric = SumIntervalMetric()

    target_leases_executed = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: leases execfuted"
    )
    target_leases_executed.metric = SumIntervalMetric()

    target_lease_renewal_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewal notices"
    )
    target_lease_renewal_notices.metric = SumIntervalMetric()

    target_lease_renewals = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease renewals"
    )
    target_lease_renewals.metric = SumIntervalMetric()

    target_lease_vacation_notices = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: lease vacation notices"
    )
    target_lease_vacation_notices.metric = SumIntervalMetric()

    target_lease_cds = models.IntegerField(
        null=True,
        blank=True,
        default=None,
        help_text="Target: lease cancellations and denials",
    )
    target_lease_cds.metric = SumIntervalMetric()

    target_delta_leases = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: delta: leases"
    )
    target_delta_leases.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # TARGETS: Physical activity (occupancy)
    # ------------------------------------------------------

    target_move_ins = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move ins"
    )
    target_move_ins.metric = SumIntervalMetric()

    target_move_outs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: move outs"
    )
    target_move_outs.metric = SumIntervalMetric()

    target_occupied_units = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: occupied units"
    )
    target_occupied_units.metric = EndPointMetric()

    # ------------------------------------------------------
    # TARGETS: Acquisition Investment
    # ------------------------------------------------------

    target_acq_investment = models.DecimalField(
        null=True,
        blank=True,
        default=None,
        max_digits=10,
        decimal_places=2,
        help_text="Target: total acquisition investment",
    )
    target_acq_investment.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # TARGETS: Retention Investment
    # ------------------------------------------------------

    target_ret_investment = models.DecimalField(
        null=True,
        blank=True,
        default=None,
        max_digits=10,
        decimal_places=2,
        help_text="Target: total retention investment",
    )
    target_ret_investment.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # TARGETS: Acquisition Funnel
    # ------------------------------------------------------

    target_usvs = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: USVs"
    )
    target_usvs.metric = SumIntervalMetric()

    target_inquiries = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: INQs"
    )
    target_inquiries.metric = SumIntervalMetric()

    target_tours = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: tours"
    )
    target_tours.metric = SumIntervalMetric()

    # ------------------------------------------------------
    # Rents
    # ------------------------------------------------------

    highest_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Highest rent tenants pay monthly. Applies for the duration of the project.",
    )

    average_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Average rent tenants pay monthly. Applies for the duration of the project.",
    )

    lowest_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Lowest rent tenants pay monthly. Applies for the duration of the project.",
    )

    # ------------------------------------------------------
    # Meta, etc.
    # ------------------------------------------------------

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]
