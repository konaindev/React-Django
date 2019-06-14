from django.db import models

from remark.lib.tokens import public_id
from remark.projects.models import Project
from remark.users.constants import ACCOUNT_TYPE


def bus_public_id():
    """Public identifier for a business."""
    return public_id("bus")

def peep_public_id():
    """Public identifier for a business."""
    return public_id("peep")

def off_public_id():
    """Public identifier for a business."""
    return public_id("off")


class BusinessesQuerySet(models.QuerySet):
    def property_managers(self, account_id, **kwargs):
        project_subquery = models.Subquery(
            Project.objects.filter(account_id=account_id).values("property_manager_id")
        )
        return self.filter(public_id__in=project_subquery, business_type=3, **kwargs)

    def asset_managers(self, account_id, **kwargs):
        project_subquery = models.Subquery(
            Project.objects.filter(account_id=account_id).values("asset_manager_id")
        )
        return self.filter(public_id__in=project_subquery, business_type=2, **kwargs)


class Business(models.Model):
    public_id = models.CharField(
        primary_key=True,
        default=bus_public_id,
        help_text="A unique identifier for this business that is safe to share publicly.",
        max_length=24,
        editable=False,
    )

    name = models.CharField(max_length=255, blank=False, help_text="Business Name")

    business_type = models.IntegerField(
        choices=ACCOUNT_TYPE, null=False, help_text="Business Type"
    )

    objects = BusinessesQuerySet.as_manager()

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

    name = models.CharField(default="", max_length=255, blank=False, help_text="Office Name")

    address = models.ForeignKey(
        "geo.Address", on_delete=models.CASCADE, blank=False, help_text="Address"
    )

    business = models.ForeignKey(
        "crm.Business", on_delete=models.CASCADE, blank=False, help_text="Business"
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

    office_phone = models.CharField(max_length=255, blank=False, help_text="Office Phone")

    cell_phone = models.CharField(max_length=255, blank=False, help_text="Cell Phone")

    office = models.ForeignKey(
        "crm.Office", on_delete=models.CASCADE, blank=False, help_text="Office the person works at"
    )

    objects = PeopleManager()

    def __str__(self):
        return "{}: {} {} ({})".format(self.office.business.name, self.first_name, self.last_name, self.public_id)
