from math import radians, cos, sin, asin, sqrt
import json


"""
haversine formula
@ref: https://stackoverflow.com/questions/4913349/haversine-formula-in-python-bearing-and-distance-between-two-gps-points
"""
def distance_between_two_geopoints(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    # r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    r = 3956
    return c * r


def convert_to_miles(distance, units):
    if units == "km":
        return distance * 0.621371
    elif units == "m":
        return distance * 0.000621371
    else:
        return distance


def load_country_choices_from_json():
    countries_data = open('./data/locations/countries.json')
    countries_json = json.load(countries_data)
    return [(country["id"], country["name"]) for country in countries_json]
