# Generated by Django 2.2.10 on 2020-02-20 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0082_set_reporting_day'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]
