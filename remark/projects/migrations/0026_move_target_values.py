# Generated by Django 2.1.8 on 2019-04-16 20:39

from django.db import migrations


def move_target_values(apps, schema_editor):
    Period = apps.get_model("projects", "Period")
    TargetPeriod = apps.get_model("projects", "TargetPeriod")
    TARGET_FIELD_NAMES = [
        field.name
        for field in Period._meta.get_fields()
        if field.name.startswith("target_")
    ]

    for period in Period.objects.all():
        target_period = TargetPeriod(
            project=period.project, start=period.start, end=period.end
        )
        for target_field_name in TARGET_FIELD_NAMES:
            value = getattr(period, target_field_name)
            setattr(target_period, target_field_name, value)
        target_period.save()


class Migration(migrations.Migration):

    dependencies = [("projects", "0025_add_target_period")]

    operations = [migrations.RunPython(move_target_values)]
