# Generated by Django 2.1.8 on 2019-04-16 19:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0023_alter_kind_on_spreadsheet'),
    ]

    operations = [
        migrations.AddField(
            model_name='period',
            name='target_occupied_units',
            field=models.IntegerField(blank=True, default=None, help_text='Target: occupied units', null=True),
        ),
    ]