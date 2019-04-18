from django.core.management.base import BaseCommand

from remark.geo.zipcodes.polygons_importer import import_zipcode_polygons

class Command(BaseCommand):
    help = "Import zipcode polygons data into database"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument("-s", "--states", type=str, help="Comma separated list of states" )

    def handle(self, *args, **kwargs):
        states = kwargs['states']

        if states is not None:
          states = [state.lower().strip() for state in states.split(",")]

        import_zipcode_polygons(states)
