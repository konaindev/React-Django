# Generated by Django 2.2.1 on 2019-05-21 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0009_usacensushouseholdbytype_usacensusincomedistribution_usacensuspopulationbyage_usacensuszip'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='zipcodepolygon',
            name='properties',
        ),
        migrations.AddField(
            model_name='zipcodepolygon',
            name='land_area',
            field=models.FloatField(default=0, help_text='Land area in square meters'),
        ),
        migrations.AddField(
            model_name='zipcodepolygon',
            name='lat',
            field=models.DecimalField(decimal_places=6, default=None, help_text='Latitude of zipcode center', max_digits=9),
        ),
        migrations.AddField(
            model_name='zipcodepolygon',
            name='lon',
            field=models.DecimalField(decimal_places=6, default=None, help_text='Longitude of zipcode center', max_digits=9),
        ),
        migrations.AddField(
            model_name='zipcodepolygon',
            name='water_area',
            field=models.FloatField(default=0, help_text='Water area in square meters'),
        ),
        migrations.AddIndex(
            model_name='zipcodepolygon',
            index=models.Index(fields=['zip_code', 'lat', 'lon'], name='geo_zipcode_zip_cod_6e177e_idx'),
        ),
    ]
