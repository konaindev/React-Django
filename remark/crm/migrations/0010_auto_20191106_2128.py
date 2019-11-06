# Generated by Django 2.2.6 on 2019-11-06 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0009_change_user_filed_to_one_to_one'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='person',
            name='cell_phone',
        ),
        migrations.AddField(
            model_name='person',
            name='office_phone_country_code',
            field=models.CharField(blank=True, help_text='Office phone country code', max_length=5),
        ),
        migrations.AddField(
            model_name='person',
            name='office_phone_ext',
            field=models.CharField(blank=True, help_text='Phone extension', max_length=255),
        ),
    ]
