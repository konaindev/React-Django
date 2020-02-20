# Generated by Django 2.2.10 on 2020-02-18 8:23

from django.db import migrations, models

from remark.insights.constants import KPI_NAMES 


def create_pre_existing_kpis(apps, schema_editor):
    KPI = apps.get_model("insights", "KPI")

    for kpi_value in KPI_NAMES.keys():
        kpi_object = KPI(name=kpi_value)
        kpi_object.save()


class Migration(migrations.Migration):

    dependencies = [("insights", "0006_add_kpi_suggested_action_tactics")]

    operations = [
        migrations.RunPython(create_pre_existing_kpis, reverse_code=migrations.RunPython.noop)
    ]