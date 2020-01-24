from airflow import DAG
from airflow.utils.decorators import apply_defaults
import os, sys
import django


class DjangoDAG(DAG):
    @apply_defaults
    def __init__(self, *args, **kwargs):
        super(DjangoDAG, self).__init__(*args, **kwargs)
        sys.path.append("./remarkably/remark")
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.settings")
        django.setup()
