# Generated by Django 2.2.1 on 2019-05-14 17:24

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('projects', '0034_auto_20190514_2003'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(related_name='projects', to=settings.AUTH_USER_MODEL),
        ),
    ]
