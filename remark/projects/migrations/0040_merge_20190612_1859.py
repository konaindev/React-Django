# Generated by Django 2.2.2 on 2019-06-12 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0039_add_building_image_for_front')
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='competitors',
            field=models.ManyToManyField(blank=True, related_name='_project_competitors_+', to='projects.Project'),
        ),
    ]
