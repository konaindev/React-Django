# Generated by Django 2.1.7 on 2019-04-03 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("projects", "0014_add_average_tenant_age")]

    operations = [
        migrations.AddField(
            model_name="project",
            name="highest_monthly_rent",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                default=None,
                help_text="Highest rent tenants pay monthly. Applies for the duration of the project.",
                max_digits=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="average_monthly_rent",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                default=None,
                help_text="Average rent tenants pay monthly. Applies for the duration of the project.",
                max_digits=10,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="lowest_monthly_rent",
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                default=None,
                help_text="Lowest rent tenants pay monthly. Applies for the duration of the project.",
                max_digits=10,
                null=True,
            ),
        ),
    ]
