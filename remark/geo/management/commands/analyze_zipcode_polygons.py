from django.contrib.gis.measure import Area
from django.core.management.base import BaseCommand
from django.db.models import Avg, Max, Min, StdDev

from remark.geo.models import ZipcodePolygon


class Command(BaseCommand):
    help = (
        "Extract statistics (mean, max, min, standard deviation) of the zipcodes' area"
    )

    def handle(self, *args, **kwargs):
        agg_field = "land_area"

        result = ZipcodePolygon.objects.aggregate(
            mean=Avg(agg_field),
            max=Max(agg_field),
            min=Min(agg_field),
            std_dev=StdDev(agg_field),
        )

        for k in result:
            result[k] = Area(sq_m=result[k]).sq_mi

        print("========================================================")
        print("Statistics for the land area value (mi^2):")
        print("Mean: ", result["mean"])
        print("Max: ", result["max"])
        print("Min: ", result["min"])
        print("Standard Deviation: ", result["std_dev"])
        print("========================================================")
