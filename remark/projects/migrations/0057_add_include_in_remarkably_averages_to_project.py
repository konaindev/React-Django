# Generated by Django 2.2.3 on 2019-07-16 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projects", "0056_remove_users_from_project")]

    operations = [
        migrations.AddField(
            model_name="project",
            name="include_in_remarkably_averages",
            field=models.BooleanField(
                default=True, verbose_name="Include in aggregate averages?"
            ),
        )
    ]
