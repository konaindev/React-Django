from django.db import models
from remark.lib.tokens import public_id
from stdimage.models import StdImageField

from .constants import OFFICE_TYPES


def bus_public_id():
    """Public identifier for a business."""
    return public_id("bus")


def peep_public_id():
    """Public identifier for a business."""
    return public_id("peep")


def off_public_id():
    """Public identifier for a business."""
    return public_id("off")


def avatar_media_path(person, filename):
    """
    Given a User instance, and the filename as supplied during upload,
    determine where the uploaded avatar image should actually be placed.

    See https://docs.djangoproject.com/en/2.1/ref/models/fields/#filefield

    Note: Thumbnail generation works fine on FileSystemStorage, but not on S3.
    To overcome this known issue, append random 7-char string to end of file name.
    Though, old files will not be deleted from S3 on image replacement.

    user/<public_id>/avatar_<random_str><.ext>
    user/<public_id>/avatar_<random_str>.regular<.ext>
    user/<public_id>/avatar_<random_str>.thumbnail<.ext>
    """
    _, extension = os.path.splitext(filename)
    random_str = get_random_string(length=7)
    return f"person/{person.public_id}/avatar_{random_str}{extension}"


class Business(models.Model):
    public_id = models.CharField(
        primary_key=True,
        default=bus_public_id,
        help_text="A unique identifier for this business that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    name = models.CharField(max_length=255, blank=False, help_text="Business Name")

    is_property_owner = models.BooleanField(
        default=False, help_text="Business Type is Property Owner"
    )

    is_asset_manager = models.BooleanField(
        default=False, help_text="Business Type is Asset Manager"
    )

    is_property_manager = models.BooleanField(
        default=False, help_text="Business Type is Property Manager"
    )

    is_remarkably = models.BooleanField(
        default=False, help_text="Business Type is Remarkably"
    )

    is_developer = models.BooleanField(
        default=False, help_text="Business Type is Developer"
    )

    is_investor = models.BooleanField(
        default=False, help_text="Business Type is JV / Investor"
    )

    is_vendor = models.BooleanField(
        default=False, help_text="Business Type is Vendor / Consultant"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Businesses"


class OfficeManager(models.Manager):
    pass


class Office(models.Model):
    public_id = models.CharField(
        primary_key=True,
        default=off_public_id,
        help_text="A unique identifier for this person that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    is_home_office = models.BooleanField(default=False, help_text="Is the home office?")

    name = models.CharField(
        default="", max_length=255, blank=False, help_text="Office Name"
    )

    address = models.ForeignKey(
        "geo.Address", on_delete=models.CASCADE, blank=False, help_text="Address"
    )

    business = models.ForeignKey(
        "crm.Business", on_delete=models.CASCADE, blank=False, help_text="Business"
    )

    office_type = models.IntegerField(
        choices=OFFICE_TYPES, help_text="Office Type", blank=True, null=True
    )

    objects = OfficeManager()

    def __str__(self):
        return "{}: {} ({})".format(self.business.name, self.name, self.public_id)


class PeopleManager(models.Manager):
    pass


class Person(models.Model):
    public_id = models.CharField(
        primary_key=True,
        default=peep_public_id,
        help_text="A unique identifier for this person that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    first_name = models.CharField(max_length=255, blank=False, help_text="First Name")

    last_name = models.CharField(max_length=255, blank=False, help_text="Last Name")

    # xxx May want to restrict input on this in the future
    role = models.CharField(max_length=255, blank=False, help_text="Job Role")

    email = models.CharField(max_length=255, blank=False, help_text="Email")

    office_phone = models.CharField(
        max_length=255, blank=True, help_text="Office Phone"
    )

    cell_phone = models.CharField(max_length=255, blank=True, help_text="Cell Phone")

    office = models.ForeignKey(
        "crm.Office",
        on_delete=models.CASCADE,
        blank=False,
        help_text="Office the person works at",
    )

    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="User associated with this person",
    )

    avatar = StdImageField(
        null=True,
        blank=True,
        default="",
        upload_to=avatar_media_path,
        help_text="""A full-resolution user avatar.<br/>Resized variants (100x100, 36x36) will also be created on Amazon S3.""",
        variations={"regular": (100, 100, True), "thumbnail": (36, 36, True)},
    )

    objects = PeopleManager()

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return "{}: {} {} ({})".format(
            self.office.business.name, self.first_name, self.last_name, self.public_id
        )
