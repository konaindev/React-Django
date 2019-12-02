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

SIZE_LANDSCAPE = (309, 220)
SIZE_THUMBNAIL = (180, 180)

USER_ROLES = {
    "admin": "admin",
    "member": "member"
}

PROPERTY_STYLES = {
    "low_rise": "Low-Rise",
    "walk_up": "Walk-Up",
    "mid_rise": "Mid-Rise",
    "hi_rise": "Hi-Rise",
    "tower_block": "Tower-Block",
    "garden": "Garden",
    "other": "Other",
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
