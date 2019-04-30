import json
import requests

from django.core.management.base import BaseCommand

from remark.geo.models import ZipcodePolygon


class Command(BaseCommand):
    help = "Import zipcode polygons data into database"

    def add_arguments(self, parser):
        # Optional argument
        parser.add_argument("-s", "--states", type=str, help="Comma separated list of states" )

    def handle(self, *args, **kwargs):
        states_args = kwargs['states']

        if states_args is None:
            states_to_import = list(filenames_by_state.keys())
        else:
            states_to_import = [state.lower().strip() for state in states_args.split(",")]

        print("========================================================")
        print("Started importing geojson data for the following states:")
        print(", ".join(states_to_import))

        for state in states_to_import:
            print("--------------------------------------------------------")
            print(f"state: {state}")
            try:
                zip_code_count = import_data_for_a_state(state)
                print(f"{zip_code_count} zip codes imported")
            except Exception as e:
                print(e, "\n")

        print("========================================================")


remote_folder = "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/"

filenames_by_state = {
    "ak": "ak_alaska_zip_codes_geo.min.json",
    "al": "al_alabama_zip_codes_geo.min.json",
    "ar": "ar_arkansas_zip_codes_geo.min.json",
    "az": "az_arizona_zip_codes_geo.min.json",
    "ca": "ca_california_zip_codes_geo.min.json",
    "co": "co_colorado_zip_codes_geo.min.json",
    "ct": "ct_connecticut_zip_codes_geo.min.json",
    "dc": "dc_district_of_columbia_zip_codes_geo.min.json",
    "de": "de_delaware_zip_codes_geo.min.json",
    "fl": "fl_florida_zip_codes_geo.min.json",
    "ga": "ga_georgia_zip_codes_geo.min.json",
    "hi": "hi_hawaii_zip_codes_geo.min.json",
    "ia": "ia_iowa_zip_codes_geo.min.json",
    "id": "id_idaho_zip_codes_geo.min.json",
    "il": "il_illinois_zip_codes_geo.min.json",
    "in": "in_indiana_zip_codes_geo.min.json",
    "ks": "ks_kansas_zip_codes_geo.min.json",
    "ky": "ky_kentucky_zip_codes_geo.min.json",
    "la": "la_louisiana_zip_codes_geo.min.json",
    "ma": "ma_massachusetts_zip_codes_geo.min.json",
    "md": "md_maryland_zip_codes_geo.min.json",
    "me": "me_maine_zip_codes_geo.min.json",
    "mi": "mi_michigan_zip_codes_geo.min.json",
    "mn": "mn_minnesota_zip_codes_geo.min.json",
    "mo": "mo_missouri_zip_codes_geo.min.json",
    "ms": "ms_mississippi_zip_codes_geo.min.json",
    "mt": "mt_montana_zip_codes_geo.min.json",
    "nc": "nc_north_carolina_zip_codes_geo.min.json",
    "nd": "nd_north_dakota_zip_codes_geo.min.json",
    "ne": "ne_nebraska_zip_codes_geo.min.json",
    "nh": "nh_new_hampshire_zip_codes_geo.min.json",
    "nj": "nj_new_jersey_zip_codes_geo.min.json",
    "nm": "nm_new_mexico_zip_codes_geo.min.json",
    "nv": "nv_nevada_zip_codes_geo.min.json",
    "ny": "ny_new_york_zip_codes_geo.min.json",
    "oh": "oh_ohio_zip_codes_geo.min.json",
    "ok": "ok_oklahoma_zip_codes_geo.min.json",
    "or": "or_oregon_zip_codes_geo.min.json",
    "pa": "pa_pennsylvania_zip_codes_geo.min.json",
    "ri": "ri_rhode_island_zip_codes_geo.min.json",
    "sc": "sc_south_carolina_zip_codes_geo.min.json",
    "sd": "sd_south_dakota_zip_codes_geo.min.json",
    "tn": "tn_tennessee_zip_codes_geo.min.json",
    "tx": "tx_texas_zip_codes_geo.min.json",
    "ut": "ut_utah_zip_codes_geo.min.json",
    "va": "va_virginia_zip_codes_geo.min.json",
    "vt": "vt_vermont_zip_codes_geo.min.json",
    "wa": "wa_washington_zip_codes_geo.min.json",
    "wi": "wi_wisconsin_zip_codes_geo.min.json",
    "wv": "wv_west_virginia_zip_codes_geo.min.json",
    "wy": "wy_wyoming_zip_codes_geo.min.json"
}


def import_data_for_a_state(state):

    file_name = filenames_by_state.get(state, None)

    if file_name is None:
        return

    remote_file = f"{remote_folder}{file_name}"
    response = requests.get(remote_file)
    data = json.loads(response.text)

    counter = 0

    for feature in data["features"]:
        all_props = feature["properties"]
        if all_props is None:
            continue

        counter = counter + 1
        zip_code = all_props["ZCTA5CE10"]
        lat = float(all_props["INTPTLAT10"])
        lon = float(all_props["INTPTLON10"])
        properties = dict(center=[lon, lat])

        ZipcodePolygon.objects.update_or_create(
            zip_code=zip_code,
            defaults={
                "state": state.upper(),
                "geometry": feature["geometry"],
                "properties": properties
            }
        )

    return counter
