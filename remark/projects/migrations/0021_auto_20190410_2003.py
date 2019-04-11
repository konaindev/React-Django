# Generated by Django 2.1.8 on 2019-04-10 20:03

from django.db import migrations, models


def set_true_for_existing_projects(apps, schema_editor):
    Project = apps.get_model('projects', 'Project')
    Project.objects.all().update(
        is_baseline_report_public=True,
        is_performance_report_public=True,
        is_campaign_plan_public=True,
        is_modeling_public=True,
        is_tam_public=True,
    )


def do_nothing(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0020_add_total_units_to_project'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_baseline_report_public',
            field=models.BooleanField(default=False, verbose_name='Show Baseline Report?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_campaign_plan_public',
            field=models.BooleanField(default=False, verbose_name='Show Campaign Plan?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_modeling_public',
            field=models.BooleanField(default=False, verbose_name='Show Modeling?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_performance_report_public',
            field=models.BooleanField(default=False, verbose_name='Show Performance Report?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_tam_public',
            field=models.BooleanField(default=False, verbose_name='Show TAM?'),
        ),
        migrations.RunPython(set_true_for_existing_projects, do_nothing),
    ]
