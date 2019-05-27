from django.db import models

from remark.lib.tokens import public_id
from remark.users.constants import ACCOUNT_TYPE
from remark.users.models import User


def bus_public_id():
    """Public identifier for a business."""
    return public_id("bus")


class BusinessesQuerySet(models.QuerySet):
    def property_managers(self, user_id, **kwargs):
        user_subquery = models.Subquery(User.objects.filter(id=user_id).values('account_id'))
        return self.annotate(property_manager__account_id=user_subquery).filter(business_type=3, **kwargs)

    def asset_managers(self, user_id, **kwargs):
        user_subquery = models.Subquery(User.objects.filter(id=user_id).values('account_id'))
        return self.annotate(asset_manager__account_id=user_subquery).filter(business_type=2, **kwargs)


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

    address = models.ForeignKey(
        "geo.Address", on_delete=models.CASCADE, blank=False, help_text="Address"
    )

    objects = BusinessesQuerySet.as_manager()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Businesses"
