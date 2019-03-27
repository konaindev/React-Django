import collections
import decimal
import os.path

from django.db import models

from jsonfield import JSONField
from PIL import Image
from django.core.files.storage import default_storage as storage

from remark.lib.tokens import public_id
from remark.lib.metrics import PointMetric, SumIntervalMetric, ModelPeriod


def pro_public_id():
    """Public identifier for a project."""
    return public_id("pro")


def building_image_media_path(instance, filename):
    """
    Given a Project instance, and the filename as supplied during upload,
    determine where the uploaded building image should actually be placed.

    See https://docs.djangoproject.com/en/2.1/ref/models/fields/#filefield
    """
    # We always target project/public_id/building_image__original.EXT
    _, extension = os.path.splitext(filename)
    return f"project/{instance.public_id}/building_image__original{extension}"


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

    # ImageField to handle file upload on admin panel
    # will be uploaded to original-version s3 file
    building_image = models.ImageField(
        blank=True,
        default="",
        upload_to=building_image_media_path,
        help_text="A full-resolution user-supplied image of the building.",
    )

    # full S3 URL of original version
    building_image_original = models.URLField(
        blank=True,
        default="",
        max_length=500,
        help_text="Original version of user-supplied image of the building",
    )

    # full S3 URL of 180x180 version
    building_image_regular = models.URLField(
        blank=True,
        default="",
        max_length=500,
        help_text="180x180 version of user-supplied image of the building",
    )

    # full S3 URL of 76x76 version
    building_image_thumbnail = models.URLField(
        blank=True,
        default="",
        max_length=500,
        help_text="76x76 version of user-supplied image of the building",
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

    def get_periods(self):
        """
        Return a queryset of all periods, including the baseline.
        """
        return self.periods.all()

    def get_baseline_periods(self):
        """
        Return the baseline periods for this project.
        """
        return self.periods.filter(end__lte=self.baseline_end)

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

    # best to overwrite save(), trigger thumbnail generation
    def save(self, *args, **kwargs):
        super(Project, self).save(*args, **kwargs)
        self.resize_and_save_building_image()

    # resize, upload to s3 and save url to model
    def resize_and_save_building_image(self):
        if not self.building_image:
            self.building_image_original = ""
            self.building_image_regular = ""
            self.building_image_thumbnail = ""
            super(Project, self).save()
            return

        filename = self.building_image.name
        _, extension = os.path.splitext(filename)
        s3_path_prefix = f"project/{self.public_id}/building_image"
        s3_path_original = f"{s3_path_prefix}__original{extension}"
        s3_path_regular = f"{s3_path_prefix}__180x180{extension}"
        s3_path_thumb = f"{s3_path_prefix}__76x76{extension}"

        # storage is "storages.backends.s3boto3.S3Boto3Storage", the DEFAULT one
        try:
            file = storage.open(filename, 'r')

            image_regular = Image.open(file) # load original image from s3
            image_regular.thumbnail((180, 180))
            s3_file_regular = storage.open(s3_path_regular, "w")
            image_regular.save(s3_file_regular, format=image_regular.format)
            s3_file_regular.close()

            image_thumb = Image.open(file)
            image_thumb.thumbnail((76, 76))
            s3_file_thumb = storage.open(s3_path_thumb, "w")
            image_thumb.save(s3_file_thumb, format=image_regular.format)
            s3_file_thumb.close()

            # save S3 URL paths to building image url fields
            self.building_image_original = storage.url(s3_path_original)
            self.building_image_regular = storage.url(s3_path_regular)
            self.building_image_thumbnail = storage.url(s3_path_thumb)
            super(Project, self).save()

            print("Successfully uploaded 3 versions of building image to S3")
            return
        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)

    def to_jsonable(self):
        """Return a representation that can be converted to a JSON string."""
        return {
            "public_id": self.public_id,
            "name": self.name,
            "building_image_thumbnail": self.building_image_thumbnail,
        }

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

    leases_due_to_expire = models.IntegerField(
        default=0, help_text="Number of leases due to expire in period"
    )
    leases_due_to_expire.metric = SumIntervalMetric()

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
    target_lease_percent.metric = PointMetric()

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

    target_leases_due_to_expire = models.IntegerField(
        null=True, blank=True, default=None, help_text="Target: leases due to expire"
    )
    target_leases_due_to_expire.metric = SumIntervalMetric()

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

    # XXX This number is a mess. It requires clarification about timeframes. -Dave
    monthly_average_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Average rent tenants pay in the month including this period. If not specified, it will be pulled from an earlier period.",
    )
    monthly_average_rent.metric = PointMetric()

    # XXX It's not clear to me this number is better. -Dave
    lowest_monthly_rent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=None,
        null=True,
        blank=True,
        help_text="Lowest rent tenants pay in the month including this period. If not specified, it will be pulled from an earlier period.",
    )
    lowest_monthly_rent.metric = PointMetric()

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
    # Meta, etc.
    # ------------------------------------------------------

    class Meta:
        # Always sort Periods with the earliest period first.
        ordering = ["start"]

