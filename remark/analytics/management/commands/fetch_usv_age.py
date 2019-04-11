from django.core.management.base import BaseCommand
from remark.analytics.google_analytics import fetch_usv_age

class Command(BaseCommand):
    """
    Django command to test fetch_usv_age function
    """
    def handle(self, *args, **options):
        print(fetch_usv_age('ga:186306389'))
