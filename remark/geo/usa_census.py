import os
import requests

import click

from bs4 import BeautifulSoup
from remark.lib.memoizer import file_memoize, delay_file_memoize
from remark.lib.logging import getLogger

STAT_ATLAS_AGE_URL = "https://statisticalatlas.com/zip/{}/Age-and-Sex"
STAT_ATLAS_HOUSEHOLD_URL = "https://statisticalatlas.com/zip/{}/Household-Types"
STAT_ATLAS_HOUSEHOLD_INCOME_URL = "https://statisticalatlas.com/zip/{}/Household-Income"
STAT_ATLAS_REFER = "https://statisticalatlas.com/United-States/Overview"

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"


CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data/cache")


logger = getLogger(__name__)


def find_population(el):
    return el.has_attr("title") and el["title"] == "Population"


def find_households(el):
    return el.has_attr("title") and el["title"] == "Households"


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_population(zipcode):
    url = STAT_ATLAS_AGE_URL.format(zipcode)
    headers = {"user-agent": USER_AGENT, "referer": STAT_ATLAS_REFER}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, features="html.parser")
    pop_th = soup.find_all(find_population)[0]
    td_value = str(pop_th.td.text)
    population = int(td_value.replace(",", ""))
    logger.info(f"Population: {population}")

    house_th = soup.find_all(find_households)[0]
    td_value = str(house_th.td.text)
    households = int(td_value.replace(",", ""))
    logger.info(f"households: {population}")

    return (population, households)


def fetch_svg(base_url, zipcode, figure_id):
    def find_figure(el):
        if el.has_attr("id") and el["id"] == figure_id:
            return True
        return False

    url = base_url.format(zipcode)
    headers = {"user-agent": USER_AGENT, "referer": STAT_ATLAS_REFER}
    response = requests.get(url, headers=headers)

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


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_age_segments_by_zip(zipcode):
    svg = fetch_svg(STAT_ATLAS_AGE_URL, zipcode, "figure/age-structure")
    gs = svg.g.find_all("g")
    result = []
    for x in range(len(gs)):
        if x >= 26 and x < 49:
            txt = gs[x].title.text
            value = float(txt.replace("%", ""))
            result.append(value / 100.0)
    # logger.info(result)
    return result


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_household_type(zipcode):
    svg = fetch_svg(STAT_ATLAS_HOUSEHOLD_URL, zipcode, "figure/household-types")
    gs = svg.g.find_all("g")
    result = []
    for x in range(len(gs)):
        if x >= 7:
            txt = gs[x].title.text
            if txt.find("%") > -1:
                value = float(txt.replace("%", "").replace(",", ""))
                result.append(value / 100.0)
    return result


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_household_income(zipcode):
    svg = fetch_svg(
        STAT_ATLAS_HOUSEHOLD_INCOME_URL, zipcode, "figure/household-income-percentiles"
    )
    gs = svg.g.find_all("g")
    result = [gs[8], gs[10], gs[12], gs[14], gs[16], gs[18]]
    for x in range(len(result)):
        txt = result[x].title.text
        result[x] = float(txt.replace("$", "").replace(",", ""))
    return result


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_household_income_distribution(zipcode):
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
    logger.info(result)
    return result
