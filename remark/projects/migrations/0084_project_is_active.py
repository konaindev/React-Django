# Generated by Django 2.2.10 on 2020-03-02 20:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0083_add_active_to_campaign'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_active',
            field=models.BooleanField(default=True, verbose_name='activate property?'),
        ),
    ]
