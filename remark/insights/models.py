import json

from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models

from remark.lib.tokens import public_id


def get_weekly_insights_id():
    return public_id("weekly_insights")


def get_baseline_insights_id():
    return public_id("baseline_insights")


def get_performance_insights_id():
    return public_id("performance_insights")


class AbstractBaseInsights(models.Model):
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        help_text="Project",
        blank=False,
        null=False,
    )

    start = models.DateField(help_text="Start date", blank=False, null=False)

    end = models.DateField(help_text="End date", blank=False, null=False)

    facts = JSONField(encoder=DjangoJSONEncoder, blank=False, null=False)

    insights = JSONField(encoder=DjangoJSONEncoder, blank=False, null=False)

    class Meta:
        abstract = True


class WeeklyInsights(AbstractBaseInsights):
    id = models.CharField(
        primary_key=True, max_length=32, default=get_weekly_insights_id
    )


class BaselineInsights(AbstractBaseInsights):
    id = models.CharField(
        primary_key=True, max_length=34, default=get_baseline_insights_id
    )


class PerformanceInsights(AbstractBaseInsights):
    id = models.CharField(
        primary_key=True, max_length=37, default=get_performance_insights_id
    )
