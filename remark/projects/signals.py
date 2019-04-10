from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Spreadsheet


@receiver(post_save, sender=Spreadsheet)
def activate_spreadsheets_if_safe(sender, instance, created, raw, **kwargs):
    if not raw:
        instance.activate()
