# Generated by Django 2.2.4 on 2019-09-10 00:00

from django.db import migrations


def add_default_listserv_email(apps, schema_editor):
    # Add company's default listserv email for all existing Project's
    ListservEmail = apps.get_model("email_app", "ListservEmail")
    ListservEmail.objects.get_or_create(email="customersuccess@remarkably.io")


class Migration(migrations.Migration):

    dependencies = [("email_app", "0004_create_listserv_email_table")]

    operations = [migrations.RunPython(add_default_listserv_email)]
