from remark.lib.gcp.make_iap_request import make_iap_request
from remark.settings import GOOGLE_WEBSERVER_ID, GOOGLE_CLIENT_ID
import json

def trigger_dag(dag_id, dag_params):
    client_id = GOOGLE_CLIENT_ID
    webserver_id = GOOGLE_WEBSERVER_ID
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
