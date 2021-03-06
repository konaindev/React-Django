from googleapiclient.discovery import build
from google.oauth2 import service_account
import json

SCOPES = ["https://www.googleapis.com/auth/analytics.readonly"]

AGE_BRACKETS = [
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65+",
]

def initialize_analytics_reporting():
    """Initializes an Analytics Reporting API V4 service object.

    Returns:
    An authorized Analytics Reporting API V4 service object.
    """
    # passing an empty json object for now. this code will be removed and logic will be placed in remark_airflow
    service_account_info = json.loads({})
    credentials = service_account.Credentials.from_service_account_info(service_account_info)

    # Build the service object.
    analytics = build("analyticsreporting", "v4", credentials=credentials)

    return analytics


def get_report(analytics, site_id):
    """Queries the Analytics Reporting API V4.

    Args:
    analytics: An authorized Analytics Reporting API V4 service object.
    Returns:
    The Analytics Reporting API V4 response.
    """
    return analytics.reports().batchGet(
        body={
            "reportRequests": [{
                "viewId": site_id,
                "dateRanges": [{"startDate": "365daysAgo", "endDate": "today"}],
                "metrics": [{"expression": "ga:sessions"}],
                "dimensions": [{"name": "ga:userAgeBracket"}]
            }]
        }
    ).execute()


def get_report_usv_age_from_response(response):
    """Parses the response and returns the usv age

    Args:
    response: The Analytics Reporting API V4 http response
    Returns:
    Array of values for age brackets
    ex.
    [
       1000, # 18-24
       1451, # 25-34
       1205, # 35-44
       1542, # 45-54
       1121, # 55-64
       1405 # 65+
    ]
    """

    report_rows = response.get("reports", [None])[0].get("data", {}).get("rows", [])
    if len(report_rows) <= 0:
        return [0] * len(AGE_BRACKETS)

    row = report_rows[0]
    usv = []
    dimensions = row.get("dimensions", [])
    metrics = row.get("metrics", [])
    for age_range in AGE_BRACKETS:
        try:
            idx = dimensions.index(age_range)
        except ValueError:
            usv.append(0)
            continue
        try:
            usv.append(int(metrics[idx]["values"][0]))
        except IndexError:
            raise ValueError("Value doesn't exist for age range {}".format(age_range))
    return usv


def fetch_usv_age(SITE_ID):
    analytics = initialize_analytics_reporting()
    response = get_report(analytics, SITE_ID)
    return get_report_usv_age_from_response(response)


def get_blank_usvs():
    return [0, 0, 0, 0, 0, 0]


def get_project_usvs(project):
    google_provider = project.analytics_providers.google()
    if google_provider is not None:
        try:
            return fetch_usv_age(google_provider.identifier)
        except:
            pass
    return get_blank_usvs()


def get_usv_report(analytics, site_id, start="365daysAgo", end="today"):
    response = (
        analytics.reports()
        .batchGet(
            body={
                "reportRequests": [
                    {
                        "viewId": site_id,
                        "dateRanges": [{"startDate": start, "endDate": end}],
                        "metrics": [{"expression": "ga:sessions"}],
                        "dimensions": [{"name": "ga:userType"}, {"name": "ga:source"}],
                        "filtersExpression": "ga:userType==New Visitor",
                        "orderBys": [
                            {"fieldName": "ga:sessions", "sortOrder": "DESCENDING"}
                        ],
                    }
                ]
            }
        )
        .execute()
    )
    rows = response.get("reports", [{}])[0].get("data", {}).get("rows", [])
    totals = (
        response.get("reports", [{}])[0]
        .get("data", {})
        .get("totals", [{}])[0]
        .get("values", [""])[0]
    )
    data = [
        {
            "source": r.get("dimensions", [None, ""])[1],
            "visitors": int(r.get("metrics", [{}])[0].get("values", ["0"])[0]),
        }
        for r in rows
    ]
    return {"stat": data, "totals": int(totals)}


def get_project_usv_sources(project, start, end):
    google_provider = project.analytics_providers.google()
    if google_provider is not None:
        try:
            analytics = initialize_analytics_reporting()
            start_str = start.strftime("%Y-%m-%d")
            end_str = end.strftime("%Y-%m-%d")
            return get_usv_report(
                analytics, google_provider.identifier, start_str, end_str
            )
        except:
            pass
    return {"stat": [], "totals": 0}
