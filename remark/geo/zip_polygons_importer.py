import json
import os
from urllib.request import urlopen
import ijson

US_STATES = {
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

US_STATE_TEST = {
    "dc": "dc_district_of_columbia_zip_codes_geo.min.json"
}


def import_zip_polygons_for_one_state(state_abbr):
    file_name = US_STATES.get(state_abbr, None)

    if (file_name is None):
        return

    remote_source = f"https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/{file_name}"
    file_handle = urlopen(remote_source)
    zip_code_count = 0

    with file_handle as input_file:
        # load json iteratively
        features = ijson.items(input_file, 'features.item')

        for feature in features:
            zip_code_count = zip_code_count + 1
            properties = feature["properties"]
            zip_code = properties["ZCTA5CE10"]
            geometry = feature["geometry"]

            geojson = {
                "type": geometry["type"]
            }

            if geojson["type"] == "Polygon":
                geojson["coordinates"] = geometry["coordinates"]
            elif geojson["type"] == "MultiPolygon":
                # ignore holes for optimization
                geojson["coordinates"] = [geometry["coordinates"][0]]

            # print(zip_code, geojson["type"])

    return zip_code_count


def import_zip_polygons():
    print("============================================================")
    print("Started importing geojson data for all states\n")

    for state in US_STATES:
        print("------------------------------------------------------------")
        print(f"state: [{state}] started...")
        try:
            zip_code_count = import_zip_polygons_for_one_state(state)
            print(f"state: [{state}] total: {zip_code_count} zip codes\n")
        except Exception as e:
            print(f"state: [{state}] error!!!")
            print(e, "\n")
