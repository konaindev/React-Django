import os

from django.db import models
from django.utils.crypto import get_random_string

from remark.geo.models import Address
from remark.users.models import User


def building_photo_path(product_inquiry, filename):
    _, extension = os.path.splitext(filename)
    random_str = get_random_string(length=7)
    return f"sales/{product_inquiry.product_inquiry_id}/building_photo_{random_str}{extension}"


class ProductInquiry(models.Model):
    PRODUCT_TYPES = [
        ("accelerate", "Accelerate"),
        ("optimize", "Optimize"),
        ("ground", "Ground Up"),
        ("other", "Not Sure"),
    ]

    product_inquiry_id = models.AutoField(primary_key=True)

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False)

    property_name = models.CharField(max_length=255, blank=False, null=False)

    address = models.ForeignKey(
        Address, on_delete=models.CASCADE, null=False, blank=False)

    product_type = models.CharField(
        max_length=10, choices=PRODUCT_TYPES, blank=False, null=False)

    building_photo = models.ImageField(
        upload_to=building_photo_path, null=True, blank=True)
