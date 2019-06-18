# Generated by Django 2.2.2 on 2019-06-18 18:17

from django.db import migrations, models
import django.db.models.deletion
import jsonfield.fields
import remark.projects.models.modeling
import remark.projects.models.projects


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0040_merge_20190612_1859'),
    ]

    operations = [
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('campaign_id', models.CharField(default=remark.projects.models.modeling.campaign_public_id, editable=False, max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Spreadsheet2',
            fields=[
                ('spreadsheet_id', models.CharField(default=remark.projects.models.modeling.spreadsheet_public_id, editable=False, max_length=50, primary_key=True, serialize=False)),
                ('file_url', models.FileField(help_text='The underlying spreadsheet (probably .xlsx) file.', upload_to=remark.projects.models.modeling.spreadsheet_media_path)),
                ('json_data', jsonfield.fields.JSONField(default=None, editable=False, help_text='Raw imported JSON data. Schema depends on spreadsheet kind.')),
                ('kind', models.CharField(choices=[('periods', 'Periods'), ('model', 'Modeling'), ('market', 'Market Report'), ('campaign', 'Campaign Plan')], db_index=True, help_text='The kind of data this spreadsheet contains. Enum: Market, Period, Modeling, Campaign Plan', max_length=128)),
            ],
        ),
        migrations.AlterField(
            model_name='project',
            name='competitors',
            field=models.ManyToManyField(blank=True, to='projects.Project'),
        ),
        migrations.AlterField(
            model_name='spreadsheet',
            name='file',
            field=models.FileField(help_text='The underlying spreadsheet (probably .xlsx) file.', upload_to=remark.projects.models.projects.spreadsheet_media_path),
        ),
        migrations.CreateModel(
            name='CampaignModel',
            fields=[
                ('campaign_model_id', models.CharField(default=remark.projects.models.modeling.campaign_model_public_id, editable=False, max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('model_start', models.DateField()),
                ('model_end', models.DateField()),
                ('active', models.BooleanField(default=True)),
                ('model_index', models.IntegerField(default=0)),
                ('campaign', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaign_models', to='projects.Campaign', verbose_name='Project')),
                ('spreadsheet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='campaign_models', to='projects.Spreadsheet2')),
            ],
            options={
                'ordering': ['model_index'],
            },
        ),
        migrations.AddField(
            model_name='campaign',
            name='project',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='campaigns', to='projects.Project'),
        ),
        migrations.AddField(
            model_name='campaign',
            name='selected_campaign_model',
            field=models.ForeignKey(blank=True, help_text='All target values will be replaced by those in the newly selected model.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to='projects.CampaignModel'),
        ),
    ]
