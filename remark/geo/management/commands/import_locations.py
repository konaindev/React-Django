from django.core.management.base import BaseCommand
import json
from remark.geo.models import Country, State, City

class Command(BaseCommand):
    help = "Import countries, states and cities into database"

    def handle(self, *args, **kwargs):
        countries_data = open('./data/locations/countries.json')
        countries_json = json.load(countries_data)
        Country.objects.all().delete()
        countries = [Country(
            pk=country["id"],
            name=country["name"],
            code=country["iso2"],
        ) for country in countries_json]
        Country.objects.bulk_create(countries)

        states_data = open('./data/locations/states.json')
        states_json = json.load(states_data)
        State.objects.all().delete()
        states = [State(**state) for state in states_json]
        State.objects.bulk_create(states)

        cities_data = open('./data/locations/cities.json')
        cities_json = json.load(cities_data)
        City.objects.all().delete()
        cities = [City(**city) for city in cities_json]
        City.objects.bulk_create(cities)
