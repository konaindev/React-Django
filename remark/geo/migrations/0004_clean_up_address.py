# Generated by Django 2.1.8 on 2019-04-25 23:47

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0003_rename_geocode_field'),
    ]

    operations = [
        migrations.AlterField(
            model_name='address',
            name='geocode_json',
            field=jsonfield.fields.JSONField(blank=True, default=None, help_text='Raw JSON response from google geocode', null=True),
        ),
        migrations.AlterField(
            model_name='address',
            name='street_address_2',
            field=models.CharField(blank=True, default='', help_text='Street address 2', max_length=255),
        ),
        migrations.AlterField(
            model_name='address',
            name='zip_code',
            field=models.CharField(help_text='ZIP5', max_length=32),
        ),
    ]
