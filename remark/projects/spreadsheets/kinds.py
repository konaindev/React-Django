class SpreadsheetKind:
    PERIODS = "periods"  # Baseline and perf periods spreadsheet
    MODELING = "modeling"  # Modeling report (any kind)
    MARKET = "market"  # TAM
    CAMPAIGN = "campaign"  # Campaign Plan

    CHOICES = [
        (PERIODS, "Periods"),
        (MODELING, "Modeling (must provide a subkind, too)"),
        (MARKET, "Market Report"),
        (CAMPAIGN, "Campaign Plan"),
    ]
