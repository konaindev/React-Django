# Generated by Django 2.2.2 on 2019-07-02 04:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0050_selected_campaign_model_set_null'),
    ]

    operations = [
        migrations.AddField(
            model_name='targetperiod',
            name='campaign_model',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='projects.CampaignModel'),
        ),
    ]