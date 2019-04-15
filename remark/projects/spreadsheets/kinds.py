class SpreadsheetKind:
    PERIODS = "periods"  # Baseline and perf periods spreadsheet
    MODELING = "model"  # Modeling report (any kind)
    MARKET = "market"  # TAM
    CAMPAIGN = "campaign"  # Campaign Plan

    CHOICES = [
        (PERIODS, "Periods"),
        (MODELING, "Modeling"),
        (MARKET, "Market Report"),
        (CAMPAIGN, "Campaign Plan"),
    ]
