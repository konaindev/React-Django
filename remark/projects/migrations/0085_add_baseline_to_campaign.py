# Generated by Django 2.2.10 on 2020-02-25 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0084_add_objective_to_campaign'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='baseline_end',
            field=models.DateField(help_text='The final date, exclusive, for the baseline period.', null=True),
        ),
        migrations.AddField(
            model_name='campaign',
            name='baseline_start',
            field=models.DateField(help_text='The first date, inclusive, for the baseline period.', null=True),
        ),
    ]
