import djclick as click

import datetime

from django.template.loader import get_template
from django.template import Context

from remark.users.models import User
from remark.projects.models import Project, Spreadsheet
from remark.projects.reports.performance import PerformanceReport

def int_formatter(value):
    return int(value)

def percent_formatter_2(value):
    return percent_formatter(value, digits=2)

def percent_formatter(value, digits=0):
    initial = float(value) * 100.0
    if digits == 1:
        final = "{:.1f}".format(initial)
    elif digits == 0:
        final = "{:.0f}".format(initial)
    else:
        final = "{:.2f}".format(initial)
    return final + "%"

def currency_formatter(value):
    initial = float(value)
    final = "{:.2f}".format(initial)
    return "$" + final

def none_wrapper(formatter, selector, obj):
    try:
        result = selector(obj)
        return formatter(result)
    except:
        return None

SELECTORS = {
    "lease_rate" : lambda x : x["property"]["leasing"]["rate"],
    "retention_rate" : lambda x : x["property"]["leasing"]["renewal_rate"],
    "occupied_rate" : lambda x : x["property"]["leasing"]["rate"],
    "cds" : lambda x : x["property"]["leasing"]["cds"],
    "renew" : lambda x : x["property"]["leasing"]["renewal_rate"],
    "vacate" : lambda x : x["property"]["leasing"]["vacation_notices"],
    "move_ins" : lambda x : x["property"]["occupancy"]["move_ins"],
    "move_outs" : lambda x : x["property"]["occupancy"]["move_outs"],
    "usv" : lambda x : x["funnel"]["volumes"]["usv"],
    "inq" : lambda x : x["funnel"]["volumes"]["inq"],
    "tou" : lambda x : x["funnel"]["volumes"]["tou"],
    "app" : lambda x : x["funnel"]["volumes"]["app"],
    "exe" : lambda x : x["funnel"]["volumes"]["exe"],
    "usv_inq" : lambda x : x["funnel"]["conversions"]["usv_inq"],
    "inq_tou" : lambda x : x["funnel"]["conversions"]["inq_tou"],
    "tou_app" : lambda x : x["funnel"]["conversions"]["tou_app"],
    "app_exe" : lambda x : x["funnel"]["conversions"]["app_exe"],
    "usv_exe" : lambda x : x["funnel"]["conversions"]["usv_exe"],
    "cost_per_usv" : lambda x : x["funnel"]["costs"]["usv"],
    "cost_per_inq" : lambda x : x["funnel"]["costs"]["inq"],
    "cost_per_tou" : lambda x : x["funnel"]["costs"]["tou"],
    "cost_per_app" : lambda x : x["funnel"]["costs"]["app"],
    "cost_per_exe" : lambda x : x["funnel"]["costs"]["exe"]
}

FORMATTERS = {
    "lease_rate" : percent_formatter,
    "retention_rate" : percent_formatter,
    "occupied_rate" : percent_formatter,
    "cds" : int_formatter,
    "renew" : int_formatter,
    "vacate" : int_formatter,
    "move_ins" : int_formatter,
    "move_outs" : int_formatter,
    "usv" : int_formatter,
    "inq" : int_formatter,
    "tou" : int_formatter,
    "app" : int_formatter,
    "exe" : int_formatter,
    "usv_inq" : percent_formatter,
    "inq_tou" : percent_formatter,
    "tou_app" : percent_formatter,
    "app_exe" : percent_formatter,
    "usv_exe" : percent_formatter,
    "cost_per_usv" : currency_formatter,
    "cost_per_inq" : currency_formatter,
    "cost_per_tou" : currency_formatter,
    "cost_per_app" : currency_formatter,
    "cost_per_exe" : currency_formatter
}

TITLES = {
    "lease_rate" : "Lease Rate",
    "retention_rate" : "Retention Rate",
    "occupied_rate" : "Occupied",
    "cds" : "Cancellations and Denials",
    "renew" : "Notices to Renew",
    "vacate" : "Notice to Vacate",
    "move_ins" : "Move Ins",
    "move_outs" : "Move Outs",
    "usv" : "Volume of USV",
    "inq" : "Volume of INQ",
    "tou" : "Volume of TOU",
    "app" : "Volume of APP",
    "exe" : "Volume of EXE",
    "usv_inq" : "USV > INQ",
    "inq_tou" : "INQ > TOU",
    "tou_app" : "TOU > APP",
    "app_exe" : "APP > EXE",
    "usv_exe" : "USV > EXE",
    "cost_per_usv" : "Cost per USV",
    "cost_per_inq" : "Cost per INQ",
    "cost_per_tou" : "Cost per TOU",
    "cost_per_app" : "Cost per APP",
    "cost_per_exe" : "Cost per EXE"
}

SHOW_CAMPAIGN = {
    "lease_rate" : False,
    "retention_rate" : True,
    "occupied_rate" : False,
    "cds" : True,
    "renew" : True,
    "vacate" : True,
    "move_ins" : True,
    "move_outs" : True,
    "usv" : True,
    "inq" : True,
    "tou" : True,
    "app" : True,
    "exe" : True,
    "usv_inq" : True,
    "inq_tou" : True,
    "tou_app" : True,
    "app_exe" : True,
    "usv_exe" : True,
    "cost_per_usv" : True,
    "cost_per_inq" : True,
    "cost_per_tou" : True,
    "cost_per_app" : True,
    "cost_per_exe" : True
}

'''
Need to convert this to a system that relies on dynamically calculated
Standard Deviation at some point. There are definitely KPIs that have
more spread than others.
'''
def health_check(stat, stat_target):
    # 0.50 = 750 / 1500
    percent = float(stat) / float(stat_target)
    if percent > .95:
        return 2
    elif percent > .75:
        return 1
    else:
        return 0

def top_kpi(kpi_key, campaign, this_week, prev_week, text):
    selector = SELECTORS[kpi_key]
    title = TITLES[kpi_key]
    formatter = FORMATTERS[kpi_key]
    show_campaign = SHOW_CAMPAIGN[kpi_key]
    campaign_value = selector(campaign)
    campaign_target = selector(campaign["targets"])
    return {
        "name" : title,
        "health" : health_check(campaign_value, campaign_target),
        "campaign_value" : formatter(campaign_value),
        "campaign_target" : formatter(campaign_target),
        "week_value" : formatter(selector(this_week)),
        "week_target" : formatter(selector(this_week["targets"])),
        "prev_value" : formatter(selector(prev_week)),
        "prev_target" : none_wrapper(formatter, selector, prev_week["targets"]),
        "insight" : text,
        "show_campaign" : show_campaign
    }

def list_kpi(kpi_key, campaign, health):
    selector = SELECTORS[kpi_key]
    title = TITLES[kpi_key]
    campaign_value = selector(campaign)
    campaign_target = selector(campaign["targets"])
    model_percent = float(campaign_value) / float(campaign_target)
    return {
        "name" : title,
        "model_percent" : percent_formatter(model_percent, digits=0),
        "health" : health
    }

def create_list_kpi(result, campaign, prefix, kpis, health):
    result[f"{prefix}_1"] = list_kpi(kpis[0], campaign, health)
    if len(kpis) > 1:
        result[f"{prefix}_2"] = list_kpi(kpis[1], campaign, health)
    if len(kpis) > 2:
        result[f"{prefix}_3"] = list_kpi(kpis[2], campaign, health)


@click.command()
@click.option(
    "-p",
    "--project_id",
    required=True,
    type=click.Choice(list(Project.objects.all().values_list("public_id", flat=True))),
    help="The project id.",
)
@click.option(
    "-s",
    "--start",
    required=True,
    type=click.DateTime(formats=("%m/%d/%Y",)),
    help="Start of reporting period",
)
@click.option(
    "-c",
    "--client",
    required=True,
    type=str,
    help="Name of client"
)
@click.option(
    "-h",
    "--health",
    required=True,
    type=click.Choice(("0","1","2")),
    help="Health of campaign. Must be 0,1,2"
)
@click.option(
    "-l",
    "--leaseratetext",
    required=True,
    type=str,
    help="Insight for lease rate"
)
@click.option(
    "-b",
    "--bestkpi",
    required=True,
    type=str,
    help="Best Kpi"
)
@click.option(
    "-bkt",
    "--bestkpitext",
    required=True,
    type=str,
    help="Insight for best kpi"
)
@click.option(
    "-w",
    "--worstkpi",
    required=True,
    type=str,
    help="Worst KPI"
)
@click.option(
    "-wkt",
    "--worstkpitext",
    required=True,
    type=str,
    help="Worst KPI Insight"
)
@click.option(
    "-t",
    "--topkpis",
    required=True,
    type=str,
    multiple=True,
    help="Top Performing KPIs"
)
@click.option(
    "-r",
    "--riskkpis",
    required=True,
    type=str,
    multiple=True,
    help="At Risk KPIs"
)
@click.option(
    "-lo",
    "--lowkpis",
    required=True,
    type=str,
    multiple=True,
    help="Low Performing KPIs"
)
@click.option(
    "-e",
    "--email",
    required=True,
    type=str,
    help="Email they should respond to"
)
def command(project_id, start, client, health, leaseratetext, bestkpi, bestkpitext, worstkpi, worstkpitext, topkpis, riskkpis, lowkpis, email):
    end = start + datetime.timedelta(days=7)
    human_end = start + datetime.timedelta(days=6)
    prevstart = start - datetime.timedelta(days=7)

    project = Project.objects.get(pk=project_id)

    campaign_to_date = PerformanceReport.for_campaign_to_date(project).to_jsonable()
    this_week = PerformanceReport.for_dates(project, start.date(), end.date()).to_jsonable()
    prev_week = PerformanceReport.for_dates(project, prevstart.date(), start.date()).to_jsonable()

    address = project.property.geo_address
    template_vars = {
        "report_url" : f"https://app.remarkably.io/projects/{project_id}/performance/last-week/",
        "start_date" : start.strftime("%m/%d/%Y"),
        "end_date" : human_end.strftime("%m/%d/%Y"),
        "client" : client,
        "name" : project.name,
        "city" : address.city,
        "state" : address.state,
        "health" : health,
        "lease_rate" : top_kpi("lease_rate", campaign_to_date, this_week, prev_week, leaseratetext),
        "best_kpi" : top_kpi(bestkpi, campaign_to_date, this_week, prev_week, bestkpitext),
        "worst_kpi" : top_kpi(worstkpi, campaign_to_date, this_week, prev_week, worstkpitext),
        "email" : email
    }

    create_list_kpi(template_vars, campaign_to_date, "top", topkpis, 2)
    create_list_kpi(template_vars, campaign_to_date, "risk", riskkpis, 1)
    create_list_kpi(template_vars, campaign_to_date, "low", lowkpis, 0)

    template = get_template("projects/weekly_performance_reporting_email.html")
    result = template.render(template_vars)

    print(result)
