from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Spreadsheet, Period, PerformanceReport
from remark.lib.stats import health_check

from remark.email_app.models import PerformanceEmail, PerformanceEmailKPI
from remark.email_app.reports.constants import (
    SELECTORS,
    SHOW_CAMPAIGN,
    KPI_NAMES,
    KPI_POSITIVE_DIRECTION
)

import datetime


@receiver(post_save, sender=Spreadsheet)
def activate_spreadsheets_if_safe(sender, instance, created, raw, **kwargs):
    if not raw:
        instance.activate()

def model_percent(name, report):
    selector = SELECTORS[name]
    dir = KPI_POSITIVE_DIRECTION[name]
    try:
        value = float( selector(report) )
        target = float( selector(report["targets"]) )

        if target == 0.0:
            return None

        if dir:
            return value / target
        else:
            return target / value
    except:
        pass

    return None

def campaign_insight(campaign_health):
    if campaign_health == 2:
        return "Overall, your campaign is on track, and very likely to hit your goal by deadline."
    elif campaign_health == 1:
        return "Overall, your campaign is at risk, and becoming unlikely to hit your goal by deadline."
    return "Overall, your campaign is off track, and very unlikely to hit your goal by deadline."

def top_kpi_insight(name):
    human_name = KPI_NAMES[name]
    return f"Congratulations on your {human_name} last week! Gold star performance."

def low_kpi_insight(name):
    human_name = KPI_NAMES[name]
    return f"Disappointing {human_name} last week. Let's make this old news quickly."

@receiver(post_save, sender=Period)
def update_performance_report(sender, instance, created, raw, **kwargs):

    project = instance.project
    start = instance.start

    if not created and PerformanceEmail.objects.filter(start__exact=start, project__exact=project).count() > 0:
        print("Already created performance email. Skipping.")
        return

    campaign_start = project.get_campaign_start()
    end = instance.end
    prevstart = start - datetime.timedelta(days=7)

    if start < campaign_start:
        print("Start date is before campaign start. Skipping.")
        print(f"start: {start} || campaign start: {campaign_start}")
        return

    if not PerformanceReport.has_dates(project, campaign_start, end) or not PerformanceReport.has_dates(project, start, end):
        print("Does not have required reports available. Skipping.")
        return

    campaign_to_date = PerformanceReport.for_dates(project, campaign_start, end).to_jsonable()
    this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()

    print("campaign_to_date::", campaign_to_date)
    print("this_week::", this_week)

    # Props
    lease_rate = SELECTORS["lease_rate"](campaign_to_date)
    target_lease_rate = SELECTORS["lease_rate"](campaign_to_date["targets"])

    # Campaign Health
    campaign_health = health_check(lease_rate, target_lease_rate)

    # Find Top Weekly KPIs
    ctd_model_percent = {}
    wk_model_percent = {}
    for k in SHOW_CAMPAIGN.keys():
        if SHOW_CAMPAIGN[k]:
            ctd = model_percent(k, campaign_to_date)
            # We ignore percent of model values that don't make sense
            # like Infinity, Zero, or Div by Zero Error
            if ctd is not None:
                ctd_model_percent[k] = ctd

            wk = model_percent(k, this_week)
            if wk is not None:
                wk_model_percent[k] = wk

    ctd_sorted = sorted(ctd_model_percent, key=ctd_model_percent.get, reverse=True)
    wk_sorted = sorted(wk_model_percent, key=wk_model_percent.get, reverse=True)

    # Find the Top KPIs
    top_kpis = []
    if ctd_model_percent[ctd_sorted[0]] > 0.95:
        top_kpis.append(ctd_sorted[0])
        if ctd_model_percent[ctd_sorted[1]] > 0.95:
            top_kpis.append(ctd_sorted[1])
            if ctd_model_percent[ctd_sorted[2]] > 0.95:
                top_kpis.append(ctd_sorted[2])

    risk_kpis = []
    low_kpis = []
    for x in range(-1, -7, -1):
        name = ctd_sorted[x]
        value = ctd_model_percent[name]
        print(f"name::{name} - value::{value}")
        # Are we adding to at risk or off track
        if value < 0.95:
            if value < 0.75 and len(low_kpis) < 3:
                low_kpis.append(name)
            elif len(risk_kpis) < 3:
                risk_kpis.append(name)
            else:
                break
        else:
            break

    # https://app.remarkably.io/admin/email_app/performanceemail/26/change/
    pe = PerformanceEmail()
    pe.project = project
    pe.start = start
    pe.end = end
    pe.campaign_health = str(campaign_health)
    pe.lease_rate_text = campaign_insight(campaign_health)
    pe.top_performing_kpi = wk_sorted[0]
    pe.top_performing_insight = top_kpi_insight(wk_sorted[0])
    pe.low_performing_kpi = wk_sorted[-1]
    pe.low_performing_insight = low_kpi_insight(wk_sorted[-1])
    pe.save()

    print("TOP_KPIS::", top_kpis)
    print("risk_kpis::", risk_kpis)
    print("low_kpis::", low_kpis)

    for kpi in top_kpis:
        pek = PerformanceEmailKPI()
        pek.name = kpi
        pek.category = "top"
        pek.performance_email = pe
        pek.save()

    for kpi in risk_kpis:
        pek = PerformanceEmailKPI()
        pek.name = kpi
        pek.category = "risk"
        pek.performance_email = pe
        pek.save()

    for kpi in low_kpis:
        pek = PerformanceEmailKPI()
        pek.name = kpi
        pek.category = "low"
        pek.performance_email = pe
        pek.save()
