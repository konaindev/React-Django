import json

from django.contrib.postgres.fields import JSONField
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models

from .constants import KPI_NAMES
from remark.lib.tokens import public_id


def get_weekly_insights_id():
    return public_id("weekly_insights")


def get_baseline_insights_id():
    return public_id("baseline_insights")


def get_performance_insights_id():
    return public_id("performance_insights")


def get_suggested_action_id():
    return public_id("action")


def get_suggested_action_tactic_id():
    return public_id("tactic")


def get_kpi_id():
    return public_id("kpi")


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


class InsightManager(models.Manager):
    pass


class Insight(models.Model):
    objects = InsightManager()

    name = models.CharField(max_length=62)
    description = models.TextField(null=True, blank=True)
    include_in_email = models.BooleanField(default=True)

    priority_order = models.PositiveIntegerField(default=0)

    class Meta(object):
        ordering = ["priority_order"]


class SuggestedActionTacticManager(models.Manager):
    pass


class SuggestedActionTactic(models.Model):
    public_id = models.CharField(
        primary_key=True,
        max_length=32,
        default=get_suggested_action_tactic_id,
        editable=False,
    )

    name = models.CharField(max_length=50)
    description = models.TextField(max_length=160)

    def __str__(self):
        return self.name


class SuggestedActionManager(models.Manager):
    pass


class SuggestedAction(models.Model):
    public_id = models.CharField(
        primary_key=True, max_length=32, default=get_suggested_action_id, editable=False
    )

    title = models.CharField(max_length=50, default="")
    internal_name = models.TextField(max_length=100, default="")
    description = models.TextField(max_length=160, default="", blank=True)
    tactics = models.ManyToManyField(
        SuggestedActionTactic, blank=True, through="ActionAndTacticsJunction"
    )

    def __str__(self):
        return self.internal_name


class ActionAndTacticsJunction(models.Model):
    """
    Required for 'django-admin-sortable2' package
    Junction table model which connects SuggestedActionTactic <=> SuggestedAction
    """
    suggested_action = models.ForeignKey(SuggestedAction, on_delete=models.CASCADE)
    tactic = models.ForeignKey(SuggestedActionTactic, on_delete=models.CASCADE)
    tactic_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("tactic_order",)
        unique_together = (("suggested_action", "tactic",),)


class KPIManager(models.Manager):
    pass


class KPI(models.Model):
    public_id = models.CharField(
        primary_key=True, max_length=24, default=get_kpi_id, editable=False,
    )

    name = models.TextField(
        choices=KPI_NAMES.items(), help_text="KPI name, user cannot edit"
    )
    definition = models.CharField(
        max_length=255, null=True, blank=True, help_text="KPI Definition"
    )

    on_track_category_1_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="On Track - Category 1",
        help_text="Suggested Action",
    )
    on_track_category_2_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="On Track - Category 2",
        help_text="Suggested Action",
    )

    off_track_category_1_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="Off Track/At Risk - Category 1",
        help_text="Suggested Action",
    )
    off_track_category_2_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="Off Track/At Risk - Category 2",
        help_text="Suggested Action",
    )

    baseline_category_1_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="Baseline - Category 1",
        help_text="Suggested Action",
    )
    baseline_category_2_action = models.OneToOneField(
        "insights.SuggestedAction",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="+",
        verbose_name="Baseline - Category 2",
        help_text="Suggested Action",
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "KPI"
