from django.contrib.auth.password_validation import get_password_validators

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
