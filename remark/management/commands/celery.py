import shlex
import subprocess

from django.core.management.base import BaseCommand
from django.utils import autoreload


# NOTE this seems like a hack that could break with future updates to django
# or related dependencies; django.utils.autoreload is not documented and
# its surface changes regularly.


def restart_celery():
    cmd = "pkill -9 celery"
    subprocess.call(shlex.split(cmd))
    cmd = "celery -A remark worker -l info"
    subprocess.call(shlex.split(cmd))


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Starting celery worker with autoreload...")
        autoreload.run_with_reloader(restart_celery)
