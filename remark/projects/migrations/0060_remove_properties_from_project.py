# Generated by Django 2.2.3 on 2019-07-11 12:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0059_create_project_properties'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='address',
        ),
        migrations.RemoveField(
            model_name='project',
            name='average_monthly_rent',
        ),
        migrations.RemoveField(
            model_name='project',
            name='average_tenant_age',
        ),
        migrations.RemoveField(
            model_name='project',
            name='building_image',
        ),
        migrations.RemoveField(
            model_name='project',
            name='building_logo',
        ),
        migrations.RemoveField(
            model_name='project',
            name='highest_monthly_rent',
        ),
        migrations.RemoveField(
            model_name='project',
            name='lowest_monthly_rent',
        ),
        migrations.RemoveField(
            model_name='project',
            name='total_units',
        ),
        migrations.AlterField(
            model_name='project',
            name='property',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='projects.Property'),
        ),
    ]
