# Generated by Django 2.2 on 2019-04-29 18:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0007_disallow_blank_on_formatted_address'),
        ('projects', '0029_add_occupied_units_end_to_period'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='address',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='geo.Address'),
        ),
    ]
