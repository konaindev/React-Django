from remark.lib.gcp.make_iap_request import make_iap_request
from remark.settings import GOOGLE_WEBSERVER_ID, GOOGLE_CLIENT_ID
import json

def trigger_dag(dag_id, dag_params):
    """Makes a POST request to the Composer DAG Trigger API

    When called via Google Cloud Functions (GCF),
    data and context are Background function parameters.

    For more info, refer to
    https://cloud.google.com/functions/docs/writing/background#functions_background_parameters-python

    To call this function from a Python script, omit the ``context`` argument
    and pass in a non-null value for the ``data`` argument.
    """

    # Fill in with your Composer info here
    # Navigate to your webserver's login page and get this from the URL
    # Or use the script found at
    # https://github.com/GoogleCloudPlatform/python-docs-samples/blob/master/composer/rest/get_client_id.py
    client_id = GOOGLE_CLIENT_ID
    # This should be part of your webserver's URL:
    # {tenant-project-id}.appspot.com
    webserver_id = GOOGLE_WEBSERVER_ID
    # The name of the DAG you wish to trigger
    dag_name = dag_id
    webserver_url = (
        'https://'
        + webserver_id
        + '.appspot.com/api/experimental/dags/'
        + dag_name
        + '/dag_runs'
    )

    payload = {
        'conf': json.dumps(dag_params)
    }

    # Make a POST request to IAP which then Triggers the DAG
    trigger_request = make_iap_request(webserver_url, client_id, method='POST', data=json.dumps(payload))

    return trigger_request
