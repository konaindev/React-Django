# Generated by Django 2.2.1 on 2019-06-18 05:46

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0001_add_product_inquiry'),
    ]

    operations = [
        migrations.AddField(
            model_name='productinquiry',
            name='created',
            field=models.DateTimeField(blank=True, default=datetime.datetime.utcnow),
        ),
    ]
