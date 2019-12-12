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

HEALTH_STATUS = {
    "PENDING": -1,
    "OFF_TRACK": 0,
    "AT_RISK": 1,
    "ON_TRACK": 2
}
