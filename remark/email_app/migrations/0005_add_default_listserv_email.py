# Generated by Django 2.2.4 on 2019-09-10 00:00

from django.db import migrations

from remark.email_app.constants import DEFAULT_SENDER_REPLY_TO, DEFAULT_SENDER_ID


def add_default_listserv_email(apps, schema_editor):
    # Add company's default listserv email for all existing Project's
    ListservEmail = apps.get_model("email_app", "ListservEmail")
    ListservEmail.objects.get_or_create(
        email=DEFAULT_SENDER_REPLY_TO, sender_id=DEFAULT_SENDER_ID
    )


class Migration(migrations.Migration):

    dependencies = [("email_app", "0004_create_listserv_email_table")]

    operations = [
        migrations.RunPython(
            add_default_listserv_email, reverse_code=migrations.RunPython.noop
        )
    ]