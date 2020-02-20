# Generated by Django 2.2.10 on 2020-02-19 00:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('insights', '0007_create_pre_existing_kpis'),
    ]

    operations = [
        migrations.AddField(
            model_name='suggestedaction',
            name='internal_name',
            field=models.TextField(default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='suggestedaction',
            name='description',
            field=models.TextField(default='', max_length=160),
        ),
        migrations.AlterField(
            model_name='suggestedaction',
            name='title',
            field=models.CharField(default='', max_length=50),
        ),
        migrations.AlterUniqueTogether(
            name='actionandtacticsjunction',
            unique_together={('suggested_action', 'tactic')},
        ),
    ]