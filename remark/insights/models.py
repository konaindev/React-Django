import json

from django.contrib.postgres.fields import JSONField
from django.db import models

from remark.lib.tokens import public_id


def get_weekly_insights_id():
    return public_id("weekly_insights")


def get_baseline_insights_id():
    return public_id("baseline_insights")


class WeeklyInsights(models.Model):
    id = models.CharField(
        primary_key=True, max_length=32, default=get_weekly_insights_id
    )

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        help_text="Project",
        blank=False,
        null=False,
    )

    start = models.DateField(help_text="Start date", blank=False, null=False)

    end = models.DateField(help_text="End date", blank=False, null=False)

    facts = JSONField(blank=False, null=False)

    insights = JSONField(blank=False, null=False)


class BaselineInsights(models.Model):
    id = models.CharField(
        primary_key=True, max_length=34, default=get_baseline_insights_id
    )

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        help_text="Project",
        blank=False,
        null=False,
    )

    start = models.DateField(help_text="Start date", blank=False, null=False)

    end = models.DateField(help_text="End date", blank=False, null=False)

    facts = JSONField(blank=False, null=False)

    insights = JSONField(blank=False, null=False)
