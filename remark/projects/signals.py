from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Campaign, Spreadsheet, Period, PerformanceReport
from remark.lib.stats import health_check

from remark.email_app.models import PerformanceEmail, PerformanceEmailKPI
from remark.email_app.reports.constants import (
    SELECTORS,
    KPI_NAMES,
    KPI_POSITIVE_DIRECTION,
    KPIS_INCLUDE_IN_EMAIL
)

import datetime

from remark.lib.logging import getLogger

logger = getLogger(__name__)

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

def rank_kpis(report):
    # Find Top Weekly KPIs
    result = {}
    for k in KPIS_INCLUDE_IN_EMAIL:
        mp = model_percent(k, report)
        # We ignore percent of model values that don't make sense
        # like Infinity, Zero, or Div by Zero Error
        if mp is not None:
            result[k] = mp
    return result

def sort_kpis(kpis):
    return sorted(kpis, key=kpis.get, reverse=True)

def get_ctd_top_kpis(ctd_model_percent, ctd_sorted):
    top_kpis = []
    try:
        if ctd_model_percent[ctd_sorted[0]] > 0.95:
            top_kpis.append(ctd_sorted[0])
            if ctd_model_percent[ctd_sorted[1]] > 0.95:
                top_kpis.append(ctd_sorted[1])
                if ctd_model_percent[ctd_sorted[2]] > 0.95:
                    top_kpis.append(ctd_sorted[2])
    except IndexError:
        pass
    return top_kpis

def get_ctd_rest(ctd_model_percent, ctd_sorted):
    risk_kpis = []
    low_kpis = []
    try:
        for x in range(-1, -7, -1):
            name = ctd_sorted[x]
            value = ctd_model_percent[name]
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
    except IndexError:
        pass
    return (risk_kpis, low_kpis)

def get_ctd_kpi_lists(ctd_model_percent):
    ctd_sorted = sort_kpis(ctd_model_percent)
    top_kpis = get_ctd_top_kpis(ctd_model_percent, ctd_sorted)
    risk_kpis, low_kpis = get_ctd_rest(ctd_model_percent, ctd_sorted)
    return (top_kpis, risk_kpis, low_kpis)

@receiver(post_save, sender=Period)
def update_performance_report(sender, instance, created, raw, **kwargs):
    # dont run this for fixtures
    if raw:
        return

    project = instance.project
    start = instance.start

    if not created and PerformanceEmail.objects.filter(start__exact=start, project__exact=project).count() > 0:
        logger.info("Already created performance email. Skipping.")
        return

    campaign_start = project.get_campaign_start()
    end = instance.end
    prevstart = start - datetime.timedelta(days=7)

    if start < campaign_start:
        logger.info("Start date is before campaign start. Skipping.")
        logger.info(f"start: {start} || campaign start: {campaign_start}")
        return

    if not PerformanceReport.has_dates(project, campaign_start, end) or not PerformanceReport.has_dates(project, start, end):
        logger.info("Does not have required reports available. Skipping.")
        return

    campaign_to_date = PerformanceReport.for_dates(project, campaign_start, end).to_jsonable()
    this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()

    # Props
    lease_rate = SELECTORS["lease_rate"](campaign_to_date)
    target_lease_rate = 0.90
    try:
        target_lease_rate = SELECTORS["lease_rate"](campaign_to_date["targets"])
    except:
        logger.info("No targets set. Skipping performance email creation")
        return

    # Campaign Health
    campaign_health = health_check(lease_rate, target_lease_rate)

    # Find Top Weekly KPIs
    ctd_model_percent = rank_kpis(campaign_to_date)
    if len(ctd_model_percent.keys()) == 0:
        logger.info("No ranked campaign kpis available. Skipping performance email creation")
        return

    wk_model_percent = rank_kpis(this_week)
    if len(wk_model_percent.keys()) == 0:
        logger.info("No ranked weekly kpis available. Skipping performance email creation")
        return

    # Find Top and Bottom KPI
    wk_sorted = sort_kpis(wk_model_percent)
    top_kpi = wk_sorted[0]
    low_kpi = wk_sorted[-1]

    # Create KPI Lists for CTD
    ctd_sorted = sort_kpis(ctd_model_percent)
    top_kpis = get_ctd_top_kpis(ctd_model_percent, ctd_sorted)
    risk_kpis, low_kpis = get_ctd_rest(ctd_model_percent, ctd_sorted)

    # https://app.remarkably.io/admin/email_app/performanceemail/26/change/
    pe = PerformanceEmail()
    pe.project = project
    pe.start = start
    pe.end = end
    pe.campaign_health = str(campaign_health)
    pe.lease_rate_text = campaign_insight(campaign_health)
    pe.top_performing_kpi = top_kpi
    pe.top_performing_insight = top_kpi_insight(top_kpi)
    pe.low_performing_kpi = low_kpi
    pe.low_performing_insight = low_kpi_insight(low_kpi)
    pe.save()

    logger.info(f"TOP_KPIS::{top_kpis}")
    logger.info(f"risk_kpis::{risk_kpis}")
    logger.info(f"low_kpis::{low_kpis}")

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
