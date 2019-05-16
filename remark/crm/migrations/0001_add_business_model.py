# Generated by Django 2.2.1 on 2019-05-24 05:45

from django.db import migrations, models
import django.db.models.deletion
import remark.crm.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        (
            "geo",
            "0009_usacensushouseholdbytype_usacensusincomedistribution_usacensuspopulationbyage_usacensuszip",
        )
    ]

    operations = [
        migrations.CreateModel(
            name="Business",
            fields=[
                (
                    "public_id",
                    models.CharField(
                        default=remark.crm.models.bus_public_id,
                        editable=False,
                        help_text="A unique identifier for this business that is safe to share publicly.",
                        max_length=24,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("name", models.CharField(help_text="Business Name", max_length=255)),
                (
                    "business_type",
                    models.IntegerField(
                        choices=[
                            (1, "Property Owner"),
                            (2, "Asset Manager"),
                            (3, "Property Manager"),
                            (4, "Remarkably"),
                        ],
                        help_text="Business Type",
                    ),
                ),
                (
                    "address",
                    models.ForeignKey(
                        help_text="Address",
                        on_delete=django.db.models.deletion.CASCADE,
                        to="geo.Address",
                    ),
                ),
            ],
            options={"verbose_name_plural": "Businesses"},
        )
    ]
