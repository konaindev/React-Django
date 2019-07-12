import collections
import decimal
import os.path

from datetime import datetime
from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from django.urls import reverse
from django.utils.crypto import get_random_string

from jsonfield import JSONField
from stdimage.models import StdImageField

from remark.lib.stats import health_check
from remark.lib.tokens import public_id
from remark.lib.metrics import (
    PointMetric,
    EndPointMetric,
    SumIntervalMetric,
    ModelPeriod,
)
from remark.projects.spreadsheets import SpreadsheetKind, get_activator_for_spreadsheet
from remark.projects.reports.performance import PerformanceReport


def pro_public_id():
    """Public identifier for a project."""
    return public_id("pro")


def fund_public_id():
    """Public identifier for a fund."""
    return public_id("fund")


def campaign_public_id():
    return public_id("campaign")


def campaign_model_public_id():
    return public_id("campaign_model")


def spreadsheet_public_id():
    return public_id("spreadsheet2")


def building_logo_media_path(property, filename):
    """
    Given a Project instance, and the filename as supplied during upload,
    determine where the uploaded building logo should actually be placed.

    See https://docs.djangoproject.com/en/2.1/ref/models/fields/#filefield

    Note: Thumbnail regeneration works fine on FileSystemStorage, but not on S3.
    To overcome this known issue, append random 7-char string to end of file name.
    Though, old files will not be deleted from S3 on image replacement.

    project/<public_id>/building_logo_<random_str><.ext>
    project/<public_id>/building_logo_<random_str>.regular<.ext>
    project/<public_id>/building_logo_<random_str>.thumbnail<.ext>
    """
    _, extension = os.path.splitext(filename)
    random_str = get_random_string(length=7)
    return f"property/{property.id}/building_logo_{random_str}{extension}"


def building_image_media_path(property, filename):
    _, extension = os.path.splitext(filename)
    random_str = get_random_string(length=7)
    return f"property/{property.id}/building_image_{random_str}{extension}"


def spreadsheet_media_path(spreadsheet, filename):
    """
    Given a Spreadsheet instance, and the filename as supplied during upload,
    determine where the uploaded spreadsheet file should actually be placed.

    Note:
    Spreadsheet2 model doesn't have "project", "created" fields,
    which are currently set from forms temporarily.
    """
    # We always target project/<public_id>/<sheet_kind>_<upload_time><.ext>
    _, extension = os.path.splitext(filename)
    sheetname = "_".join(
        [spreadsheet.kind, spreadsheet.created.strftime("%Y-%m-%d_%H-%M-%S")]
    )
    return f"project/{spreadsheet.project.public_id}/{sheetname}{extension}"


class Tag(models.Model):
    word = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.word


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

    property = models.OneToOneField("projects.Property", on_delete=models.CASCADE, blank=False)

    account = models.ForeignKey(
        "users.Account", on_delete=models.CASCADE, related_name="account", blank=False
    )

    asset_manager = models.ForeignKey(
        "crm.Business",
        on_delete=models.SET_NULL,
        related_name="asset_manager",
        blank=True,
        null=True,
        limit_choices_to={"business_type": 2},
    )

    property_manager = models.ForeignKey(
        "crm.Business",
        on_delete=models.SET_NULL,
        related_name="property_manager",
        blank=True,
        null=True,
        limit_choices_to={"business_type": 3},
    )

    property_owner = models.ForeignKey(
        "crm.Business",
        on_delete=models.SET_NULL,
        related_name="property_owner",
        blank=True,
        null=True,
        limit_choices_to={"business_type": 1},
    )

    fund = models.ForeignKey(
        "projects.Fund", on_delete=models.SET_NULL, blank=True, null=True
    )

    custom_tags = models.ManyToManyField(Tag, blank=True)

    @property
    def customer_name(self):
        return self.account.company_name

    # This is a temporary field until we have user accounts setup.
    # When that happens there should be a many to one relationship with
    # those users. We should pull email addresses from the user accounts. -TPC
    email_distribution_list = models.TextField(
        max_length=2000,
        default="",
        help_text="Comma separated list of people to receive email updates about this Project.",
    )

    # This is for the SendGrid recipients list.
    email_list_id = models.CharField(max_length=256, null=True, default=None)

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
        verbose_name="TAM Data",
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="Total Addressable Market (TAM) report JSON data. Must conform to the schema defined in MarketAnalysis.ts",
    )

    # A temporary field, for the current sprint, that holds our campaign plan
    # report data
    tmp_campaign_plan_json = JSONField(
        default=None,
        null=True,
        blank=True,
        verbose_name="Campaign Data",
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="Campaign Plan JSON data. Must conform to the schema defined in CampaignPlan.ts",
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

    is_baseline_report_shared = models.BooleanField(
        verbose_name="Share Baseline Report?", default=False
    )

    is_tam_shared = models.BooleanField(verbose_name="Share TAM?", default=False)

    is_performance_report_shared = models.BooleanField(
        verbose_name="Share Performance Report?", default=False
    )

    is_modeling_shared = models.BooleanField(
        verbose_name="Share Modeling?", default=False
    )

    is_campaign_plan_shared = models.BooleanField(
        verbose_name="Share Campaign Plan?", default=False
    )

    competitors = models.ManyToManyField("self", blank=True, symmetrical=False)

    address = models.ForeignKey(
        "geo.Address", on_delete=models.SET_NULL, null=True, blank=True
    )

    view_group = models.OneToOneField(
        Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="view_of"
    )

    admin_group = models.OneToOneField(
        Group, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin_of",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def _target_periods(self, qs, start, end):
        """
        Return target periods, if they exist; if they don't, cons up a single
        empty/fake target period to satisfy our downstream computations.
        """
        # XXX this is basically a hack; remove it once our downstream
        # code (ComputedPeriod, etc) is not dependent on the existence of
        # target values. -Dave
        target_periods = list(qs)
        if not target_periods:
            empty_target_period = TargetPeriod(project=self, start=start, end=end)
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

        # Hack to support CampaignModel's without a campaign attached.
        # This needs to be removed
        if self.target_periods.all().exclude(campaign_model=None).count() > 0:
            qs = self.target_periods.all().exclude(campaign_model=None)
        else:
            qs = self.target_periods.all()

        return self._target_periods(
            qs,
            start=self.baseline_start,
            end=self.get_campaign_end() or self.baseline_end,
        )

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
            self.target_periods.filter(end__lte=self.baseline_end),
            start=self.baseline_start,
            end=self.baseline_end,
        )

    def get_campaign_periods(self):
        """
        Return the campaign periods for this project -- aka all periods except
        the baseline.
        """
        return self.periods.filter(start__gte=self.baseline_end)

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

    def get_building_logo(self):
        """
        Return building logo's S3 resource urls for all variants
        """
        property = self.property
        if property.building_logo:
            return [
                property.building_logo.url,
                property.building_logo.regular.url,
                property.building_logo.thumbnail.url,
            ]
        else:
            return None

    def get_building_image(self):
        """
        Return building image's S3 resource urls for all variants
        """
        property = self.property
        if property.building_image:
            return [
                property.building_image.url,
                property.building_image.landscape.url,
                property.building_image.regular.url,
                property.building_image.thumbnail.url,
            ]
        else:
            return None

    def get_building_image_url(self):
        property = self.property
        if property.building_image:
            return property.building_image.dashboard.url
        return None

    def get_baseline_url(self):
        return reverse("baseline_report", kwargs={"project_id": self.public_id})

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""

        kwargs = {"project_id": self.public_id}
        update_endpoint = reverse("update_endpoint", kwargs=kwargs)

        return dict(
            public_id=self.public_id,
            name=self.name,
            building_logo=self.get_building_logo(),
            building_image=self.get_building_image(),
            update_endpoint=update_endpoint,
        )

    def get_performance_rating(self):
        performance_report = PerformanceReport.for_campaign_to_date(self)
        if not performance_report:
            return -1
        campaign_to_date = performance_report.to_jsonable()
        lease_rate = (
            campaign_to_date.get("property", {}).get("leasing", {}).get("rate", 0)
        )
        target_lease_rate = (
            campaign_to_date.get("targets", {})
            .get("property", {})
            .get("leasing", {})
            .get("rate", 0)
        )
        if not target_lease_rate:
            return -1
        return health_check(lease_rate, target_lease_rate)

    def user_can_view(self, user):
        if user.is_superuser:
            return True
        return (self.view_group is not None) and user.groups.filter(
            pk=self.view_group.pk
        ).exists()

    def __assign_blank_groups(self):
        """
        Creates a new Group and assign it to view_gruop field
        """
        view_group = Group(name=f"project | {self.name} | view")
        admin_group = Group(name=f"project | {self.name} | admin")
        view_group.save()
        admin_group.save()
        self.view_group = view_group
        self.admin_group = admin_group

    def save(self, *args, **kwargs):
        if not self.pk:
            self.__assign_blank_groups()
        super().save(*args, **kwargs)

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class Property(models.Model):
    """
    Property for project
    """

    property_id = models.AutoField(primary_key=True)

    name = models.CharField(
        max_length=255, help_text="The user-facing name of the project.", blank=False
    )

    average_tenant_age = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        help_text="The average tenant age for this property.",
    )

    total_units = models.IntegerField(
        blank=False,
        default=0,
        help_text="The total number of units in this property.",
    )

    highest_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        blank=False,
        help_text="Highest rent tenants pay monthly. Applies for the duration of the project.",
    )

    average_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        blank=False,
        help_text="Average rent tenants pay monthly. Applies for the duration of the project.",
    )

    lowest_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
        blank=False,
        help_text="Lowest rent tenants pay monthly. Applies for the duration of the project.",
    )

    geo_address = models.ForeignKey(
        "geo.Address", on_delete=models.CASCADE, null=True, blank=False
    )

    # StdImageField works just like Django's own ImageField
    # except that you can specify different sized variations.
    building_logo = StdImageField(
        blank=True,
        default="",
        upload_to=building_logo_media_path,
        help_text="""Image of property logo<br/>Resized variants (180x180, 76x76) will also be created on Amazon S3.""",
        variations={"regular": (180, 180), "thumbnail": (76, 76)},
    )

    building_image = StdImageField(
        blank=True,
        default="",
        upload_to=building_image_media_path,
        help_text="""Image of property building<br/>Resized variants (309x220, 180x180, 76x76) will also be created on Amazon S3.""",
        variations={
            "dashboard": (400, 400, True),
            "landscape": (309, 220, True),
            "regular": (180, 180, True),
            "thumbnail": (76, 76, True),
        },
    )

    def __str__(self):
        return f"{self.name} | property"


class SpreadsheetManager(models.Manager):
    def latest_for_kind(self, kind):
        return self.filter(kind=kind).order_by("-created").first()


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
        """Return True if this spreadsheet is the latest for its kind."""
        return Spreadsheet.objects.latest_for_kind(self.kind).id == self.id

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
        indexes = [models.Index(fields=["created", "kind"])]


class Spreadsheet2(models.Model):
    public_id = models.CharField(
        primary_key=True, default=spreadsheet_public_id, max_length=50, editable=False
    )
    file_url = models.FileField(
        blank=False,
        upload_to=spreadsheet_media_path,
        help_text="The underlying spreadsheet (probably .xlsx) file.",
    )
    json_data = JSONField(
        default=None,
        help_text="Raw imported JSON data. Schema depends on spreadsheet kind.",
    )
    kind = models.CharField(
        blank=False,
        choices=SpreadsheetKind.CHOICES,
        db_index=True,
        max_length=128,
        help_text="The kind of data this spreadsheet contains. Enum: Market, Period, Modeling, Campaign Plan",
    )


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
    # Meta, etc.
    # ------------------------------------------------------

    @property
    def average_monthly_rent(self):
        return self.project.property.average_monthly_rent

    @property
    def lowest_monthly_rent(self):
        return self.project.property.lowest_monthly_rent

    @property
    def highest_monthly_rent(self):
        return self.project.property.highest_monthly_rent

    @property
    def total_units(self):
        return self.project.property.total_units

    def _build_metrics(self):
        # Manually insert average_monthly_rent and lowest_monthly_rent
        # TODO consider better ways to do this... -Dave
        super()._build_metrics()
        self._metrics["total_units"] = PointMetric()
        self._metrics["average_monthly_rent"] = PointMetric()
        self._metrics["lowest_monthly_rent"] = PointMetric()
        self._metrics["highest_monthly_rent"] = PointMetric()

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

    campaign_model = models.ForeignKey(
        "CampaignModel",
        on_delete=models.CASCADE,
        related_name="+",
        null=True,
        blank=True,
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


def tam_export_media_path(instance, filename):
    """
    Given a TAM export log instance, and the filename as supplied during upload,
    determine where the uploaded spreadsheet file should actually be placed.
    """
    # We always target project/<public_id>/tam_export_<upload_time><.ext>
    _, extension = os.path.splitext(filename)
    sheetname = "_".join(["tam_export", datetime.now().strftime("%Y-%m-%d_%H-%M-%S")])
    return f"project/{instance.project.public_id}/{sheetname}{extension}"


class TAMExportLog(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="tam_export_logs"
    )

    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="tam_export_logs"
    )

    file = models.FileField(
        blank=False,
        upload_to=tam_export_media_path,
        help_text="The underlying spreadsheet (probably .xlsx) file.",
    )

    exported_at = models.DateTimeField(
        auto_now_add=True, db_index=True, editable=False, help_text="The date exported."
    )

    args_json = JSONField(
        default=None,
        null=True,
        blank=True,
        verbose_name="TAM Export Arguments",
        # Ensure loaded data retains JSON object key ordering
        load_kwargs={"object_pairs_hook": collections.OrderedDict},
        help_text="The arguments used to build TAM export file.",
    )

    def __str__(self):
        return f"{self.project} Export For {self.user} at {self.exported_at.strftime('%Y-%m-%d_%H-%M-%S')}"


class Fund(models.Model):
    public_id = models.CharField(
        primary_key=True,
        default=fund_public_id,
        help_text="A unique identifier for this fund that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    account = models.ForeignKey("users.Account", on_delete=models.CASCADE, blank=False)

    name = models.CharField(max_length=255, blank=False, help_text="Fund Name")

    def __str__(self):
        return self.name


class CampaignManager(models.Manager):
    pass


class Campaign(models.Model):
    objects = CampaignManager()

    public_id = models.CharField(
        primary_key=True, default=campaign_public_id, max_length=50, editable=False
    )
    name = models.CharField(max_length=255)
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="campaigns",
        null=True,
    )
    selected_campaign_model = models.ForeignKey(
        "CampaignModel",
        on_delete=models.SET_NULL,
        related_name="+",
        null=True,
        blank=True,
        help_text="All target values will be replaced by those in the newly selected model.",
    )

    # This value is set when the instance is created; if we later
    # call save, and it changes, then we update targets for the model.
    __selected_campaign_model = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: remove this swap variable in PR#198
        # Save this for comparison purposes on save(...)
        # while loading dump data, "selected_campaign_model" results in KeyError
        # "selected_campaign_model_id" works though
        # bare for now, to make dumpdata working properly
        try:
            self.__selected_campaign_model = self.selected_campaign_model
        except:
            pass


    def save(self, *args, **kwargs):
        try:
            old = type(self).objects.get(pk=self.pk) if self.pk else None
        except:
            old = None

        super().save(*args, **kwargs)

        # detect change on selected_campaign_model
        if old and old.selected_campaign_model != self.selected_campaign_model:
            self.update_for_selected_model()

    def get_selected_model_option(self):
        """Return the currently selected model option."""
        if self.selected_campaign_model is None:
            return

        return self.selected_campaign_model.spreadsheet.json_data

    def update_for_selected_model(self):
        """
        Update all associated data (like target periods) based on
        the currently selected model.
        """

        def _get_model_targets(campaign_model):
            if campaign_model is None:
                return []
            json_data = campaign_model.spreadsheet.json_data
            return json_data.get("targets", [])

        def _create_target_period(campaign_model, target_data):
            # override if there is overlapping period
            self.project.target_periods.filter(end=target_data["end"]).delete()
            # create TargetPeriod and set fields with json values
            target_period = TargetPeriod(
                project=self.project, campaign_model=campaign_model
            )
            for k, v in target_data.items():
                setattr(target_period, k, v)
            target_period.save()
            return target_period

        if self.project is None:
            return

        # Remove all extant target periods
        self.project.target_periods.all().delete()

        campaigns_with_active_models = self.project.campaigns.exclude(
            selected_campaign_model=None
        )
        active_models = [
            campaign.selected_campaign_model
            for campaign in campaigns_with_active_models
        ]
        # Campaigns typically don't over lap BUT if they do,
        # you should use the Target Periods from the __latter__ Campaign
        active_models.sort(key=lambda m: m.model_start)

        for active_model in active_models:
            for target_data in _get_model_targets(active_model):
                _create_target_period(active_model, target_data)

    def __str__(self):
        return "{} ({})".format(self.name, self.public_id)


class CampaignModelManager(models.Manager):
    pass


class CampaignModel(models.Model):
    objects = CampaignModelManager()

    public_id = models.CharField(
        primary_key=True,
        default=campaign_model_public_id,
        max_length=50,
        editable=False,
    )
    campaign = models.ForeignKey(
        "Campaign", on_delete=models.CASCADE, related_name="campaign_models"
    )
    spreadsheet = models.ForeignKey(
        "Spreadsheet2", on_delete=models.CASCADE, related_name="campaign_models"
    )
    name = models.CharField(max_length=255)
    model_start = models.DateField()
    model_end = models.DateField()
    active = models.BooleanField(default=True)
    model_index = models.IntegerField(default=0)

    def campaign_project(self):
        return self.campaign.project

    project = property(campaign_project)

    def is_selected(self):
        return self.campaign.selected_campaign_model == self

    selected = property(is_selected)

    def spreadsheet_file_url(self):
        return self.spreadsheet.file_url

    file_url = property(spreadsheet_file_url)

    def spreadsheet_json_data(self):
        return self.spreadsheet.json_data

    json_data = property(spreadsheet_json_data)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["model_index"]
