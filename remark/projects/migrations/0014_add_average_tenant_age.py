# Generated by Django 2.1.7 on 2019-04-03 21:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0013_add_campaign_plan_json'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='average_tenant_age',
            field=models.FloatField(blank=True, default=None, help_text='The average tenant age for this project/property.', null=True),
        ),
    ]
