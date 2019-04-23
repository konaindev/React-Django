import functools
import os
import pickle
import requests
import tempfile
import time
import xml.etree.ElementTree as ET

import click

from bs4 import BeautifulSoup
from openpyxl import load_workbook

FREE_MAP_TOOLS_URL = "https://www.freemaptools.com/ajax/us/get-all-zip-codes-inside.php"
FREE_MAP_REFERER = "https://www.freemaptools.com/find-zip-codes-inside-radius.htm"

STAT_ATLAS_AGE_URL = "https://statisticalatlas.com/zip/{}/Age-and-Sex"
STAT_ATLAS_HOUSEHOLD_URL = "https://statisticalatlas.com/zip/{}/Household-Types"
STAT_ATLAS_HOUSEHOLD_INCOME_URL = "https://statisticalatlas.com/zip/{}/Household-Income"
STAT_ATLAS_REFER = "https://statisticalatlas.com/United-States/Overview"

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36"
MILES_KILOMETERS_RATIO = 1.60934


CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../data/cache")
DEFAULT_TEMPLATE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "../templates/tam-template.xlsx"
)
DEFAULT_OUTFILE_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "../../dist/remarkably-tam-test.xlsx"
)


VERBOSE = False


def print_verbose(*args, **kwargs):
    if VERBOSE:
        print(*args, **kwargs)


class Memoizer:
    """An abstract base decorator that implements generic memoization."""

    def __init__(self):
        """Initialize a memoizer, possibly with arguments in derived classes."""
        pass

    def get_key(self, args, kwargs):
        """Get the cache key for a given func invocation."""
        raise NotImplementedError()

    def contains(self, key):
        """Return True if key is in memoized cache."""
        raise NotImplementedError()

    def read(self, key):
        """Return data for key if in cache, otherwise raise an exception."""
        raise NotImplementedError()

    def write(self, key, data):
        """Write data for key to cache, overwriting extant data."""
        raise NotImplementedError()

    def memoize(self, func, args, kwargs):
        """Return cached data, or invoke the underlying func if not."""
        key = self.get_key(args, kwargs)
        if self.contains(key):
            data = self.read(key)
        else:
            print_verbose("Invoking ", func.__name__, args, kwargs)
            data = func(*args, **kwargs)
            self.write(key, data)
        return data

    def __call__(self, func):
        # Since this class takes __init__ parameters, __call__ must wrap.
        self.func = func

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            return self.memoize(func, args, kwargs)

        return wrapper


class file_memoize(Memoizer):
    """Memoizer that writes to a cache files directory."""

    def __init__(self, cache_dir=None):
        """
        Initialize a memoizer with a given cache directory.
        """
        super().__init__()
        self.cache_dir = cache_dir or tempfile.mkdtemp()

    def get_key(self, args, kwargs):
        # The key is the file path
        args_key = "_".join([f"{arg}" for arg in args])
        kwargs_key = "_".join([f"{k}-{v}" for k, v in kwargs.items()])
        file_name = f"{self.func.__name__}{'_' if args_key else ''}{args_key}{'_' if kwargs_key else ''}{kwargs_key}.pkl"
        path = os.path.join(self.cache_dir, file_name)
        return path

    def contains(self, key):
        return os.path.exists(key)

    def read(self, key):
        with open(key, "rb") as f:
            data = pickle.load(f)
        return data

    def write(self, key, data):
        with open(key, "wb") as f:
            pickle.dump(data, f)


class delay_file_memoize(file_memoize):
    """Memoizer that writes to a cache files directory and also delays after each memoization."""

    def __init__(self, cache_dir=None, delay=2):
        super().__init__(cache_dir=cache_dir)
        self.delay = delay

    def memoize(self, func, args, kwargs):
        result = super().memoize(func, args, kwargs)
        time.sleep(self.delay)
        return result


@delay_file_memoize(cache_dir=CACHE_DIR)
def fetch_zip_codes(latitude, longitude, radius):
    params = {
        "radius": radius,
        "lat": latitude,
        "lng": longitude,
        "rn": 8192,
        "showPOboxes": "true",
    }
    headers = {"user-agent": USER_AGENT, "referer": FREE_MAP_REFERER}
    response = requests.get(FREE_MAP_TOOLS_URL, params=params, headers=headers)
    root = ET.fromstring(response.text)
    result = []
    for child in root:
        result.append(child.attrib["postcode"])
    return result


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
    print_verbose(f"Population: {population}")

    house_th = soup.find_all(find_households)[0]
    td_value = str(house_th.td.text)
    households = int(td_value.replace(",", ""))
    print_verbose(f"households: {population}")

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
        print_verbose(f"Searching for {ref}...")
        print_verbose(f"Results: {response.text.find(ref)}")
        raise Exception(f"Could not find the following figure: {figure_id}")

    try:
        svg = figures[0].find_all("svg")[0]
    except Exception as e:
        print_verbose(f"Exception: {e}")
        print_verbose(f"Length: {len(response.text)}")
        print_verbose(figures[0].find("svg"))
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
    # print_verbose(result)
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
    print_verbose(result)
    return result


def write_labeled_data(ws, title, labels, data, start_row):
    if len(data) != len(labels):
        print_verbose(labels)
        print_verbose(data)
        raise Exception(f"Data length and label length is not equal.")

    ws.cell(column=1, row=start_row, value=title)
    for x in range(len(data)):
        actual_row = x + 1 + start_row
        ws.cell(column=1, row=actual_row, value=labels[x])
        ws.cell(column=2, row=actual_row, value=data[x])
    return None


def write_label_item(ws, label, item, row):
    ws.cell(column=1, row=row, value=label)
    ws.cell(column=2, row=row, value=item)


AGE_SEGMENT_LABELS = [
    "85+",
    "80-84",
    "75-79",
    "70-74",
    "67-69",
    "65-66",
    "62-64",
    "60-61",
    "55-59",
    "50-54",
    "45-49",
    "40-44",
    "35-39",
    "30-34",
    "25-29",
    "22-24",
    "21",
    "20",
    "18-19",
    "15-17",
    "10-14",
    "5-9",
    "0-4",
]

HOUSEHOLD_TYPE_LABELS = [
    "Married",
    "Single Female",
    "Single Male",
    "One Person",
    "Non-Family",
]

INCOME_DIST_LABELS = [
    "$200k",
    "$150-200k",
    "$125-150k",
    "$100-125k",
    "$75-100k",
    "$60-75k",
    "$50-60k",
    "$45-50k",
    "$40-45k",
    "$35-40k",
    "$30-35k",
    "$25-30k",
    "$20-25k",
    "$15-20k",
    "$10-15k",
    "< $10k",
]
AGE_SEGMENTS = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]

ZIP_DATA_SHEET_NAME = "Zip Data {}"


def fill_zip_worksheet(workbook, zipcode):
    # Fetch all data first - if a Zip Code doesn't work. Ignore it.
    population = fetch_population(zipcode)
    age_segments = fetch_age_segments_by_zip(zipcode)
    household_type = fetch_household_type(zipcode)
    # household_income = fetch_household_income(zipcode)
    income_dist = fetch_household_income_distribution(zipcode)

    print_verbose("POP")
    print_verbose(population)

    # Create speadsheet
    worksheet = workbook.create_sheet(title=ZIP_DATA_SHEET_NAME.format(zipcode))
    write_label_item(worksheet, "Total Population", population[0], 1)
    write_label_item(worksheet, "Number of Households", population[1], 2)
    write_labeled_data(
        worksheet, "Population by Age Segment", AGE_SEGMENT_LABELS, age_segments, 4
    )
    write_labeled_data(
        worksheet,
        "Household by Type",
        HOUSEHOLD_TYPE_LABELS,
        household_type,
        len(age_segments) + 6,
    )
    write_labeled_data(
        worksheet,
        "Income Distribution",
        INCOME_DIST_LABELS,
        income_dist,
        len(age_segments) + len(household_type) + 8,
    )


def pop_formula(zip_codes, percent_values):
    formula = []
    for zip_code in zip_codes:
        subformula = []
        tab_name = ZIP_DATA_SHEET_NAME.format(zip_code)
        for val in percent_values:
            subformula.append(f"'{tab_name}'!B{val}")
        sf = f"('{tab_name}'!B1*({'+'.join(subformula)}))"
        formula.append(sf)
    result = "+".join(formula)
    return f"=ROUND({result}, 0)"


INCOME_DIST_LEVELS = (
    (0, 52),
    (10000, 51),
    (15000, 50),
    (20000, 49),
    (25000, 48),
    (30000, 47),
    (35000, 46),
    (40000, 45),
    (45000, 44),
    (50000, 43),
    (60000, 42),
    (75000, 41),
    (100000, 40),
    (125000, 39),
    (150000, 38),
    (200000, 37),
)


def fill_computation_tab(worksheet, zip_codes, income_groups):
    # Add ACS Population Reference Sumed across all zip_codes
    age_group_pop_schema = (
        (3, ("23", "22", "21", "20")),  # 18-24
        (4, ("18", "19")),  # 25-34
        (5, ("17", "16")),  # 35-44
        (6, ("15", "14")),  # 45-54
        (7, ("13", "12", "11")),  # 55-64
        (8, ("10", "9", "8", "7", "6", "5")),  # 65+
    )
    for dest_row, percent_values in age_group_pop_schema:
        formula = pop_formula(zip_codes, percent_values)
        worksheet.cell(column=2, row=dest_row, value=formula)

    start_x = 0
    for y in range(len(income_groups)):
        income_group = income_groups[y]
        if len(income_groups) - 1 == y:
            next_income_group = None
        else:
            next_income_group = income_groups[y + 1]
        numerator = []
        denominator = []
        for x in range(start_x, len(INCOME_DIST_LEVELS)):
            if (
                next_income_group is not None
                and next_income_group <= INCOME_DIST_LEVELS[x][0]
            ):
                print_verbose(
                    f"Income Break: {income_group} <= {INCOME_DIST_LEVELS[x][0]}"
                )
                break
            if income_group <= INCOME_DIST_LEVELS[x][0]:
                for zip_code in zip_codes:
                    tab_name = ZIP_DATA_SHEET_NAME.format(zip_code)
                    numerator.append(
                        f"('{tab_name}'!B{INCOME_DIST_LEVELS[x][1]}*'{tab_name}'!B1)"
                    )
            start_x = x + 1

        for zip_code in zip_codes:
            tab_name = ZIP_DATA_SHEET_NAME.format(zip_code)
            denominator.append(f"'{tab_name}'!B1")

        numerator_str = f"=({'+'.join(numerator)})"
        denominator_str = f"=({'+'.join(denominator)})"
        # final_formula = f"=({'+'.join(numerator)})/({'+'.join(denominator)})"
        worksheet.cell(column=1, row=20 + y, value=income_groups[y])
        # worksheet.cell(column=2, row=20 + y, value=final_formula)
        worksheet.cell(column=3, row=20 + y, value=numerator_str)
        worksheet.cell(column=4, row=20 + y, value=denominator_str)

    # Total population
    formula = []
    for zip_code in zip_codes:
        tab_name = ZIP_DATA_SHEET_NAME.format(zip_code)
        formula.append(f"'{tab_name}'!B1")
    worksheet.cell(column=2, row=29, value=f"={'+'.join(formula)}")

    # Add Household Types
    numerator = []
    for zip_code in zip_codes:
        tab_name = ZIP_DATA_SHEET_NAME.format(zip_code)
        numerator.append(
            f"(('{tab_name}'!B30+'{tab_name}'!B31+'{tab_name}'!B32)*'{tab_name}'!B1)"
        )
    final_formula = f"=({'+'.join(numerator)})/'Computation'!B29"
    worksheet.cell(column=2, row=25, value=final_formula)


def write_labeled_property(
    worksheet, search_value, write_value, search_column=1, write_column=2
):
    for x in range(1, 500):
        cell = worksheet.cell(column=search_column, row=x)
        if cell.value == search_value:
            return worksheet.cell(column=write_column, row=x, value=write_value)
    raise Exception("Did not find required label for value.")


def write_rti_info(worksheet, rti_income_groups, rti_rental_rates, rti_target):
    for x in range(len(rti_income_groups)):
        worksheet.cell(column=2 + x, row=26, value=rti_income_groups[x])
    for y in range(len(rti_rental_rates)):
        worksheet.cell(column=1, row=27 + y, value=rti_rental_rates[y])
    write_labeled_property(worksheet, "Target RTI", rti_target)


def write_tam_type(worksheet, lat, lon, tam_type, tam_data):
    if tam_type not in ["zipcodes", "radius"]:
        raise Exception("Tam Type is invalid")
    worksheet.cell(column=2, row=4, value=tam_type)
    if tam_type == "zipcodes":
        for x in range(len(tam_data)):
            worksheet.cell(column=3 + x, row=4, value=tam_data[x])
    elif tam_type == "radius":
        worksheet.cell(column=3, row=4, value=tam_data)
        worksheet.cell(column=4, row=4, value="mi")

    write_labeled_property(worksheet, "Coordinates", lat)
    write_labeled_property(worksheet, "Coordinates", lon, write_column=3)


def write_output_properties(worksheet, loc, max_rent, avg_rent, min_rent, usvs):
    write_labeled_property(worksheet, "City, State", loc)
    write_labeled_property(worksheet, "Maximum Rent", max_rent)
    write_labeled_property(worksheet, "Average Rent", avg_rent)
    write_labeled_property(worksheet, "Minimum Rent", min_rent)
    # Age Segment USVS
    for x in range(len(AGE_SEGMENTS)):
        write_labeled_property(worksheet, AGE_SEGMENTS[x], usvs[x], write_column=3)


# Meridian
# Zip Codes: 84101,84111,84102,84112,84115,84105
# Income Groups: 75000, 50000, 35000

# El Cortez
# Zip Codes: 85013
# Income Groups: 25000, 45000, 60000


def build_tam_data_for_zip_codes(workbook, zip_codes, income_groups):
    # generate Zip Code Worksheet
    live_zipcodes = []
    for zip_code in zip_codes:
        try:
            print_verbose(f"Starting zip: {zip_code}")
            fill_zip_worksheet(workbook, zip_code)
            live_zipcodes.append(zip_code)
            print_verbose(f"Completed zip: {zip_code}")
        except Exception:
            print_verbose(f"FAILED zip: {zip_code}")
            # raise e

    fill_computation_tab(workbook["Computation"], live_zipcodes, income_groups)

    # TODO what's all this, then?
    # fetch_zip_codes(latitude, longitude, radius * MILES_KILOMETERS_RATIO)
    # fetch_age_segments_by_zip('85013')
    # parse_age_segments(STAT_ATLAS_AGE_CONTENT)
    # fetch_household_income_distribution('85013')


def build_tam_data_for_location(workbook, location, radius, income_groups):
    zip_codes = fetch_zip_codes(
        location[0], location[1], radius * MILES_KILOMETERS_RATIO
    )
    print_verbose(f"zipcodes: {zip_codes}")
    return build_tam_data_for_zip_codes(workbook, zip_codes, income_groups)


def build_tam_data(
    zip_codes,
    lat,
    lon,
    loc,
    radius,
    income_groups,
    rti_income_groups,
    rti_rental_rates,
    rti_target,
    age,
    max_rent,
    avg_rent,
    min_rent,
    usvs,
    templatefile=DEFAULT_TEMPLATE_PATH,
):

    # Must have 4+ rental rates
    if len(rti_rental_rates) < 4:
        raise Exception("Must have 4 or more RTI rental rates")

    if len(rti_income_groups) < 4:
        raise Exception("Must have 4 or more RTI income groups")

    if len(usvs) != 6:
        raise Exception("There must be six USV entries")

    if rti_target is None:
        rti_target = 0.3333

    # Load workbook
    workbook = load_workbook(templatefile)

    # Delete Sample Data tab
    workbook.remove(workbook["Sample Zip Data"])

    # Build the data into the workbook
    if zip_codes:
        build_tam_data_for_zip_codes(workbook, zip_codes, income_groups)
        write_tam_type(workbook["Output"], lat, lon, "zipcodes", zip_codes)
    elif lat and lon and radius:
        build_tam_data_for_location(workbook, (lat, lon), radius, income_groups)
        write_tam_type(workbook["Output"], lat, lon, "radius", radius)
    else:
        raise click.UsageError(
            "You must specify either zip_codes *or* a location and radius."
        )

    # Write Output tab Data
    write_rti_info(workbook["Output"], rti_income_groups, rti_rental_rates, rti_target)
    write_output_properties(workbook["Output"], loc, max_rent, avg_rent, min_rent, usvs)

    return workbook


@click.command()
@click.option("--lat", type=float, required=True, help="The latitude.")
@click.option("--lon", type=float, required=True, help="The longitude.")
@click.option(
    "--loc",
    type=str,
    required=True,
    help="The City and State of the location in {city},{state} format",
)
@click.option("-r", "--radius", type=float, help="A radius in miles.")
@click.option(
    "-z", "--zip", "zip_codes", type=int, multiple=True, help="A list of ZIP codes."
)
@click.option(
    "-i",
    "--income",
    "income_groups",
    type=int,
    multiple=True,
    required=True,
    help="A list of income group codes.",
)
@click.option(
    "-g",
    "--rti-income",
    "rti_income_groups",
    type=int,
    multiple=True,
    required=True,
    help="A list of RTI income limits",
)
@click.option(
    "-m",
    "--rti-rent",
    "rti_rental_rates",
    type=int,
    multiple=True,
    required=True,
    help="A list of RTI rental rates",
)
@click.option(
    "-e", "--rti-target", "rti_target", type=float, help="RTI target percent."
)
@click.option("-a", "--age", type=int, required=True, help="Average Tenant Age")
@click.option(
    "-b", "--max-rent", "max_rent", type=int, required=True, help="Maximum Rent"
)
@click.option(
    "-c", "--avg-rent", "avg_rent", type=int, required=True, help="Average Rent"
)
@click.option(
    "-d", "--min-rent", "min_rent", type=int, required=True, help="Minimum Rent"
)
@click.option(
    "-u",
    "--usvs",
    type=int,
    multiple=True,
    required=True,
    help="Unique Site Visitors. There must be 6 entries.",
)
@click.option(
    "-t",
    "--templatefile",
    default=DEFAULT_TEMPLATE_PATH,
    type=click.Path(exists=True),
    help="The TAM XLS template path.",
)
@click.option(
    "-o",
    "--outfile",
    default=DEFAULT_OUTFILE_PATH,
    type=click.Path(),
    help="The output XLS filename",
)
def main(
    zip_codes,
    lat,
    lon,
    loc,
    radius,
    income_groups,
    rti_income_groups,
    rti_rental_rates,
    rti_target,
    age,
    max_rent,
    avg_rent,
    min_rent,
    usvs,
    templatefile,
    outfile,
):
    workbook = build_tam_data(
        zip_codes,
        lat,
        lon,
        loc,
        radius,
        income_groups,
        rti_income_groups,
        rti_rental_rates,
        rti_target,
        age,
        max_rent,
        avg_rent,
        min_rent,
        usvs,
        templatefile,
    )
    # Save the resulting workbook
    workbook.save(filename=outfile)


if __name__ == "__main__":
    VERBOSE = True
    build_tam_data()
