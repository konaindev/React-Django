# Generated by Django 2.2.9 on 2020-01-14 12:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('crm', '0010_auto_20191106_2128'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='office',
            field=models.ForeignKey(help_text='Office the person works at', null=True, on_delete=django.db.models.deletion.CASCADE, to='crm.Office'),
        ),
    ]
