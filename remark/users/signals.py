from django.contrib.auth.models import Group
from django.db.models.signals import m2m_changed, pre_save, post_save
from django.dispatch import receiver

from remark.email_app.reports.weekly_performance import update_project_contacts
from remark.projects.models import Project

from .models import User


@receiver(m2m_changed, sender=User.groups.through)
def set_group_subscription_changed(sender, instance, **kwargs):
    if isinstance(instance, Group):
        project = getattr(instance, "admin_of", None)
        if not project:
            project = instance.view_of
        project.set_subscription_changed()
    else:
        instance.set_subscription_changed()


@receiver(m2m_changed, sender=User.report_projects.through)
def set_subscription_changed(sender, instance, **kwargs):
    instance.set_subscription_changed()


@receiver(pre_save, sender=User)
def check_subscription_changed(sender, instance, **kwargs):
    public_id = instance.public_id
    if public_id:
        old_user = User.objects.get(public_id=instance.public_id)
        instance.check_activation_changed(old_user)


@receiver(post_save, sender=User)
def update_subscription_contacts(sender, instance, **kwargs):
    if instance.is_subscription_changed:
        projects = Project.objects.get_all_for_user(instance)
        for p in projects:
            update_project_contacts.apply_async(args=(p.get_project_public_id(),))
        instance.reset_subscription_changed()
