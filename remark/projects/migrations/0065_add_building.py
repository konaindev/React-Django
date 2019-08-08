# Generated by Django 2.2.3 on 2019-07-26 06:38

from django.db import migrations, models
import django.db.models.deletion
import remark.projects.models


class Migration(migrations.Migration):

    dependencies = [("projects", "0064_auto_20190731_2017")]

    operations = [
        migrations.CreateModel(
            name="Building",
            fields=[
                (
                    "public_id",
                    models.CharField(
                        default=remark.projects.models.building_public_id,
                        editable=False,
                        max_length=24,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "building_identifier",
                    models.CharField(help_text="Building identifier", max_length=255),
                ),
                (
                    "number_of_floors",
                    models.IntegerField(
                        default=1, help_text="Number of floors in the building"
                    ),
                ),
                (
                    "has_elevator",
                    models.BooleanField(
                        default=False, verbose_name="Does the building have a elevator?"
                    ),
                ),
                (
                    "number_of_units",
                    models.IntegerField(default=1, help_text="Number of Units"),
                ),
                (
                    "property",
                    models.ForeignKey(
                        help_text="Property",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="projects.Property",
                    ),
                ),
            ],
        )
    ]
