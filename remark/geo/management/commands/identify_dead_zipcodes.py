import time

from django.core.management.base import BaseCommand

from remark.geo.models import Zipcode
from remark.lib.logging import getLogger
from remark.geo.usa_census import check_overview_status


logger = getLogger(__name__)


class Command(BaseCommand):
    help = "Identify dead zipcodes checking Atals service"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument(
            "-s", "--states", type=str, help="Comma separated list of states"
        )

    def handle(self, *args, **kwargs):
        states_args = kwargs["states"]
        query = dict(has_population=None)
        if states_args is not None:
            query["state__in"] = [
                state.upper().strip() for state in states_args.split(",")
            ]
        logger.info(f"geo::identify_dead_zipcodes::start query {query}")

        """
        Iterate every zipcode whose `has_population` field is default value, NULL
        """
        while True:
            zipcode = Zipcode.objects.filter(**query).first()
            if zipcode is None:
                break

            # result is either of "200", "404", "OTHER"
            status = check_overview_status(zipcode.zip_code)
            has_population = None
            if status == "200":
                has_population = True
            elif status == "404":
                has_population = False

            zipcode.has_population = has_population
            zipcode.save()

            logger.info(
                f"geo::identify_dead_zipcodes::updated [{zipcode.zip_code}, {has_population}]"
            )
            time.sleep(10) # wait 10 seconds

        logger.info("geo::identify_dead_zipcodes::end")
