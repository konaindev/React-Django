import json

from django.db import models

from remark.lib.tokens import public_id


def get_weekly_insights_id():
    return public_id("weekly_insights")


def get_baseline_insights_id():
    return public_id("baseline_ins")


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

    facts = models.TextField(blank=False, null=False)

    insights = models.TextField(blank=False, null=False)

    @property
    def facts_data(self):
        return json.loads(self.facts)

    @facts_data.setter
    def facts_data(self, value):
        data = json.dumps(value, default=str)
        self.facts = data

    @property
    def insights_data(self):
        return json.loads(self.insights)

    @insights_data.setter
    def insights_data(self, value):
        data = json.dumps(value, default=str)
        self.insights = data


class BaselineInsights(models.Model):
    id = models.CharField(
        primary_key=True, max_length=32, default=get_baseline_insights_id
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

    facts = models.TextField(blank=False, null=False)

    insights = models.TextField(blank=False, null=False)

    @property
    def facts_data(self):
        return json.loads(self.facts)

    @facts_data.setter
    def facts_data(self, value):
        data = json.dumps(value, default=str)
        self.facts = data

    @property
    def insights_data(self):
        return json.loads(self.insights)

    @insights_data.setter
    def insights_data(self, value):
        data = json.dumps(value, default=str)
        self.insights = data
