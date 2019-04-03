# Generated by Django 2.1.7 on 2019-04-03 21:39

from django.db import migrations


def migrate_rents(apps, schema_editor):
    # Grab the lowest and average monthly rent values for the first period
    # of each project, and copy them over to the project itself.
    Project = apps.get_model("projects", "Project")
    for project in Project.objects.all():
        first_period = project.periods.first()
        project.average_monthly_rent = (
            first_period.monthly_average_rent
        )  # INTENTIONAL name change
        project.lowest_monthly_rent = first_period.lowest_monthly_rent
        project.save()


class Migration(migrations.Migration):

    dependencies = [("projects", "0015_add_rents_to_project")]

    operations = [migrations.RunPython(migrate_rents)]
