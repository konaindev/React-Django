from hooks.google_analytics_hook import GoogleAnalyticsHook
from airflow.models import BaseOperator
from datetime import datetime, timedelta, date
import os


class GoogleAnalyticsReporting(BaseOperator):
    def __init__(self, view_id, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.google_analytics_conn_id = "google_analytics_default"
        self.view_id = view_id
        # self.since = since
        # self.until = until

    def execute(self, context):
        ga = GoogleAnalyticsHook(key_file=os.getenv("KEY_FILE"))
        query_date = str(date.today() - timedelta(days=1))

        try:
            response = ga.get_analytics_report(view_id=self.view_id, since=query_date, until=query_date,
                                               sampling_level="LARGE", dimensions=[{"name": "ga:source"}],
                                               metrics=[{"expression": "ga:sessionDuration"}], page_size=1000,
                                               include_empty_rows=False)
        except:
            return "ERRORRRRRRR"

        return response
