# Generated by Django 2.1.7 on 2019-03-05 23:06

from django.db import migrations
import jsonfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0006_add_lowest_monthly_rent'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='tmp_market_analysis_json',
            field=jsonfield.fields.JSONField(blank=True, default=None, help_text='Total Addressable Market (TAM) report JSON data. Must conform to the schema defined in MarketAnalysis.ts', null=True),
        ),
        migrations.AddField(
            model_name='project',
            name='tmp_model_options_json',
            field=jsonfield.fields.JSONField(blank=True, default=None, help_text='Modeling JSON data. Must conform to the schema defined in ModelingOptions.ts', null=True),
        ),
    ]
