from django.core.management.base import BaseCommand
from remark.geo.zip_polygons_importer import import_zip_polygons

class Command(BaseCommand):
    help = "Import zip polygons data into database"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument("-s", "--state", type=str, help="Define a state's abbreviation" )

    def handle(self, *args, **kwargs):
        state = kwargs['state']

        import_zip_polygons()
