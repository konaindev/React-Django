from django.core.management.base import BaseCommand
from remark.geo.json_importer import import_geo_json

class Command(BaseCommand):
    help = "Import geo json data into database"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument('-s', '--state', type=str, help='Define a state in shortcode', )

    def handle(self, *args, **kwargs):
        state = kwargs['state']

        print(state)
