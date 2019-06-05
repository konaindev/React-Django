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

KPI_NAMES = {
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

KPI_POSITIVE_DIRECTION = {
    "lease_rate" : True,
    "retention_rate" : True,
    "occupied_rate" : True,
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
KPI_CATEGORIES = {
    "top": "Top",
    "risk": "Risk",
    "low": "Low"
}
