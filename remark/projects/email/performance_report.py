import datetime

from django.template.loader import get_template

from remark.users.models import User
from remark.projects.models import Project, Spreadsheet
from remark.projects.reports.performance import PerformanceReport

from remark.projects.email.constants import SELECTORS, FORMATTERS, SHOW_CAMPAIGN, KPIS
from remark.lib.sendgrid_email import create_contact_if_not_exists, create_contact_list_if_not_exists, create_campaign_if_not_exists

def none_wrapper(formatter, selector, obj):
    try:
        result = selector(obj)
        return formatter(result)
    except:
        return None

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

'''
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
'''
def create_html(project, start, client, health, leaseratetext, bestkpi, bestkpitext, worstkpi, worstkpitext, topkpis, riskkpis, lowkpis, email):
    project_id = project.public_id
    end = start + datetime.timedelta(days=7)
    human_end = start + datetime.timedelta(days=6)
    prevstart = start - datetime.timedelta(days=7)
    campaign_to_date = PerformanceReport.for_campaign_to_date(project).to_jsonable()
    this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()
    prev_week = PerformanceReport.for_dates(project, prevstart.date(), start.date()).to_jsonable()

    template_vars = {
        "report_url" : f"https://app.remarkably.io/projects/{project_id}/performance/last-week/",
        "start_date" : start.strftime("%m/%d/%Y"),
        "end_date" : human_end.strftime("%m/%d/%Y"),
        "client" : client,
        "name" : project.name,
        "city" : project.address.city,
        "state" : project.address.state,
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
    return result

CONTACT_EMAIL = "info@remarkably.io"
SENDER_ID = 482157

def send_performance_email(perf_email):
    project = perf_email.project

    # Sync Contacts with SendGrid Recipients
    contact_str = project.email_distribution_list
    if len(contact_str) == 0:
        raise Exception("No contacts provided in Property")

    contacts = contact_str.split(",")
    contact_ids = []
    for contact in contacts:
        contact_id = create_contact_if_not_exists(contact)
        contact_ids.append(contact_id)

    # Sync Contact List
    list_id = project.email_list_id
    new_list_id = create_contact_list_if_not_exists(project.public_id, list_id, contact_ids)
    if list_id != new_list_id:
        project.email_list_id = new_list_id
        project.save()

    # Sync Campaign
    email_campaign_id = perf_email.email_campaign_id
    categories = [
        project.public_id
    ]

    html_content = create_html(
        project,
        perf_email.start,
        project.customer_name,
        perf_email.campaign_health,
        perf_email.lease_rate_text,
        perf_email.top_performing_kpi,
        perf_email.top_performing_insight,
        perf_email.low_performing_kpi,
        perf_email.low_performing_insight,
        perf_email.top_kpis,
        perf_email.risk_kpis,
        perf_email.low_kpis,
        CONTACT_EMAIL
    )

    title = f"{property.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"
    subject = f"{property.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"

    create_campaign_if_not_exists(
        email_campaign_id,
        title,
        subject,
        SENDER_ID,
        new_list_id,
        categories,
        html_content
    )
