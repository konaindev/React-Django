# Generated by Django 2.1.8 on 2019-04-15 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projects", "0021_auto_20190410_2003")]

    operations = [
        migrations.RenameField(
            model_name="period",
            old_name="target_lease_percent",
            new_name="target_leased_rate",
        )
    ]
