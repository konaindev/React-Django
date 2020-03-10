from enum import Enum

PROPERTY_TYPE = (
    (1, "Multifamily - Standard"),
    (2, "Multifamily - Micro"),
    (3, "Student Housing"),
    (4, "Senior Housing"),
    (5, "Planned Communities"),
    (6, "Condominiums"),
    (7, "Active Adult"),
)

BUILDING_CLASS = ((1, "Class A"), (2, "Class B"), (3, "Class C"))

BUILDING_CLASS_UI = {
    1: "A",
    2: "B",
    3: "C"
}

SIZE_LANDSCAPE = (309, 220)
SIZE_THUMBNAIL = (180, 180)
SIZE_PROPERTY_HOME = (605, 370)
SIZE_DASHBOARD = (400, 400)

USER_ROLES = {
    "admin": "admin",
    "member": "member"
}

HEALTH_STATUS = {
    "PENDING": -1,
    "OFF_TRACK": 0,
    "AT_RISK": 1,
    "ON_TRACK": 2
}

BENCHMARK_CATEGORIES = (
    (1, "Number of Units 0-149"),
    (2, "Number of Units 150-299"),
    (3, "Number of Units 300+"),
    (4, "Property Class A"),
    (5, "Property Class B"),
    (6, "Property Class C"),
)

BENCHMARK_KPIS = (
    ("cds", "Cancellations/Denials"),
    ("notice_to_renew", "Notices to Renew"),
    ("notice_to_vacate", "Notices to Vacate"),
    ("move_ins", "Move Ins"),
    ("move_outs", "Move Outs"),
    ("lease_renewals", "Lease Renewals"),
    ("usvs", "Volume of USV"),
    ("inqs", "Volume of INQ"),
    ("tous", "Volume of TOU"),
    ("apps", "Volume of APP"),
    ("exes", "Volume of EXE"),
    ("cost_per_usv", "Cost per USV"),
    ("cost_per_inq", "Cost per INQ"),
    ("cost_per_tou", "Cost per TOU"),
    ("cost_per_app", "Cost per APP"),
    ("cost_per_exe", "Cost per EXE"),
    ("retention_rate", "Retention Rate"),
    ("usv_exe", "USV > EXE"),
    ("cd_rate", "Cancellation and Denial Rate"),
    ("cost_per_exe_lmr", "Cost per EXE / LMR"),
    ("usv_inq", "USV > INQ"),
    ("inq_tou", "INQ > TOU"),
    ("tou_app", "TOU > APP"),
    ("app_exe", "APP > EXE"),
)

PROPERTY_STYLE_AUTO = 0
PROPERTY_STYLES = (
    (0, "Auto"),
    (1, "Low-Rise"),
    (2, "Walk-Up"),
    (3, "Mid-Rise"),
    (4, "Hi-Rise"),
    (5, "Tower-Block"),
    (6, "Garden"),
    (7, "Other"),
)

CAMPAIGN_OBJECTIVES = (
    (0, "Pre-Lease"),
    (1, "Lease Up"),
    (2, "Phased Delivery / 2+ Buildings"),
    (3, "Maintain Stabilization"),
    (4, "Manage Occupancy"),
    (5, "Improve Performance"),
    (6, "Reintroduce Asset"),
    (7, "Dual Strategy"),
    (8, "Other"),
)
