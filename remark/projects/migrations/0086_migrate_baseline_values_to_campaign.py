# Generated by Django 2.2.10 on 2020-02-25 12:21

from django.db import migrations


def fill_baseline_values(apps, schema_editor):
    Campaign = apps.get_model("projects", "Campaign")
    campaigns = Campaign.objects \
        .filter(active=True, baseline_start__isnull=True, baseline_end__isnull=True) \
        .select_related("project")
    for c in campaigns:
        p = c.project
        c.baseline_start = p.baseline_start
        c.baseline_end = p.baseline_end
        c.save()


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0085_add_baseline_to_campaign'),
    ]

    operations = [
        migrations.RunPython(fill_baseline_values),
    ]