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

HEALTH_STATUS = {
    "PENDING": -1,
    "OFF_TRACK": 0,
    "AT_RISK": 1,
    "ON_TRACK": 2
}
