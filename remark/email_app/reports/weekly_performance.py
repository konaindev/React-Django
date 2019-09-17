from copy import copy
import datetime
import time

from django.template.loader import get_template

from remark.lib.stats import health_check
from remark.lib.logging import error_text, getLogger
from remark.projects.reports.performance import PerformanceReport, InvalidReportRequest
from remark.email_app.models import PerformanceEmail, ListservEmail
from remark.email_app.constants import DEFAULT_SENDER_INFO, CONTACT_EMAIL_IN_TEMPLATE
from remark.projects.models import TargetPeriod

from .constants import (
    SELECTORS,
    FORMATTERS,
    SHOW_CAMPAIGN,
    KPI_NAMES,
    percent_formatter,
    percent_formatter_no_suffix,
)
from remark.lib.sendgrid_email import (
    create_contact_if_not_exists,
    create_contact_list_if_not_exists,
    create_campaign_if_not_exists,
    create_sender,
)

from celery import shared_task

logger = getLogger(__name__)


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


def top_kpi(kpi_key, this_week, prev_week=None, text=None):
    selector = SELECTORS[kpi_key]
    title = KPI_NAMES[kpi_key]
    formatter = FORMATTERS[kpi_key]
    result = {
        "name": title,
        "value": formatter(selector(this_week)),
        "target": formatter(selector(this_week["targets"])),
    }
    if prev_week is not None:
        result["prev_value"] = formatter(selector(prev_week))
        result["prev_target"] = none_wrapper(formatter, selector, prev_week["targets"])

    if text is not None:
        result["insight"] = text

    return result


def list_kpi(kpi_key, campaign):
    selector = SELECTORS[kpi_key]
    title = KPI_NAMES[kpi_key]
    campaign_value = selector(campaign)
    campaign_target = selector(campaign["targets"])
    model_percent = float(campaign_value) / float(campaign_target)
    return {"name": title, "model_percent": percent_formatter(model_percent)}


def create_list_kpi(result, campaign, prefix, kpis):
    for index, kpi in enumerate(kpis, 1): # iterate index in [1, 2, 3]
        result[f"{prefix}_{index}"] = list_kpi(kpi, campaign)


def generate_campaign_goal_chart_url(project, this_week):
    selector = SELECTORS["lease_rate"]
    formatter = percent_formatter_no_suffix

    week_start = this_week["dates"]["start"]
    week_end = this_week["dates"]["end"]
    goal_target_period = project.get_active_campaign_goal(week_end)
    if goal_target_period is None:
        raise InvalidReportRequest(
            f"No target periods or selected model for week ({week_start}, {week_end})"
        )

    # target periods' end date is one day after the actual end date
    goal_date = goal_target_period.end - datetime.timedelta(days=1)
    goal = formatter(goal_target_period.target_leased_rate)
    current = formatter(selector(this_week))

    return (
        "https://app.remarkably.io/charts/donut"
        + f"?goal={goal}"
        + f"&goal_date={goal_date}"
        + f"&current={current}"
        + "&bg=20272e"
        + "&bg_target=404e5c"
        + "&bg_current=006eff"
    )


def generate_template_vars(perf_email):
    project = perf_email.project
    project_id = project.public_id
    start = perf_email.start
    end = start + datetime.timedelta(days=7)
    human_end = start + datetime.timedelta(days=6)
    prevstart = start - datetime.timedelta(days=7)
    try:
        campaign_to_date = PerformanceReport.for_campaign_to_date(project).to_jsonable()
        this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()
        prev_week = PerformanceReport.for_dates(project, prevstart, start).to_jsonable()
        campaign_goal_chart_url = generate_campaign_goal_chart_url(project, this_week)
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

    address = project.property.geo_address
    health = perf_email.campaign_health
    lease_rate_text = perf_email.lease_rate_text
    best_kpi = perf_email.top_performing_kpi
    best_kpi_text = perf_email.top_performing_insight
    worst_kpi = perf_email.low_performing_kpi
    worst_kpi_text = perf_email.low_performing_insight
    top_kpis = perf_email.top_kpis
    risk_kpis = perf_email.risk_kpis
    low_kpis = perf_email.low_kpis
    risk_kpi_insight_text = perf_email.risk_kpi_insight_text
    low_kpi_insight_text = perf_email.low_kpi_insight_text
    email = CONTACT_EMAIL_IN_TEMPLATE

    template_vars = {
        "report_url": f"https://app.remarkably.io/projects/{project_id}/performance/last-week/",
        "start_date": start.strftime("%m/%d/%Y"),
        "end_date": human_end.strftime("%m/%d/%Y"),
        "client": project.customer_name,
        "property_name": project.name,
        "city": address.city,
        "state": address.state,
        "campaign_health": int(health),
        "campaign_insight": lease_rate_text,
        "lease_rate": top_kpi("lease_rate", this_week),
        "best_kpi": top_kpi(best_kpi, this_week, prev_week, best_kpi_text),
        "worst_kpi": top_kpi(worst_kpi, this_week, prev_week, worst_kpi_text),
        "risk_kpi_insight_text": risk_kpi_insight_text,
        "low_kpi_insight_text": low_kpi_insight_text,
        "email": email,
        "campaign_goal_chart_url": campaign_goal_chart_url,
    }

    create_list_kpi(template_vars, campaign_to_date, "top", top_kpis)
    create_list_kpi(template_vars, campaign_to_date, "risk", risk_kpis)
    create_list_kpi(template_vars, campaign_to_date, "low", low_kpis)

    return template_vars


def create_html(template_vars):
    template = get_template("email/weekly_performance_report/index.html")
    result = template.render(template_vars)
    return result


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
        time.sleep(5)

    # Sync Contact List
    list_id = project.email_list_id
    new_list_id = create_contact_list_if_not_exists(
        project.public_id, list_id, contact_ids
    )
    time.sleep(10)
    if list_id != new_list_id:
        project.email_list_id = new_list_id
        project.save()

    # Sync Campaign
    email_campaign_id = perf_email.email_campaign_id
    categories = [project.public_id]

    template_vars = generate_template_vars(perf_email)
    html_content = create_html(template_vars)

    title = f"{project.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"
    subject = f"{project.name} :: Performance Report :: {perf_email.start.strftime('%m/%d/%Y')}"

    if project.listserv_email:
        sender_id = project.listserv_email.sender_id
    else:
        raise Exception("No Listserv email set in project")

    perf_email.email_campaign_id = create_campaign_if_not_exists(
        email_campaign_id,
        title,
        subject,
        sender_id,
        new_list_id,
        categories,
        html_content,
    )
    print("weekly_performance::send_performance_email::end")
    return True


"""
Create a Sender object on Sendgrid, based on ListservEmail instance
"""
@shared_task
def create_sender_for_listserv(listserv_id):
    try:
        listserv = ListservEmail.objects.get(pk=listserv_id)
        sender_info = copy(DEFAULT_SENDER_INFO)
        sender_info["nickname"] = f"{listserv.email}-{listserv.public_id}"
        sender_info["reply_to"]["email"] = listserv.email

        listserv.sender_id = create_sender(sender_info)
        listserv.save()
    except Exception as e:
        logger.error(error_text(e))

    return True
