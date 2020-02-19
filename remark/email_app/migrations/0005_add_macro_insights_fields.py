# Generated by Django 2.2.9 on 2020-01-30 21:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('email_app', '0004_set_blank_true_to_email_campaign_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='performanceemail',
            name='top_macro_insight_1',
            field=models.TextField(blank=True, help_text='Highest Priority Macro Insight', null=True),
        ),
        migrations.AddField(
            model_name='performanceemail',
            name='top_macro_insight_2',
            field=models.TextField(blank=True, help_text='Second Highest Priority Macro Insight', null=True),
        ),
        migrations.AddField(
            model_name='performanceemail',
            name='top_macro_insight_3',
            field=models.TextField(blank=True, help_text='Third Highest Priority Macro Insight', null=True),
        ),
    ]
