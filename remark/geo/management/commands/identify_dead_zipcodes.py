import time

from django.core.management.base import BaseCommand

from remark.geo.models import Zipcode
from remark.lib.logging import getLogger
from remark.geo.usa_census import check_overview_page_status_code


logger = getLogger(__name__)


class Command(BaseCommand):
    help = "Identify dead zipcodes checking Atlas service"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument(
            "-s", "--states", type=str, help="Comma separated list of states"
        )

    def handle(self, *args, **kwargs):
        query = dict(has_population=None)
        states_args = kwargs["states"]
        if states_args is not None:
            query["state__in"] = [
                state.upper().strip() for state in states_args.split(",")
            ]
        logger.info(f"geo::identify_dead_zipcodes::start query {query}")
        logger.info("========================================================")

        """
        Iterate every zipcode whose has_population field is NULL (initial value)
        """
        while True:
            zipcode = Zipcode.objects.filter(**query).first()
            if zipcode is None:
                break

            # check status code of Atlas Overview page HTTP response
            status_code = check_overview_page_status_code(zipcode.zip_code)
            if status_code == 200:
                has_population = True
            elif status_code == 404:
                has_population = False
            else:
                has_population = None

            zipcode.has_population = has_population
            zipcode.save()

            if has_population is not None:
                logger.info(
                    f"geo::identify_dead_zipcodes::updated "\
                    f"zip_code={zipcode.zip_code}, "\
                    f"has_population={has_population}"
                )
            else:
                logger.error(
                    f"geo::identify_dead_zipcodes::error "\
                    f"zip_code={zipcode.zip_code}, "\
                    f"has_population=None, "\
                    f"http_status_code={status_code}"
                )

            # wait 10 seconds
            time.sleep(10)

        logger.info("========================================================")
        logger.info("geo::identify_dead_zipcodes::end")
