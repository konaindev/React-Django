import datetime

from django.template.loader import get_template

from remark.users.models import User
from remark.projects.models import Project, Spreadsheet
from remark.projects.reports.performance import PerformanceReport, InvalidReportRequest
from remark.email_app.models import PerformanceEmail

from .constants import (
    SELECTORS,
    FORMATTERS,
    SHOW_CAMPAIGN,
    KPIS,
    KPI_NAMES,
)
from remark.lib.sendgrid_email import (
    create_contact_if_not_exists,
    create_contact_list_if_not_exists,
    create_campaign_if_not_exists,
)


def none_wrapper(formatter, selector, obj):
    try:
        result = selector(obj)
        return formatter(result)
    except:
        return None


"""
Need to convert this to a system that relies on dynamically calculated
Standard Deviation at some point. There are definitely KPIs that have
more spread than others.
"""


def health_check(stat, stat_target):
    # 0.50 = 750 / 1500
    percent = float(stat) / float(stat_target)
    if percent > 0.95:
        return 2
    elif percent > 0.75:
        return 1
    else:
        return 0


def top_kpi(kpi_key, campaign, this_week, prev_week, text):
    selector = SELECTORS[kpi_key]
    title = KPI_NAMES[kpi_key]
    formatter = FORMATTERS[kpi_key]
    show_campaign = SHOW_CAMPAIGN[kpi_key]
    campaign_value = selector(campaign)
    campaign_target = selector(campaign["targets"])
    return {
        "name": title,
        "health": health_check(campaign_value, campaign_target),
        "campaign_value": formatter(campaign_value),
        "campaign_target": formatter(campaign_target),
        "week_value": formatter(selector(this_week)),
        "week_target": formatter(selector(this_week["targets"])),
        "prev_value": formatter(selector(prev_week)),
        "prev_target": none_wrapper(formatter, selector, prev_week["targets"]),
        "insight": text,
        "show_campaign": show_campaign,
    }


def list_kpi(kpi_key, campaign, health):
    selector = SELECTORS[kpi_key]
    title = KPI_NAMES[kpi_key]
    formatter = FORMATTERS[kpi_key]
    campaign_value = selector(campaign)
    campaign_target = selector(campaign["targets"])
    model_percent = float(campaign_value) / float(campaign_target)
    return {
        "name": title,
        "model_percent": formatter(model_percent),
        "health": health,
    }


def create_list_kpi(result, campaign, prefix, kpis, health):
    result[f"{prefix}_1"] = list_kpi(kpis[0], campaign, health)
    if len(kpis) > 1:
        result[f"{prefix}_2"] = list_kpi(kpis[1], campaign, health)
    if len(kpis) > 2:
        result[f"{prefix}_3"] = list_kpi(kpis[2], campaign, health)


def create_html(
    project,
    start,
    client,
    health,
    leaseratetext,
    bestkpi,
    bestkpitext,
    worstkpi,
    worstkpitext,
    topkpis,
    riskkpis,
    lowkpis,
    email,
):
    project_id = project.public_id
    end = start + datetime.timedelta(days=7)
    human_end = start + datetime.timedelta(days=6)
    prevstart = start - datetime.timedelta(days=7)
    try:
        campaign_to_date = PerformanceReport.for_campaign_to_date(project).to_jsonable()
        this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()
        prev_week = PerformanceReport.for_dates(project, prevstart, start).to_jsonable()
    except InvalidReportRequest as e:
        # TODO todd: do something useful here.
        # You might also consider calling
        #
        #    PerformanceReport.has_campaign_to_date(project)
        #    PerformanceReport.has_dates(project, start, end)
        #    PerformanceReport.has_dates(project, prevstart, start)
        #
        # and making sure all of these return True, *before* you ever call
        # create_html. would be good to check in a django Form, for instance.
        raise e

    template_vars = {
        "report_url": f"https://app.remarkably.io/projects/{project_id}/performance/last-week/",
        "start_date": start.strftime("%m/%d/%Y"),
        "end_date": human_end.strftime("%m/%d/%Y"),
        "client": client,
        "name": project.name,
        "city": project.address.city,
        "state": project.address.state,
        "health": health,
        "lease_rate": top_kpi(
            "lease_rate", campaign_to_date, this_week, prev_week, leaseratetext
        ),
        "best_kpi": top_kpi(
            bestkpi, campaign_to_date, this_week, prev_week, bestkpitext
        ),
        "worst_kpi": top_kpi(
            worstkpi, campaign_to_date, this_week, prev_week, worstkpitext
        ),
        "email": email,
    }

    create_list_kpi(template_vars, campaign_to_date, "top", topkpis, 2)
    create_list_kpi(template_vars, campaign_to_date, "risk", riskkpis, 1)
    create_list_kpi(template_vars, campaign_to_date, "low", lowkpis, 0)

    template = get_template("projects/weekly_performance_reporting_email.html")
    result = template.render(template_vars)
    return result


CONTACT_EMAIL = "info@remarkably.io"
SENDER_ID = 482157

from celery import shared_task

@shared_task
def send_performance_email(performance_email_id):
    print("weekly_performance::send_performance_email::start")
    perf_email = PerformanceEmail.objects.get(pk=performance_email_id)
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
    new_list_id = create_contact_list_if_not_exists(
        project.public_id, list_id, contact_ids
    )
    if list_id != new_list_id:
        project.email_list_id = new_list_id
        project.save()

    # Sync Campaign
    email_campaign_id = perf_email.email_campaign_id
    categories = [project.public_id]

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
        CONTACT_EMAIL,
    )

    title = f"{project.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"
    subject = f"{project.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"

    perf_email.email_campaign_id = create_campaign_if_not_exists(
        email_campaign_id,
        title,
        subject,
        SENDER_ID,
        new_list_id,
        categories,
        html_content,
    )
    print("weekly_performance::send_performance_email::end")
    return True
