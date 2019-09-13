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
