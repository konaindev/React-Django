import json

from django.db import models

from remark.lib.tokens import public_id


def get_weekly_insights_id():
    return public_id("weekly_insights")

def get_weekly_insights_item_id():
    return public_id("weekly_ins_item")

def get_baseline_insights_id():
    return public_id("baseline_ins")

def get_baseline_insights_item_id():
    return public_id("baseline_item")


class WeeklyInsights(models.Model):
    id = models.CharField(
        primary_key=True, max_length=32, default=get_weekly_insights_id, help_text=""
    )

    project_id = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, help_text="Project", blank=False, null=False
    )

    start = models.DateField(
        help_text="", blank = False, null = False
    )


class WeeklyInsightsItem(models.Model):
    id = models.CharField(
        primary_key=True, help_text="", max_length=32, default=get_weekly_insights_item_id
    )

    weekly_insights_id = models.ForeignKey(
        "WeeklyInsights", help_text="Weekly Insights", on_delete=models.CASCADE, blank=False, null=False
    )

    insight_id = models.CharField(max_length=256, blank=False, null=False)

    modifier_id = models.CharField(max_length=256, blank=True, null=True)

    insight_text = models.TextField(blank=False, null=False)

    insight_data = models.TextField(blank=False, null=False)

    priority = models.IntegerField(blank=False, null=False)

    @property
    def data(self):
        return json.loads(self.insight_data)

    @data.setter
    def data(self, value):
        data = json.dumps(value)
        self.insight_data = data

class BaselineInsights(models.Model):
    id = models.CharField(
        primary_key=True, help_text="", max_length=32, default=get_baseline_insights_id
    )

    project_id = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, help_text="Project", blank=False, null=False
    )

    start = models.DateField(
        help_text="", blank = False, null = False
    )


class BaselineInsightsItem(models.Model):
    id = models.CharField(
        primary_key=True, help_text="", max_length=32, default=get_baseline_insights_item_id
    )

    baseline_insights_id = models.ForeignKey(
        "BaselineInsights", help_text="Baseline Insights", on_delete=models.CASCADE, blank=False, null=False
    )

    insight_id = models.CharField(max_length=256, blank=False, null=False)

    modifier_id = models.CharField(max_length=256, blank=True, null=True)

    insight_text = models.TextField(blank=False, null=False)

    insight_data = models.TextField(blank=False, null=False)

    priority = models.IntegerField(blank=False, null=False)

    @property
    def data(self):
        return json.loads(self.insight_data)

    @data.setter
    def data(self, value):
        data = json.dumps(value)
        self.insight_data = data
