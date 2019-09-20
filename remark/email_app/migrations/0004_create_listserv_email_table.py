# Generated by Django 2.2.4 on 2019-09-10 00:00

from django.db import migrations, models
import remark.email_app.models
import remark.lib.fields


class Migration(migrations.Migration):

    dependencies = [("email_app", "0003_perf_email_insight_texts_all_optional")]

    operations = [
        migrations.CreateModel(
            name="ListservEmail",
            fields=[
                (
                    "public_id",
                    models.CharField(
                        default=remark.email_app.models.listserv_public_id,
                        editable=False,
                        max_length=25,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "email",
                    remark.lib.fields.NormalizedEmailField(max_length=254, unique=True),
                ),
                (
                    "sender_id",
                    models.CharField(default=None, max_length=255, null=True),
                ),
            ],
        )
    ]