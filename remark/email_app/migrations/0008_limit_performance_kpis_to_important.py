# Generated by Django 2.2.9 on 2020-02-18 17:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('email_app', '0007_remove_performanceemail_lease_rate_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='performanceemail',
            name='low_performing_kpi',
            field=models.TextField(choices=[('retention_rate', 'Retained Rate'), ('cds', 'Cancellations and Denials'), ('vacate', 'Number of Notices to Vacate'), ('usv', 'Number of Unique Site Visitors'), ('inq', 'Number of Inquiries'), ('tou', 'Number of Tours'), ('app', 'Number of Lease Applications'), ('exe', 'Number of Lease Executions'), ('usv_inq', 'Unique Site Visitors > Inquiries'), ('inq_tou', 'Inquiries > Tours'), ('tou_app', 'Tours > Lease Applications'), ('usv_exe', 'Unique Site Visitors > Lease Executions')]),
        ),
        migrations.AlterField(
            model_name='performanceemail',
            name='top_performing_kpi',
            field=models.TextField(choices=[('retention_rate', 'Retained Rate'), ('cds', 'Cancellations and Denials'), ('vacate', 'Number of Notices to Vacate'), ('usv', 'Number of Unique Site Visitors'), ('inq', 'Number of Inquiries'), ('tou', 'Number of Tours'), ('app', 'Number of Lease Applications'), ('exe', 'Number of Lease Executions'), ('usv_inq', 'Unique Site Visitors > Inquiries'), ('inq_tou', 'Inquiries > Tours'), ('tou_app', 'Tours > Lease Applications'), ('usv_exe', 'Unique Site Visitors > Lease Executions')]),
        ),
        migrations.AlterField(
            model_name='performanceemailkpi',
            name='name',
            field=models.TextField(choices=[('retention_rate', 'Retained Rate'), ('cds', 'Cancellations and Denials'), ('vacate', 'Number of Notices to Vacate'), ('usv', 'Number of Unique Site Visitors'), ('inq', 'Number of Inquiries'), ('tou', 'Number of Tours'), ('app', 'Number of Lease Applications'), ('exe', 'Number of Lease Executions'), ('usv_inq', 'Unique Site Visitors > Inquiries'), ('inq_tou', 'Inquiries > Tours'), ('tou_app', 'Tours > Lease Applications'), ('usv_exe', 'Unique Site Visitors > Lease Executions')]),
        ),
    ]
