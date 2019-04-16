import json
import os
from urllib.request import urlopen
import ijson


def import_geo_json():

    # file_handle = urlopen("https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/dc_district_of_columbia_zip_codes_geo.min.json")
    # file_handle = urlopen("https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ri_rhode_island_zip_codes_geo.min.json")

    file_handle = open("./remark/geo/sample.json", "rb")

    with file_handle as input_file:
        # load json iteratively
        features = ijson.items(input_file, 'features.item')

        for feature in features:
            print(feature["properties"])
