# Generated by Django 2.2.4 on 2019-09-10 00:00

from django.db import migrations

from remark.email_app.constants import DEFAULT_SENDER_REPLY_TO


def set_default_listserv_email(apps, schema_editor):
    # Set default listserv email address for all existing projects
    Project = apps.get_model("projects", "Project")
    ListservEmail = apps.get_model("email_app", "ListservEmail")

    default_email = ListservEmail.objects.get(email=DEFAULT_SENDER_REPLY_TO)
    if default_email:
        for project in Project.objects.all():
            project.listserv_email = default_email
            project.save()


class Migration(migrations.Migration):

    dependencies = [("projects", "0072_add_listserv_email_field")]

    operations = [migrations.RunPython(set_default_listserv_email)]
