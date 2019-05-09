# Generated by Django 2.2 on 2019-05-02 14:21

from django.db import migrations, models
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0007_disallow_blank_on_formatted_address'),
    ]

    operations = [
        migrations.CreateModel(
            name='ZipcodePolygon',
            fields=[
                ('zip_code', models.CharField(help_text='5-digit ZIP code', max_length=5, primary_key=True, serialize=False)),
                ('state', models.CharField(help_text='State abbreviation', max_length=2)),
                ('geometry', jsonfield.fields.JSONField(help_text="Geometry JSON data which includes 'type' and 'coordinates'")),
                ('properties', jsonfield.fields.JSONField(help_text='Additional properties in JSON format')),
            ],
        ),
    ]
