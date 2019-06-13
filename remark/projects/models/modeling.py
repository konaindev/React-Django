import os.path

from datetime import datetime
from django.db import models

from jsonfield import JSONField

from remark.lib.tokens import public_id
from remark.projects.models import Project, spreadsheet_media_path
from remark.projects.spreadsheets import SpreadsheetKind


def campaign_public_id():
    return public_id("campagin")


def campaign_model_public_id():
    return public_id("campaign_model")


def spreadsheet_public_id():
    return public_id("spreadsheet2")


class Campaign(models.Model):
    campaign_id = models.CharField(
        primary_key=True, default=campaign_public_id, max_length=50, editable=False
    )
    name = models.CharField(max_length=255)
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="campaigns", null=True
    )
    selected_campaign_model = models.ForeignKey(
        "CampaignModel", on_delete=models.CASCADE, related_name="+", null=True, blank=True
    )

    def __str__(self):
        return "{} ({})".format(self.name, self.campaign_id)


class CampaignModel(models.Model):
    campaign_model_id = models.CharField(
        primary_key=True,
        default=campaign_model_public_id,
        max_length=50,
        editable=False,
    )
    campaign = models.ForeignKey(
        "Campaign",
        on_delete=models.CASCADE,
        related_name="campaign_models",
        verbose_name="Project",
    )
    spreadsheet = models.ForeignKey(
        "Spreadsheet2", on_delete=models.CASCADE, related_name="campaign_models"
    )
    name = models.CharField(max_length=255)
    model_start = models.DateField()
    model_end = models.DateField()
    active = models.BooleanField(default=True)
    model_index = models.IntegerField(default=0)

    def campaign_project(self):
        return self.campaign.project

    project = property(campaign_project)

    def is_selected(self):
        return self.campaign.selected_campaign_model == self

    selected = property(is_selected)

    def spreadsheet_file_url(self):
        return self.spreadsheet.file_url

    file_url = property(spreadsheet_file_url)

    def spreadsheet_json_data(self):
        return self.spreadsheet.json_data

    json_data = property(spreadsheet_json_data)

    def __str__(self):
        return self.name


class Spreadsheet2(models.Model):
    spreadsheet_id = models.CharField(
        primary_key=True, default=spreadsheet_public_id, max_length=50, editable=False
    )
    file_url = models.FileField(
        blank=False,
        upload_to=spreadsheet_media_path,
        help_text="The underlying spreadsheet (probably .xlsx) file.",
    )
    json_data = JSONField(
        default=None,
        editable=False,
        help_text="Raw imported JSON data. Schema depends on spreadsheet kind.",
    )
    kind = models.CharField(
        blank=False,
        choices=SpreadsheetKind.CHOICES,
        db_index=True,
        max_length=128,
        help_text="The kind of data this spreadsheet contains. Enum: Market, Period, Modeling, Campaign Plan",
    )
