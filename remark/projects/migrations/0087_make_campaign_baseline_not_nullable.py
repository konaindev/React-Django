# Generated by Django 2.2.10 on 2020-02-26 07:02

from django.db import migrations, models
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0086_migrate_baseline_values_to_campaign'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='baseline_end',
            field=models.DateField(blank=True, null=True, help_text='The final date, exclusive, for the baseline period.'),
        ),
        migrations.AlterField(
            model_name='campaign',
            name='baseline_start',
            field=models.DateField(blank=True, null=True, help_text='The first date, inclusive, for the baseline period.'),
        ),
    ]