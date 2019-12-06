import os

from django.core.management.base import BaseCommand
from tools.leading_indicator import run

BUCKET_NAME = "indicator-bucket"
FILE_PATH = "tools/leading_indicator.xlsx"
AWS_UPLOAD_COMMAND = f"aws s3 cp {FILE_PATH} s3://{BUCKET_NAME}/$(date +%s).results.xlsx"

class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Starting leading indicator run...")
        run()
        os.system(AWS_UPLOAD_COMMAND)
        print("Complete.")
