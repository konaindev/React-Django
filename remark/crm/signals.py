from django.db.models.signals import post_save
from django.dispatch import receiver

from remark.crm.models import Person

"""
We want to keep the email address sync'ed between User <-> Person
"""
@receiver(post_save, sender=Person)
def update_person_email(sender, instance, created, raw, **kwargs):
    if raw:
        return

    if instance.user is not None:
        instance.user.email = instance.email
        instance.user.save()
