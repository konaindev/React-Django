# Generated by Django 2.2.3 on 2019-07-29 12:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0067_add_lease_stage_for_project'),
    ]

    operations = [
        migrations.AlterField(
            model_name='period',
            name='lease_stage',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.LeaseStage'),
        ),
    ]
