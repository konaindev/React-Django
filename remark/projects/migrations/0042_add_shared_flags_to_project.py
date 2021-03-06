# Generated by Django 2.2 on 2019-05-10 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0041_auto_20190613_2318'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_baseline_report_shared',
            field=models.BooleanField(default=False, verbose_name='Share Baseline Report?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_campaign_plan_shared',
            field=models.BooleanField(default=False, verbose_name='Share Campaign Plan?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_modeling_shared',
            field=models.BooleanField(default=False, verbose_name='Share Modeling?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_performance_report_shared',
            field=models.BooleanField(default=False, verbose_name='Share Performance Report?'),
        ),
        migrations.AddField(
            model_name='project',
            name='is_tam_shared',
            field=models.BooleanField(default=False, verbose_name='Share TAM?'),
        ),
    ]
