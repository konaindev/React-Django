
import re
import os

from django.contrib.auth.password_validation import get_password_validators
import json
from remark.settings import PATH_REF

US_COUNTRY_ID = 233
GB_COUNTRY_ID = 232

ACCOUNT_TYPE = (
    (1, "Property Owner"),
    (2, "Asset Manager"),
    (3, "Property Manager"),
    (4, "Remarkably"),
)

COMPANY_ROLES = [
    {"label": "Asset Ownership", "value": "owner"},
    {"label": "Development", "value": "developer"},
    {"label": "Asset Management", "value": "asset_manager"},
    {"label": "Property Management", "value": "property_manager"},
    {"label": "JV / Investment", "value": "investor"},
    {"label": "Vendor / Consulting", "value": "vendor"},
]

BUSINESS_TYPE = {
    "owner": "is_property_owner",
    "developer": "is_developer",
    "asset_manager": "is_asset_manager",
    "property_manager": "is_property_manager",
    "investor": "is_investor",
    "vendor": "is_vendor",
}

VALIDATION_RULES = [
    {
        "validator": get_password_validators(
            [{"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"}]
        ),
        "label": "Be at least 8 characters",
        "key": "password-length",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"
                }
            ]
        ),
        "label": "Contain alphabetic characters",
        "key": "characters",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
                }
            ]
        ),
        "label": "Not match personal information",
        "key": "personal",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"
                }
            ]
        ),
        "label": "Not be a commonly used password",
        "key": "used",
    },
]

VALIDATION_RULES_LIST = [{"label": v["label"], "key": v["key"]} for v in VALIDATION_RULES]

US_STATE_LIST = []
GB_COUNTY_LIST = []
with open(f'{PATH_REF}/data/locations/states.json', 'r') as read_file:
    states_list = json.load(read_file)
    for state in states_list:
        if state['country_id'] is US_COUNTRY_ID:
            US_STATE_LIST.append({"label": state['name'], "value": state['name']})
        elif state['country_id'] is GB_COUNTRY_ID:
            GB_COUNTY_LIST.append({"label": state['name'], "value": state['name']})

COUNTRY_LIST = [
    {"label": "United States of America", "value": "USA"},
    {"label": "United Kingdom", "value": "GBR"}
]


# PHONE_REGEX = re.compile(r"^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$")
PHONE_REGEX = re.compile(r"(^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$)|(^(?=.*[0-9])[- +()0-9]{8,15}$)")
COUNTRY_CODE_REGEX = re.compile(r"^(\+?\d{1,3}|\d{1,4})$")
ZIP_REGEX = re.compile(r"(\d{5}(-\d{4})?$)|(^([A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([0-9]|[ABEHMNPRV-Y]))|[0-9][A-HJKS-UW])\ [0-9][ABD-HJLNP-UW-Z]{2}|(GIR\ 0AA)|(SAN\ TA1)|(BFPO\ (C\/O\ )?[0-9]{1,4})|((ASCN|BBND|[BFS]IQQ|PCRN|STHL|TDCU|TKCA)\ 1ZZ))$)")
STREET_REGEX = re.compile(r"^\s*\S+(?:\s+\S+){2}")
PROJECT_ROLES = {
    "member": "member",
    "admin": "admin",
    "staff": "staff"
}

VALIDATION_RULES = [
    {
        "validator": get_password_validators(
            [{"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"}]
        ),
        "label": "Be at least 8 characters",
        "key": "password-length",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"
                }
            ]
        ),
        "label": "Contain alphabetic characters",
        "key": "characters",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
                }
            ]
        ),
        "label": "Not match personal information",
        "key": "personal",
    },
    {
        "validator": get_password_validators(
            [
                {
                    "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"
                }
            ]
        ),
        "label": "Not be a commonly used password",
        "key": "used",
    },
]
