# Generated by Django 2.2.5 on 2019-11-06 14:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0073_auto_20191105_1319'),
    ]

    operations = [
        migrations.AddField(
            model_name='property',
            name='property_url',
            field=models.URLField(blank=True, max_length=128, null=True),
        ),
    ]
