# Generated by Django 2.2.10 on 2020-03-02 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0083_add_active_to_campaign'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='objective',
            field=models.IntegerField(choices=[(0, 'Pre-Lease'), (1, 'Lease Up'), (2, 'Phased Delivery / 2+ Buildings'), (3, 'Maintain Stabilization'), (4, 'Manage Occupancy'), (5, 'Improve Performance'), (6, 'Reintroduce Asset'), (7, 'Dual Strategy'), (8, 'Other')], null=True),
        ),
    ]
