"""The functions in this module scrape statisticatlas.com for population demographics by zip code, and
stores those values in the database when they're found. Census data does not vary frequently."""

from enum import Enum
import requests
from typing import Any


from bs4 import BeautifulSoup
from remark.lib.logging import getLogger
from .models import (
    USACensusZip,
    USACensusPopulationByAge,
    USACensusHouseholdByType,
    USACensusIncomeDistribution,
)


STAT_ATLAS_OVERVIEW_URL = "https://statisticalatlas.com/zip/{}/Overview"
STAT_ATLAS_AGE_URL = "https://statisticalatlas.com/zip/{}/Age-and-Sex"
STAT_ATLAS_HOUSEHOLD_URL = "https://statisticalatlas.com/zip/{}/Household-Types"
STAT_ATLAS_HOUSEHOLD_INCOME_URL = "https://statisticalatlas.com/zip/{}/Household-Income"
STAT_ATLAS_REFER = "https://statisticalatlas.com/United-States/Overview"

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"


class CensusArea(Enum):
    """Defines areas for CensusDataForArea"""
    US_ZIPCODE = 'zipcode'
    RADIUS = 'radius'
    COLLECTION = 'collection'


logger = getLogger(__name__)

AGE_SEGMENT_RANGES = [
    (85, -1),
    (80, 84),
    (75, 79),
    (70, 74),
    (67, 69),
    (65, 66),
    (62, 64),
    (60, 61),
    (55, 59),
    (50, 54),
    (45, 49),
    (40, 44),
    (35, 39),
    (30, 34),
    (25, 29),
    (22, 24),
    (21, 21),
    (20, 20),
    (18, 19),
    (15, 17),
    (10, 14),
    (5, 9),
    (0, 4),
]

INCOME_DIST_RANGES = [
    (200000, -1),
    (150000, 200000),
    (125000, 150000),
    (100000, 125000),
    (75000, 100000),
    (60000, 75000),
    (50000, 60000),
    (45000, 50000),
    (40000, 45000),
    (35000, 40000),
    (30000, 35000),
    (25000, 30000),
    (20000, 25000),
    (15000, 20000),
    (10000, 15000),
    (0, 10000),
]


def find_population(el):
    return el.has_attr("title") and el["title"] == "Population"


def find_households(el):
    return el.has_attr("title") and el["title"] == "Households"


def get(url):
    headers = {"user-agent": USER_AGENT, "referer": STAT_ATLAS_REFER}
    response = requests.get(url, headers=headers)
    try:
        response.raise_for_status()
    except requests.HTTPError as exc:
        logger.error("usa_census::get::error::HTTPError", url)
        logger.error("usa_census::get::error::HTTPError", response.reason, response.text)
        raise exc
    except Exception as exc:
        logger.error("usa_census::get::error", url)
        logger.error("usa_census::get::error", response.reason, response.text)
        raise exc

    return response


def check_overview_page_status_code(zipcode):
    """
    Check HTTP status code of Atlas Overview page for a given zipcode
    - 404 status code implies that zipcode is invalid or dead(no population)
    """
    headers = {"user-agent": USER_AGENT, "referer": STAT_ATLAS_REFER}
    url = STAT_ATLAS_OVERVIEW_URL.format(zipcode)
    response = requests.get(url, headers=headers)
    logger.info(f"Checking for active page at {url} - response code {response.status_code}")
    return response.status_code


def fetch_population(zipcode):
    logger.info(f"usa_census::fetch_population::start {zipcode}")

    url = STAT_ATLAS_AGE_URL.format(zipcode)
    response = get(url)
    soup = BeautifulSoup(response.text, features="html.parser")

    pop_th = soup.find_all(find_population)[0]
    td_value = str(pop_th.td.text)
    population = int(td_value.replace(",", ""))

    house_th = soup.find_all(find_households)[0]
    td_value = str(house_th.td.text)
    households = int(td_value.replace(",", ""))

    logger.info(f"usa_census::fetch_population::end")
    return population, households


def fetch_svg(base_url, zipcode, figure_id):
    def find_figure(el):
        if el.has_attr("id") and el["id"] == figure_id:
            return True
        return False

    url = base_url.format(zipcode)
    response = get(url)

    soup = BeautifulSoup(response.text, features="html.parser")
    figures = soup.find_all(find_figure)
    if len(figures) == 0:
        ref = f'id="{figure_id}"'
        logger.info(f"Searching for {ref}...")
        logger.info(f"Results: {response.text.find(ref)}")
        raise Exception(f"Could not find the following figure: {figure_id}")

    try:
        svg = figures[0].find_all("svg")[0]
    except Exception as e:
        logger.error(f"Exception: {e}")
        logger.error(f"Length: {len(response.text)}")
        logger.error(figures[0].find("svg"))
        raise e

    return svg


def fetch_age_segments_by_zip(zipcode):
    logger.info(f"usa_census::fetch_age_segments_by_zip::{zipcode}")
    svg = fetch_svg(STAT_ATLAS_AGE_URL, zipcode, "figure/age-structure")
    gs = svg.g.find_all("g")
    result = []
    for x in range(len(gs)):
        if x >= 26 and x < 49:
            txt = gs[x].title.text
            value = float(txt.replace("%", ""))
            result.append(value / 100.0)
    logger.info(f"usa_census::fetch_age_segments_by_zip::end")
    return result


def fetch_household_type(zipcode):
    logger.info(f"usa_census::fetch_household_type::{zipcode}")
    svg = fetch_svg(STAT_ATLAS_HOUSEHOLD_URL, zipcode, "figure/household-types")
    gs = svg.g.find_all("g")
    result = []
    for x in range(len(gs)):
        if x >= 7:
            txt = gs[x].title.text
            if txt.find("%") > -1:
                value = float(txt.replace("%", "").replace(",", ""))
                result.append(value / 100.0)
    logger.info(f"usa_census::fetch_household_type::end")
    return result


def fetch_household_income(zipcode):
    logger.info(f"usa_census::fetch_household_income::{zipcode}")
    svg = fetch_svg(
        STAT_ATLAS_HOUSEHOLD_INCOME_URL, zipcode, "figure/household-income-percentiles"
    )
    gs = svg.g.find_all("g")
    result = [gs[8], gs[10], gs[12], gs[14], gs[16], gs[18]]
    for x in range(len(result)):
        txt = result[x].title.text
        result[x] = float(txt.replace("$", "").replace(",", ""))
    logger.info(f"usa_census::fetch_household_income::end")
    return result


def fetch_household_income_distribution(zipcode):
    logger.info(f"usa_census::fetch_household_income_distribution::{zipcode}")
    svg = fetch_svg(
        STAT_ATLAS_HOUSEHOLD_INCOME_URL, zipcode, "figure/household-income-distribution"
    )
    gs = svg.g.find_all("g")
    result = []
    for x in range(len(gs)):
        if x >= 19 and x < 35:
            txt = gs[x].title.text
            value = float(txt.replace("%", ""))
            result.append(value / 100.0)
    logger.info(f"usa_census::fetch_household_income_distribution::end::{zipcode}")
    return result


def get_usa_census_population(zipcode):
    usa_census_zip = USACensusZip.objects.filter(zipcode=zipcode).first()
    if usa_census_zip is None:
        if check_overview_page_status_code(zipcode) == 200:
            pop, houses = fetch_population(zipcode)
            usa_census_zip = USACensusZip.objects.create(
                total_population=pop,
                number_of_households=houses,
                zipcode=zipcode,
            )

    return usa_census_zip


def get_usa_census_age_segments(usa_census_zip):
    age_segments = usa_census_zip.age_segments.order_by("-start_age").all()
    if age_segments.count() == 0:
        age_segments_data = fetch_age_segments_by_zip(usa_census_zip.zipcode)
        age_segments = [
            USACensusPopulationByAge(
                usa_census_zip=usa_census_zip,
                population_percentage=percentage,
                start_age=AGE_SEGMENT_RANGES[idx][0],
                end_age=AGE_SEGMENT_RANGES[idx][1],
            )
            for idx, percentage in enumerate(age_segments_data)
        ]
        USACensusPopulationByAge.objects.bulk_create(age_segments)
    return [item.population_percentage for item in age_segments]


def get_usa_census_households(usa_census_zip):
    households = usa_census_zip.households.all()
    if households.count() == 0:
        households_data = fetch_household_type(usa_census_zip.zipcode)
        households = [
            USACensusHouseholdByType(
                usa_census_zip=usa_census_zip,
                household_type=household_type[0],
                household_percentage=households_data[idx],
            )
            for idx, household_type in enumerate(
                USACensusHouseholdByType.HouseholdType.CHOICES
            )
        ]
        USACensusHouseholdByType.objects.bulk_create(households)
    return [item.household_percentage for item in households]


def get_usa_census_income_distributions(usa_census_zip):
    income_distributions = usa_census_zip.income_distributions.order_by(
        "-income_start"
    ).all()
    if income_distributions.count() == 0:
        income_dist_data = fetch_household_income_distribution(usa_census_zip.zipcode)
        income_distributions = [
            USACensusIncomeDistribution(
                usa_census_zip=usa_census_zip,
                income_start=INCOME_DIST_RANGES[idx][0],
                income_end=INCOME_DIST_RANGES[idx][1],
                income_distribution_percentage=percentage,
            )
            for idx, percentage in enumerate(income_dist_data)
        ]
        USACensusIncomeDistribution.objects.bulk_create(income_distributions)
    return [item.income_distribution_percentage for item in income_distributions]


class CensusDataForArea:
    """
    This class is a Facade pattern that encapsulates the logic needed to get census data for a zip code
    The intention is to provide a stable interface and allow implementation to vary.
    """
    def __init__(self, area_type: CensusArea, area_identifier: Any):
        """
        This class is a Facade pattern that encapsulates the logic needed to get census data for a zip code
        :param area_type: CensusAreas: The type of area this instance describes
        :param area_identifier: an identifier for the area, such as a zip code or lat long radius
        :raises TypeError
        """
        if area_type not in CensusArea:
            raise TypeError(f"Invalid census area type: {area_type}")
        self.area_type = area_type
        self.area_identifier = area_identifier

        self.population = 0
        self.number_of_households = 0
        self.age_segments = []
        self.households_by_type = []
        self.income_distributions = []
        self.has_data = False

        self.populate()

    def populate(self):
        """
        Dispatch to the correct method to capture population for the CensusArea
        :return:
        """
        if self.area_type == CensusArea.US_ZIPCODE:
            self._populate_from_zip()

    def _populate_from_zip(self):
        """
        use module functions to fulfill data retrieval
        :return: None
        :raises: TypeError
        """
        if self.area_type == CensusArea.US_ZIPCODE:
            usa_census_zip = get_usa_census_population(self.area_identifier)
            if usa_census_zip is not None:
                self.age_segments = get_usa_census_age_segments(usa_census_zip)
                self.households_by_type = get_usa_census_households(usa_census_zip)
                self.income_distributions = get_usa_census_income_distributions(usa_census_zip)

                self.population = usa_census_zip.total_population
                self.number_of_households = usa_census_zip.number_of_households
                self.has_data = True
        else:
            raise TypeError("Attempted to populate census data from a zip code without a zip code type")

    def __str__(self):
        out = f"Area Type: {self.area_type} Area Identifier: {self.area_identifier}"
        out += f" Has data?: {self.has_data} Population: {self.population}"
        return out


def get_usa_census_data(zipcode: str):
    """
    See if we can get census info from a zip code. If not, return something that tells our caller we don't have any
    :param zipcode: str: a 5-digit US zip code
    :return: an instance of CensusDataForArea
    """

    return CensusDataForArea(CensusArea.US_ZIPCODE, zipcode)
