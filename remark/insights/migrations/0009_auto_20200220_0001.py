# Generated by Django 2.2.10 on 2020-02-20 00:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0008_add_internal_name_to_action'),
    ]

    operations = [
        migrations.AlterField(
            model_name='suggestedaction',
            name='description',
            field=models.TextField(blank=True, default='', max_length=160),
        ),
    ]