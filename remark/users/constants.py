import re
import os

from django.contrib.auth.password_validation import get_password_validators
import json

ACCOUNT_TYPE = (
    (1, "Property Owner"),
    (2, "Asset Manager"),
    (3, "Property Manager"),
    (4, "Remarkably"),
)

COMPANY_ROLES = [
    {"label": "Owner", "value": "owner"},
    {"label": "Developer", "value": "developer"},
    {"label": "Asset Manager", "value": "asset_manager"},
    {"label": "Property Manager", "value": "property_manager"},
    # {"label": "JV / Investor", "value": "investor"},
    # {"label": "Vendor / Consultant", "value": "vendor"},
]

BUSINESS_TYPE = {
    "owner": "is_property_owner",
    "developer": "is_developer",
    "asset_manager": "is_asset_manager",
    "property_manager": "is_property_manager",
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
UK_TOWNSHIP_LIST = []
with open('./data/locations/states.json', 'r') as read_file:
    states_list = json.load(read_file)
    for state in states_list:
        if state['country_id'] is 233:
            US_STATE_LIST.append(state['name'])
        elif state['country_id'] is 232:
            UK_TOWNSHIP_LIST.append(state['name'])

COUNTRY_LIST = [
    {"label": "United States of America", "value": "USA"},
    {"label": "United Kingdom", "value": "UK"}
]


PHONE_REGEX = re.compile(r"^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$")
US_STATE_REGEX = re.compile(r"/AL|Alabama|AK|Alaska|AZ|Arizona|AR|Arkansas|CA|California|CO|Colorado|CT|Connecticut|DE|Delaware|FL|Florida|GA|Georgia|HI|Hawaii|ID|Idaho|IL|Illinois|IN|Indiana|IA|Iowa|KS|Kansas|KY|Kentucky|LA|Louisiana|ME|Maine|MD|Maryland|MA|Massachusetts|MI|Michigan|MN|Minnesota|MS|Mississippi|MO|Missouri|MT|Montana|NE|Nebraska|NV|Nevada|NH|New Hampshire|NJ|New Jersey|NM|New Mexico|NY|New York|NC|North Carolina|ND|North Dakota|OH|Ohio|OK|Oklahoma|OR|Oregon|PA|Pennsylvania|RI|Rhode Island|SC|South Carolina|SD|South Dakota|TN|Tennessee|TX|Texas|UT|Utah|VT|Vermont|VA|Virginia|WA|Washington|WV|West Virginia|WI|Wisconsin|WY|Wyoming/")
ZIP_REGEX = re.compile(r"\d{5}(-\d{4})?$")
STREET_REGEX = re.compile(r"^\s*\S+(?:\s+\S+){2}")