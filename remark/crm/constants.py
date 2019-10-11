OFFICE_TYPES = [(1, "Global"), (2, "National"), (3, "Regional"), (4, "Other")]

OFFICE_OPTIONS = [{"label": t[1], "value": t[0]} for t in OFFICE_TYPES]

BUSINESS_ROLES = {
    "is_property_owner": "owner",
    "is_developer": "developer",
    "is_asset_manager": "asset_manager",
    "is_property_manager": "property_manager",
}
