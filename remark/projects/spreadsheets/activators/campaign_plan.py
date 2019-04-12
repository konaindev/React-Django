from .json_activators import JSONFieldActivator


class CampaignPlanActivator(JSONFieldActivator):
    spreadsheet_kind = "campaign"
    project_field = "tmp_campaign_plan_json"
