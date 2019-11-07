# Generated by Django 2.2.5 on 2019-11-06 00:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('geo', '0012_add_has_population_to_zipcode'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='full_state',
            field=models.CharField(blank=True, help_text='State / Province Full name', max_length=128),
        ),
    ]
