import requests

from remark.settings import AIRFLOW_URL
from remark.lib.logging import getLogger

logger = getLogger(__name__)


def trigger_dag(dag_id, params=None):
    url = f"{AIRFLOW_URL}/api/experimental/dags/{dag_id}/dag_runs"
    try:
        response = requests.post(url, data=params)
        response.raise_for_status()
    except requests.RequestException:
        logger.error("airflow::trigger_dag", dag_id)
