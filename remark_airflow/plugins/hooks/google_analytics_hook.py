import time

from airflow.hooks.base_hook import BaseHook
from apiclient.discovery import build
from apiclient.http import MediaInMemoryUpload
from oauth2client.service_account import ServiceAccountCredentials
from oauth2client.client import AccessTokenCredentials
from collections import namedtuple
import json


class GoogleAnalyticsHook(BaseHook):
    GAService = namedtuple("GAService", ["name", "version", "scopes"])
    # We need to rely on 2 services depending on the task at hand: reading from or writing to GA.
    _services = {
        "reporting": GAService(
            name="analyticsreporting",
            version="v4",
            scopes=["https://www.googleapis.com/auth/analytics.readonly"],
        ),
        "management": GAService(
            name="analytics",
            version="v3",
            scopes=["https://www.googleapis.com/auth/analytics"],
        ),
    }

    def __init__(self, google_analytics_conn_id="google_analytics_default"):
        self.google_analytics_conn_id = google_analytics_conn_id
        self.connection = self.get_connection(google_analytics_conn_id)

    def get_service_object(self, name):
        service = GoogleAnalyticsHook._services[name]

        if self.connection.password:
            credentials = AccessTokenCredentials(
                self.connection.password, "Airflow/1.10"
            )
        elif self.connection.extra_dejson["extra__google_cloud_platform__keyfile_dict"]:
            credentials = ServiceAccountCredentials.from_json_keyfile_dict(
                json.loads(
                    self.connection.extra_dejson[
                        "extra__google_cloud_platform__keyfile_dict"
                    ]
                ),
                service.scopes,
            )

        else:
            raise ValueError("No valid credentials could be found")

        return build(
            service.name,
            service.version,
            credentials=credentials,
            cache_discovery=False,
        )

    def get_management_report(self, view_id, since, until, metrics, dimensions):

        analytics = self.get_service_object(name="management")

        return (
            analytics.data()
            .ga()
            .get(
                ids=view_id,
                start_date=since,
                end_date=until,
                metrics=metrics,
                dimensions=dimensions,
            )
            .execute()
        )

    def get_analytics_report(
        self,
        view_id,
        since,
        until,
        sampling_level,
        dimensions,
        metrics,
        page_size,
        include_empty_rows,
    ):

        analytics = self.get_service_object(name="reporting")

        reportRequest = {
            "viewId": view_id,
            "dateRanges": [{"startDate": since, "endDate": until}],
            "samplingLevel": sampling_level or "LARGE",
            "dimensions": dimensions,
            "metrics": metrics,
            "pageSize": page_size or 1000,
            "includeEmptyRows": include_empty_rows or False,
        }

        response = (
            analytics.reports()
            .batchGet(body={"reportRequests": [reportRequest]})
            .execute()
        )

        if response.get("reports"):
            report = response["reports"][0]
            rows = report.get("data", {}).get("rows", [])

            while report.get("nextPageToken"):
                time.sleep(1)
                reportRequest.update({"pageToken": report["nextPageToken"]})
                response = (
                    analytics.reports()
                    .batchGet(body={"reportRequests": [reportRequest]})
                    .execute()
                )
                report = response["reports"][0]
                rows.extend(report.get("data", {}).get("rows", []))

            if report["data"]:
                report["data"]["rows"] = rows

            return report
        else:
            return {}

    def upload_string(self, account_id, profile_id, string, data_source_id):
        """
        Upload to custom data sources - example function
        https://developers.google.com/analytics/devguides/config/mgmt/v3/mgmtReference/management/uploads/uploadData
        """
        analytics = self.get_service_object(name="management")
        media = MediaInMemoryUpload(
            string, mimetype="application/octet-stream", resumable=False
        )
        analytics.management().uploads().uploadData(
            accountId=account_id,
            webPropertyId=profile_id,
            customDataSourceId=data_source_id,
            media_body=media,
        ).execute()
