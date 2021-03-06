def int_formatter(value):
    return int(value)

def percent_formatter_2(value):
    return percent_formatter(value, digits=2)

def percent_formatter_no_suffix(value):
    return percent_formatter(value, digits=0, suffix=False)

def percent_formatter(value, digits=0, suffix=True):
    initial = float(value) * 100.0
    if digits == 1:
        final = "{:.1f}".format(initial)
    elif digits == 0:
        final = "{:.0f}".format(initial)
    else:
        final = "{:.2f}".format(initial)
    return final + ("%" if suffix else "")

def currency_formatter(value):
    initial = float(value)
    final = "{:.2f}".format(initial)
    return "$" + final

SELECTORS = {
    "lease_rate" : lambda x : x["property"]["leasing"]["rate"],
    "retention_rate" : lambda x : x["property"]["leasing"]["renewal_rate"],
    "occupied_rate" : lambda x : x["property"]["leasing"]["rate"],
    "cds" : lambda x : x["property"]["leasing"]["cds"],
    "cd_rate" : lambda x : x["property"]["leasing"]["cd_rate"],
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
    "cd_rate": percent_formatter,
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

KPI_NAMES = {
    "lease_rate" : "Leased Rate",
    "retention_rate" : "Retained Rate",
    "occupied_rate" : "Occupancy Rate",
    "cd_rate": "Cancellations and Denials Rate",
    "cds" : "Cancellations and Denials",
    "renew" : "Number of Notices to Renew",
    "vacate" : "Number of Notices to Vacate",
    "move_ins" : "Move Ins",
    "move_outs" : "Move Outs",
    "usv" : "Number of Unique Site Visitors",
    "inq" : "Number of Inquiries",
    "tou" : "Number of Tours",
    "app" : "Number of Lease Applications",
    "exe" : "Number of Lease Executions",
    "usv_inq" : "Unique Site Visitors > Inquiries",
    "inq_tou" : "Inquiries > Tours",
    "tou_app" : "Tours > Lease Applications",
    "app_exe" : "Lease Applications > Lease Executions",
    "usv_exe" : "Unique Site Visitors > Lease Executions",
    "cost_per_usv" : "Cost per Unique Site Visitor",
    "cost_per_inq" : "Cost per Inquiry",
    "cost_per_tou" : "Cost per Tour",
    "cost_per_app" : "Cost per Lease Application",
    "cost_per_exe" : "Cost per Lease Execution"
}

# Do we want to highlight the performance of these campaign KPIs?
# Yes - to highlight
# No - to no hightlight
SHOW_CAMPAIGN = {
    "lease_rate" : False,
    "retention_rate" : True,
    "occupied_rate" : False,
    "cd_rate": True,
    "cds" : False,
    "renew" : False,
    "vacate" : True,
    "move_ins" : False,
    "move_outs" : False,
    "usv" : True,
    "inq" : True,
    "tou" : True,
    "app" : True,
    "exe" : True,
    "usv_inq" : True,
    "inq_tou" : True,
    "tou_app" : True,
    "app_exe" : False,
    "usv_exe" : True,
    "cost_per_usv" : False,
    "cost_per_inq" : False,
    "cost_per_tou" : False,
    "cost_per_app" : False,
    "cost_per_exe" : False
}

KPI_POSITIVE_DIRECTION = {
    "lease_rate" : True,
    "retention_rate" : True,
    "occupied_rate" : True,
    "cd_rate": False,
    "cds" : False,
    "renew" : True,
    "vacate" : False,
    "move_ins" : True,
    "move_outs" : False,
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
    "cost_per_usv" : False,
    "cost_per_inq" : False,
    "cost_per_tou" : False,
    "cost_per_app" : False,
    "cost_per_exe" : False
}

KPIS = SHOW_CAMPAIGN.keys()
KPI_NAMES_TO_SHOW = {i[0]: KPI_NAMES[i[0]] for i in SHOW_CAMPAIGN.items() if i[1]}
KPI_CATEGORIES = {
    "top": "Top",
    "risk": "Risk",
    "low": "Low"
}

# KPIs that should be included in Email Reports
# These came from https://www.pivotaltracker.com/n/projects/2240283/stories/169880283
# - TPC
KPIS_INCLUDE_IN_EMAIL = []
for kpi in SHOW_CAMPAIGN.keys():
    if SHOW_CAMPAIGN[kpi]:
        KPIS_INCLUDE_IN_EMAIL.append(kpi)

MACRO_INSIGHTS_OPTIONS = [
    ("lease_rate_against_target", "lease_rate_against_target"),
    ("change_health_status", "change_health_status"),
    ("usv_exe_off_track", "usv_exe_off_track"),
    ("usv_exe_at_risk", "usv_exe_at_risk"),
    ("usv_exe_on_track", "usv_exe_on_track"), ("retention_rate_health", "retention_rate_health"), ("top_usv_referral", "top_usv_referral")]
