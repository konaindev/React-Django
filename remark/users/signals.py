from django.contrib.auth.models import Group
from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from remark.email_app.reports.weekly_performance import update_project_contacts
from remark.projects.models import Project

from .models import User


def get_project_from_group(group):
    project = getattr(group, "admin_of", None)
    if not project:
        project = getattr(group, "view_of", None)
    return project


@receiver(m2m_changed, sender=User.groups.through)
def update_contacts_when_group_changed(sender, instance, action, **kwargs):
    if action in ["post_add", "post_remove", "post_clear"]:
        if isinstance(instance, Group):
            project = get_project_from_group(instance)
            if project:
                update_project_contacts.apply_async(args=(project.get_project_public_id(),), countdown=2)
        else:  # Groups added
            if kwargs["pk_set"]:
                groups = Group.objects.filter(pk__in=kwargs["pk_set"])
                for g in groups:
                    p = get_project_from_group(g)
                    if p:
                        update_project_contacts.apply_async(args=(p.get_project_public_id(),), countdown=2)


@receiver(post_save, sender=User)
def update_contacts_when_activation_changed(sender, instance, **kwargs):
    if instance.is_subscription_changed:
        projects = Project.objects.get_all_for_user(instance)
        for p in projects:
            update_project_contacts.apply_async(args=(p.get_project_public_id(),), countdown=2)
