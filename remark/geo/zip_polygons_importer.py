import json
import os
from urllib.request import urlopen
import ijson

us_states_map = {
    'dc': 'dc_district_of_columbia'
}


def import_zip_polygons_for_one_state(state_abbr):
    file_slug = us_states_map.get(state_abbr, None)

    if (file_slug is None):
        return

    remote_source = f"https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/{file_slug}_zip_codes_geo.min.json"
    file_handle = urlopen(remote_source)

    with file_handle as input_file:
        # load json iteratively
        features = ijson.items(input_file, 'features.item')

        for feature in features:
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

            print(zip_code, geojson["type"])


def import_zip_polygons():

    print("============================================================")
    print("Started importing geojson data for all states\n")

    for state in us_states_map:
        print("------------------------------------------------------------")
        print(f"state: [{state}] started...")
        import_zip_polygons_for_one_state(state)
        print(f"state: [{state}] complete!!!\n")
