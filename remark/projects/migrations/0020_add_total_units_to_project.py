# Generated by Django 2.1.8 on 2019-04-08 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0019_add_spreadsheets'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='total_units',
            field=models.IntegerField(blank=True, default=None, help_text='The total number of units in this project/property.', null=True),
        ),
    ]