# Generated by Django 2.2.9 on 2020-01-23 19:26

import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0001_add_insights_data_models'),
    ]

    operations = [
        migrations.AlterField(
            model_name='baselineinsights',
            name='facts',
            field=django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder),
        ),
        migrations.AlterField(
            model_name='baselineinsights',
            name='insights',
            field=django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder),
        ),
        migrations.AlterField(
            model_name='weeklyinsights',
            name='facts',
            field=django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder),
        ),
        migrations.AlterField(
            model_name='weeklyinsights',
            name='insights',
            field=django.contrib.postgres.fields.jsonb.JSONField(encoder=django.core.serializers.json.DjangoJSONEncoder),
        ),
    ]
