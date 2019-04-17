import collections
import decimal
import os.path

from django.db import models
from django.conf import settings

from jsonfield import JSONField
from stdimage.models import StdImageField

from remark.lib.tokens import public_id
from remark.lib.metrics import (
    PointMetric,
    EndPointMetric,
    SumIntervalMetric,
    ModelPeriod,
)
from .spreadsheets import SpreadsheetKind, get_activator_for_spreadsheet


def pro_public_id():
    """Public identifier for a project."""
    return public_id("pro")


def building_image_media_path(project, filename):
    """
    Given a Project instance, and the filename as supplied during upload,
    determine where the uploaded building image should actually be placed.

    See https://docs.djangoproject.com/en/2.1/ref/models/fields/#filefield
    """
    # We always target project/<public_id>/building_image<.ext>
    _, extension = os.path.splitext(filename)
    return f"project/{project.public_id}/building_image{extension}"


def spreadsheet_media_path(spreadsheet, filename):
    """
    Given a Spreadsheet instance, and the filename as supplied during upload,
    determine where the uploaded spreadsheet file should actually be placed.
    """
    # We always target project/<public_id>/<sheet_kind>_<upload_time><.ext>
    _, extension = os.path.splitext(filename)
    sheetname = "_".join(
        [spreadsheet.kind, spreadsheet.created.strftime("%Y-%m-%d_%H-%M-%S")]
    )
    return f"project/{spreadsheet.project.public_id}/{sheetname}{extension}"


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

    # StdImageField works just like Django's own ImageField
    # except that you can specify different sized variations.
    building_image = StdImageField(
        blank=True,
        default="",
        upload_to=building_image_media_path,
        help_text="""A full-resolution user-supplied image of the building.<br/>Resized variants (180x180, 76x76) will also be created on Amazon S3.""",
        variations={"regular": (180, 180, True), "thumbnail": (76, 76, True)},
    )

    baseline_start = models.DateField(
        help_text="The first date, inclusive, for the baseline period."
    )

    baseline_end = models.DateField(
        help_text="The final date, exclusive, for the baseline period."
    )

    # A temporary field, for the current sprint, that holds our computed
    # TAM reporting data.
    tmp_market_report_json = JSONField(
        default=None,
        null=True,
        blank=True,
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="Total Addressable Market (TAM) report JSON data. Must conform to the schema defined in MarketAnalysis.ts",
    )

    # A temporary field, for the current sprint, that holds our computed
    # model options data
    tmp_modeling_report_json = JSONField(
        default=None,
        null=True,
        blank=True,
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="Modeling JSON data. Must conform to the schema defined in ModelingOptions.ts",
    )

    # A temporary field, for the current sprint, that holds our campaign plan
    # report data
    tmp_campaign_plan_json = JSONField(
        default=None,
        null=True,
        blank=True,
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="Campaign Plan JSON data. Must conform to the schema defined in CampaignPlan.ts",
    )

    total_units = models.IntegerField(
        null=True,
        blank=True,
        default=None,
        help_text="The total number of units in this project/property.",
    )

    average_tenant_age = models.FloatField(
        null=True,
        blank=True,
        default=None,
        help_text="The average tenant age for this project/property.",
    )

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

    is_baseline_report_public = models.BooleanField(
        verbose_name="Show Baseline Report?", default=False
    )

    is_tam_public = models.BooleanField(verbose_name="Show TAM?", default=False)

    is_performance_report_public = models.BooleanField(
        verbose_name="Show Performance Report?", default=False
    )

    is_modeling_public = models.BooleanField(
        verbose_name="Show Modeling?", default=False
    )

    is_campaign_plan_public = models.BooleanField(
        verbose_name="Show Campaign Plan?", default=False
    )

    def _target_periods(self, qs):
        # TODO XXX temporary hack until we fully populate from model spreadsheets. -Dave
        target_periods = list(qs)
        if not target_periods:
            end = self.get_campaign_end() or self.baseline_end
            empty_target_period = TargetPeriod(
                project=self, start=self.baseline_start, end=end
            )
            target_periods = [empty_target_period]
        return target_periods

    def get_periods(self):
        """
        Return a queryset of all periods, including the baseline.
        """
        return self.periods.all()

    def get_target_periods(self):
        """
        Return a list of all target periods.
        """
        return self._target_periods(self.target_periods.all())

    def get_baseline_periods(self):
        """
        Return the baseline periods for this project.
        """
        return self.periods.filter(end__lte=self.baseline_end)

    def get_baseline_target_periods(self):
        """
        Return target periods within the baseline.
        """
        return self._target_periods(
            self.target_periods.filter(end__lte=self.baseline_end)
        )

    def get_campaign_periods(self):
        """
        Return the campaign periods for this project -- aka all periods except
        the baseline.
        """
        return self.periods.filter(start__gte=self.baseline_end)

    def get_campaign_target_periods(self):
        """
        Return the campaign target periods for this project.
        """
        return self._target_periods(
            self.target_periods.filter(start__gte=self.baseline_end)
        )

    def get_campaign_period_dates(self):
        """
        Return tuples containing start and end dates for all campaign periods.
        """
        return self.get_campaign_periods().values_list("start", "end")

    def get_campaign_start(self):
        """
        Return the start date (inclusive) of the campaign.
        """
        return self.baseline_end

    def get_campaign_end(self):
        """
        Return the end date (exclusive) of the campaign.
        """
        return (
            self.get_campaign_periods()
            .order_by("-start")
            .values_list("end", flat=True)
            .first()
        )

    def get_building_image(self):
        """
        Return building image's S3 resource urls for all variants
        """
        if self.building_image:
            return dict(
                original=self.building_image.url,
                regular=self.building_image.regular.url,
                thumbnail=self.building_image.thumbnail.url,
            )
        else:
            return None

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""
        return {
            "public_id": self.public_id,
            "name": self.name,
            "building_image": self.get_building_image(),
        }

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class SpreadsheetManager(models.Manager):
    def latest_for_kind(self, kind, subkind=None):
        return (
            self.filter(kind=kind, subkind=subkind or "").order_by("-created").first()
        )


class Spreadsheet(models.Model):
    """
    Represents a single uploaded spreadsheet for a project.
    """

    objects = SpreadsheetManager()

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="spreadsheets"
    )

    created = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        editable=False,
        help_text="The creation date for this spreadsheet record.",
    )

    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,  # We allow NULL so that even if an admin is deleted, we preserve history regardless.
        help_text="The user that uploaded this spreadsheet.",
    )

    kind = models.CharField(
        blank=False,
        choices=SpreadsheetKind.CHOICES,
        db_index=True,
        max_length=128,
        help_text="The kind of data this spreadsheet contains.",
    )

    subkind = models.CharField(
        blank=True,
        default="",
        db_index=True,
        max_length=128,
        help_text="The kind of Modeling spreadsheet (if applicable). Run Rate, Schedule Driven, etc",
    )

    file = models.FileField(
        blank=False,
        upload_to=spreadsheet_media_path,
        help_text="The underlying spreadsheet (probably .xlsx) file.",
    )

    imported_data = JSONField(
        default=None,
        null=True,
        blank=True,
        editable=False,
        help_text="Raw imported JSON data. Schema depends on spreadsheet kind.",
    )

    def has_imported_data(self):
        """Return True if we have non-empty imported content."""
        return bool(self.imported_data)

    def is_latest_for_kind(self):
        """Return True if this spreadsheet is the latest for its kind and subkind."""
        return (
            Spreadsheet.objects.latest_for_kind(self.kind, self.subkind).id == self.id
        )

    def get_activator(self):
        return get_activator_for_spreadsheet(self)

    def activate(self):
        """
        Activate the imported data *if* it's safe to do so; currently,
        we consider it safe if this is the most recent spreadsheet of its kind
        and we've successfully imported data.
        """
        if self.is_latest_for_kind() and self.has_imported_data():
            activator = self.get_activator()
            activator.activate()

    class Meta:
        # Always sort spreadsheets with the most recent created first.
        ordering = ["-created"]
        indexes = [
            models.Index(fields=["created", "kind"]),
            models.Index(fields=["created", "kind", "subkind"]),
        ]


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
        help_text="Number of leased units at period start."
    )
    leased_units_start.metric = PointMetric()

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
    # Meta, etc.
    # ------------------------------------------------------

    @property
    def average_monthly_rent(self):
        return self.project.average_monthly_rent

    @property
    def lowest_monthly_rent(self):
        return self.project.lowest_monthly_rent

    @property
    def total_units(self):
        return self.project.total_units

    def _build_metrics(self):
        # Manually insert average_monthly_rent and lowest_monthly_rent
        # TODO consider better ways to do this... -Dave
        super()._build_metrics()
        self._metrics["total_units"] = PointMetric()
        self._metrics["average_monthly_rent"] = PointMetric()
        self._metrics["lowest_monthly_rent"] = PointMetric()

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]


class TargetPeriodManager(models.Manager):
    pass


class TargetPeriod(ModelPeriod, models.Model):
    objects = TargetPeriodManager()

    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="target_periods"
    )

    start = models.DateField(
        db_index=True,
        help_text="The first date, inclusive, that this target period tracks.",
    )

    end = models.DateField(
        db_index=True,
        help_text="The final date, exclusive, that this target period tracks.",
    )

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

    class Meta:
        # Always sort TargetPeriods with the earliest period first.
        ordering = ["start"]
