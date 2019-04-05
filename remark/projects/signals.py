from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Spreadsheet


@receiver(post_save, sender=Spreadsheet)
def activate_new_spreadsheets(sender, instance, created, raw, **kwargs):
    if (not raw) and created and instance.is_latest_for_kind():
        # TODO need to multiplex on the spreadsheet Kind/Subkind
        # to decide exactly what to do here. Is there any elegant
        # way to express this? -Dave
        pass
