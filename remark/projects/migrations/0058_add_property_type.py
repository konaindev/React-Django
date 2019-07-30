# Generated by Django 2.2.3 on 2019-07-24 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projects", "0057_merge_20190719_0759")]

    operations = [
        migrations.AddField(
            model_name="project",
            name="property_type",
            field=models.IntegerField(
                choices=[
                    (1, "Multifamily - Standard"),
                    (2, "Multifamily - Micro"),
                    (3, "Student Housing"),
                    (4, "Senior Housing"),
                    (5, "Planned Communities"),
                    (6, "Condominiums"),
                ],
                null=True,
            ),
        )
    ]