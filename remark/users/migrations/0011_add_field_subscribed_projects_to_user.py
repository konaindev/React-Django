# Generated by Django 2.2.8 on 2019-12-26 12:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0079_add_field_subscribed_projects_to_user'),
        ('users', '0010_user_report_projects'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='report_projects',
        ),
        migrations.CreateModel(
            name='WeeklyPerformanceSubscription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('enabled', models.BooleanField(default=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='user',
            name='subscribed_projects',
            field=models.ManyToManyField(related_name='subscribed_users', through='users.WeeklyPerformanceSubscription', to='projects.Project'),
        ),
    ]
