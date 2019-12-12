import os
import time

import boto3
from botocore.exceptions import ClientError
from django.core.management.base import BaseCommand
from tools.leading_indicator import run

BUCKET_NAME = "indicator-bucket"
FILE_PATH = "tools/leading_indicator.xlsx"


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        print(e)
        return False
    return True


class Command(BaseCommand):
    def handle(self, *args, **options):
        print("Starting leading indicator run...")
        run()
        object_name = f"{time.time()}.results.xlsx"
        upload_file(FILE_PATH, BUCKET_NAME, object_name)
        print("Complete.")
