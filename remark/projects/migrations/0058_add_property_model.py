# Generated by Django 2.2.3 on 2019-07-11 11:54

from django.db import migrations, models
import django.db.models.deletion
import remark.projects.models
import stdimage.models


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0012_add_has_population_to_zipcode'),
        ('projects', '0057_merge_20190719_0759'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('property_id', models.AutoField(primary_key=True, serialize=False)),
                ('public_id', models.CharField(default=remark.projects.models.public_property_id, editable=False, max_length=50, unique=True)),
                ('name', models.CharField(help_text='The user-facing name of the project.', max_length=255)),
                ('average_tenant_age', models.IntegerField(blank=True, default=0, help_text='The average tenant age for this property.', null=True)),
                ('total_units', models.IntegerField(default=0, help_text='The total number of units in this property.')),
                ('highest_monthly_rent', models.DecimalField(decimal_places=2, default=0, help_text='Highest rent tenants pay monthly. Applies for the duration of the project.', max_digits=10)),
                ('average_monthly_rent', models.DecimalField(decimal_places=2, default=0, help_text='Average rent tenants pay monthly. Applies for the duration of the project.', max_digits=10)),
                ('lowest_monthly_rent', models.DecimalField(decimal_places=2, default=0, help_text='Lowest rent tenants pay monthly. Applies for the duration of the project.', max_digits=10)),
                ('building_logo', stdimage.models.StdImageField(blank=True, default='', help_text='Image of property logo<br/>Resized variants (180x180, 76x76) will also be created on Amazon S3.', upload_to=remark.projects.models.building_logo_media_path)),
                ('building_image', stdimage.models.StdImageField(blank=True, default='', help_text='Image of property building<br/>Resized variants (309x220, 180x180, 76x76) will also be created on Amazon S3.', upload_to=remark.projects.models.building_image_media_path)),
                ('geo_address', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='geo.Address')),
            ],
        ),
        migrations.AddField(
            model_name='project',
            name='property',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='projects.Property'),
        ),
    ]
