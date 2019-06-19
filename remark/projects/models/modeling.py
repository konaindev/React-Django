import os.path

from datetime import datetime
from django.db import models

from jsonfield import JSONField

from remark.lib.tokens import public_id
from remark.projects.spreadsheets import SpreadsheetKind
from .projects import TargetPeriod


def campaign_public_id():
    return public_id("campaign")


def campaign_model_public_id():
    return public_id("campaign_model")


def spreadsheet_public_id():
    return public_id("spreadsheet2")


def spreadsheet_media_path(spreadsheet, filename):
    # Spreadsheet2 model doesn't have "project", "created" fields
    # These fields are set from forms temporarily
    _, extension = os.path.splitext(filename)
    sheetname = "_".join(
        [spreadsheet.kind, spreadsheet.created.strftime("%Y-%m-%d_%H-%M-%S")]
    )
    return f"project/{spreadsheet.project.public_id}/{sheetname}{extension}"


class Campaign(models.Model):
    campaign_id = models.CharField(
        primary_key=True, default=campaign_public_id, max_length=50, editable=False
    )
    name = models.CharField(max_length=255)
    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="campaigns",
        null=True,
    )
    selected_campaign_model = models.ForeignKey(
        "CampaignModel",
        on_delete=models.CASCADE,
        related_name="+",
        null=True,
        blank=True,
        help_text="All target values will be replaced by those in the newly selected model.",
    )

    # This value is set when the instance is created; if we later
    # call save, and it changes, then we update targets for the model.
    __selected_campaign_model = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Save this for comparison purposes on save(...)
        self.__selected_campaign_model = self.selected_campaign_model

    def save(self, *args, **kwargs):
        model_selection_changed = (
            self.__selected_campaign_model != self.selected_campaign_model
        )
        super().save(*args, **kwargs)
        if model_selection_changed:
            self.update_for_selected_model()

    def get_selected_model_option(self):
        """Return the currently selected model option."""
        if self.selected_campaign_model is None:
            return

        return self.selected_campaign_model.spreadsheet.json_data

    def update_for_selected_model(self):
        """
        Update all associated data (like target periods) based on
        the currently selected model.
        """

        def _create_target_period(data):
            target_period = TargetPeriod(project=self.project)
            for k, v in data.items():
                # Yes, this will set values for keys that aren't fields;
                # that's fine; we don't overwrite anything we shouldn't,
                # and extraneous stuff is ignored for save.
                setattr(target_period, k, v)
            target_period.save()
            return target_period

        if self.project is None:
            return

        # Remove all extant target periods
        self.project.target_periods.all().delete()

        # If there are any, create new target periods!
        option = self.get_selected_model_option()
        if option is not None:
            for data in option.get("targets", []):
                _create_target_period(data)

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
        "Campaign", on_delete=models.CASCADE, related_name="campaign_models"
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

    class Meta:
        ordering = ["model_index"]


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
        help_text="Raw imported JSON data. Schema depends on spreadsheet kind.",
    )
    kind = models.CharField(
        blank=False,
        choices=SpreadsheetKind.CHOICES,
        db_index=True,
        max_length=128,
        help_text="The kind of data this spreadsheet contains. Enum: Market, Period, Modeling, Campaign Plan",
    )
