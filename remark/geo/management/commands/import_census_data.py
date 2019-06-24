import time

import djclick as click

from remark.geo.models import Zipcode, USACensusZip
from remark.lib.logging import getLogger
from remark.geo.usa_census import get_usa_census_data

logger = getLogger(__name__)


@click.command()
@click.option(
    "-s",
    "--state",
    required=False,
    type=click.Choice(list(Zipcode.objects.values_list("state", flat=True).distinct())),
    help="State to import (UPPERCASED)",
)
@click.option(
    "-z",
    "--zipcode",
    required=False,
    type=str,
    help="Zipcode to import",
)
def command(state, zipcode):
    """Pull all of the census data from Statistical Atlas"""

    # process zipcodes which is already identified to have population
    # check identify_dead_zipcodes.py command
    query = dict(has_population=True)
    if state is not None:
        query["state__in"] = [state]
    elif zipcode is not None:
        query["zip_code"] = zipcode

    zipcode_set = Zipcode.objects.filter(**query)
    zipcode_count = zipcode_set.count()
    logger.info("========================================================")
    logger.info(f"geo::import_census_data::start {query}")
    logger.info(f"geo::import_census_data::start {zipcode_count} zipcodes to import")
    logger.info("========================================================")

    for z in zipcode_set:
        zipcode_str = z.zip_code
        usa_census_zip = USACensusZip.objects.filter(zipcode=zipcode_str).first()
        if usa_census_zip is not None:
            # if USACensusZip has already an entry with this zipcode, skip
            logger.info(f"geo::import_census_data::skipped {zipcode_str}")
            continue

        try:
            # check status code of Atlas Overview page HTTP response
            get_usa_census_data(zipcode_str)
            logger.info(f"geo::import_census_data::imported {zipcode_str}")
        except:
            logger.info(f"geo::import_census_data::failed {zipcode_str}")

        # wait 10 seconds
        time.sleep(10)

    logger.info("========================================================")
    logger.info("geo::import_census_data::end")
    logger.info("========================================================")
