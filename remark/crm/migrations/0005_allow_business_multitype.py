# Generated by Django 2.2.3 on 2019-07-11 10:21

from django.db import migrations, models


def update_existing_business(apps, schema_editor):
    Business = apps.get_model("crm", "Business")

    for business in Business.objects.all().iterator():
        business.is_property_owner = business.business_type == 1
        business.is_asset_manager = business.business_type == 2
        business.is_property_manager = business.business_type == 3
        business.is_remarkably = business.business_type == 4
        business.save()


def reverse_func(apps, schema_editor):
    Business = apps.get_model("crm", "Business")

    for business in Business.objects.all().iterator():
        if business.is_property_owner:
            business.business_type = 1
        if business.is_asset_manager:
            business.business_type = 2
        if business.is_property_manager:
            business.business_type = 3
        if business.is_remarkably:
            business.business_type = 4
        business.save()


class Migration(migrations.Migration):

    dependencies = [("crm", "0004_auto_20190621_0655")]

    operations = [
        migrations.AddField(
            model_name="business",
            name="is_asset_manager",
            field=models.BooleanField(
                default=False, help_text="Business Type is Asset Manager"
            ),
        ),
        migrations.AddField(
            model_name="business",
            name="is_property_manager",
            field=models.BooleanField(
                default=False, help_text="Business Type is Property Manager"
            ),
        ),
        migrations.AddField(
            model_name="business",
            name="is_property_owner",
            field=models.BooleanField(
                default=False, help_text="Business Type is Property Owner"
            ),
        ),
        migrations.AddField(
            model_name="business",
            name="is_remarkably",
            field=models.BooleanField(
                default=False, help_text="Business Type is Remarkably"
            ),
        ),
        migrations.RunPython(update_existing_business, reverse_func),
        migrations.AlterField(
            model_name="business",
            name="business_type",
            field=models.IntegerField(
                choices=[
                    (1, "Property Owner"),
                    (2, "Asset Manager"),
                    (3, "Property Manager"),
                    (4, "Remarkably"),
                ],
                help_text="Business Type",
                default=1,
            ),
        ),
        migrations.RemoveField(model_name="business", name="business_type"),
    ]
