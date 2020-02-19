MITIGATED_KPIS = [
    ("usvs", "usv_inq", "inquiries"),
    ("usv_inq", "usvs", "inquiries"),
    ("inquiries", "inq_tou", "tours"),
    ("inq_tou", "inquiries", "tours"),
    ("tours", "tou_app", "lease_applications"),
    ("tou_app", "tours", "lease_applications"),
    ("lease_applications", "app_exe", "leases_executed"),
]


KPIS_NAMES = {
    "cds": "Cancellations/Denials",
    "notice_to_renew": "Notices to Renew",
    "notice_to_vacate": "Notices to Vacate",
    "move_ins": "Move Ins",
    "move_outs": "Move Outs",
    "lease_renewals": "Lease Renewals",
    "usvs": "Volume of USV",
    "inqs": "Volume of INQ",
    "inquiries": "Volume of INQ",
    "tous": "Volume of TOU",
    "tours": "Volume of TOU",
    "apps": "Volume of APP",
    "lease_applications": "Volume of APP",
    "exes": "Volume of EXE",
    "leases_executed": "Volume of EXE",
    "cost_per_usv": "Cost per USV",
    "cost_per_inq": "Cost per INQ",
    "cost_per_tou": "Cost per TOU",
    "cost_per_app": "Cost per APP",
    "cost_per_exe": "Cost per EXE",
    "retention_rate": "Retention Rate",
    "usv_exe": "USV > EXE",
    "cd_rate": "Cancellation and Denial Rate",
    "cost_per_exe_lmr": "Cost per EXE / LMR",
    "usv_inq": "USV > INQ",
    "inq_tou": "INQ > TOU",
    "tou_app": "TOU > APP",
    "app_exe": "APP > EXE",
}


TRENDS = {"FLAT": "flat", "UP": "up", "DOWN": "down"}
