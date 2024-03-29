# Generated by Django 2.2.2 on 2019-06-18 18:20

from datetime import datetime

from django.db import migrations

from remark.projects.spreadsheets import SpreadsheetKind


def convertStringToDate(date_string):
    """
    Existing data doesn't have unique format of date strings i.e.
    1. MM/DD/YYYY
    2. YYYY-MM-DD
    """
    try:
        return datetime.strptime(date_string, "%m/%d/%Y").date()
    except Exception:
        pass

    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except Exception:
        return None


def copy_modeling_data_of_a_project(project, apps):
    """
    Split "project => tmp_modeling_report_json" data into Campaign, CampaignModel and Spreadsheet2
    """
    Campaign = apps.get_model("projects", "Campaign")
    CampaignModel = apps.get_model("projects", "CampaignModel")
    Spreadsheet2 = apps.get_model("projects", "Spreadsheet2")

    report_json = dict(project.tmp_modeling_report_json)
    modeling_options = report_json.get("options", [])
    campaign = None
    model_index = 0

    for model in modeling_options:
        model_name = model.get("name", "Model")
        model_dates = model.get("dates", {})
        model_start = convertStringToDate(model_dates["start"])
        model_end = convertStringToDate(model_dates["end"])
        model_index = model_index + 1

        # create Campaign for this project, if doesn't exist yet
        if campaign is None:
            campaign = Campaign(
                project=project,
                selected_campaign_model=None,
                name="First Campaign"
            )
            campaign.save()

        spreadsheet = Spreadsheet2(
            file_url="legacy",
            json_data=model,
            kind=SpreadsheetKind.MODELING
        )
        spreadsheet.save()

        campaign_model = CampaignModel(
            campaign=campaign,
            spreadsheet=spreadsheet,
            name=model_name,
            model_start=model_start,
            model_end=model_end,
            model_index=model_index
        )
        campaign_model.save()

        # save selected model to Campaign if model is set as selected in Project
        if project.selected_model_name == model_name:
            campaign.selected_campaign_model = campaign_model
            campaign.save()


def copy_modeling_data(apps, schema_editor):
    """
    Create campaigns for all the projects.
    Copy modeling references over to the new model structure.
    """
    Project = apps.get_model("projects", "Project")

    for project in Project.objects.all():
        if project.tmp_modeling_report_json:
            copy_modeling_data_of_a_project(project, apps)


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0046_add_models_for_modeling_v2'),
    ]

    operations = [
        migrations.RunPython(copy_modeling_data, reverse_code=migrations.RunPython.noop),
    ]
