import datetime
import time

from django.template.loader import get_template

from remark.lib.stats import health_check
from remark.projects.reports.performance import PerformanceReport, InvalidReportRequest
from remark.email_app.models import PerformanceEmail
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
)

from celery import shared_task


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
    result[f"{prefix}_1"] = list_kpi(kpis[0], campaign)
    if len(kpis) > 1:
        result[f"{prefix}_2"] = list_kpi(kpis[1], campaign)
    if len(kpis) > 2:
        result[f"{prefix}_3"] = list_kpi(kpis[2], campaign)


def campaign_goal_chart_url(project, this_week):
    selector = SELECTORS["lease_rate"]
    formatter = percent_formatter_no_suffix

    this_week_end = this_week["dates"]["end"]
    target_period = (
        TargetPeriod.objects.filter(project=project, end__lte=this_week_end).order_by("-end").first()
    )
    goal_date = target_period.end
    goal = formatter(target_period.target_leased_rate)
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
    risk_kpi_insight_text,
    low_kpi_insight_text,
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
        "property_name": project.name,
        "city": project.address.city,
        "state": project.address.state,
        "campaign_health": int(health),
        "campaign_insight": leaseratetext,
        "lease_rate": top_kpi("lease_rate", this_week),
        "best_kpi": top_kpi(bestkpi, this_week, prev_week, bestkpitext),
        "worst_kpi": top_kpi(worstkpi, this_week, prev_week, worstkpitext),
        "risk_kpi_insight_text": risk_kpi_insight_text,
        "low_kpi_insight_text": low_kpi_insight_text,
        "email": email,
        "campaign_goal_chart_url": campaign_goal_chart_url(project, this_week),
    }

    create_list_kpi(template_vars, campaign_to_date, "top", topkpis)
    create_list_kpi(template_vars, campaign_to_date, "risk", riskkpis)
    create_list_kpi(template_vars, campaign_to_date, "low", lowkpis)

    template = get_template("email/weekly_performance_report/index.html")
    result = template.render(template_vars)
    return result


CONTACT_EMAIL = "info@remarkably.io"
SENDER_ID = 482157


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
        perf_email.risk_kpi_insight_text,
        perf_email.low_kpi_insight_text,
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
