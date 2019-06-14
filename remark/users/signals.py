from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User
from remark.crm.models import Person

"""
We want to keep the email address sync'ed between User <-> Person
"""
@receiver(post_save, sender=User)
def update_person_email(sender, instance, created, raw, **kwargs):
    if instance.person is not None:
        instance.person.email = instance.email
        instance.person.save()
