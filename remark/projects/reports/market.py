from . import ReportBase
from remark.geo.models import Zipcode
from remark.lib.geo import convert_to_miles


class MarketReport(ReportBase):
    """Tools for generating TAM report data."""

    # TODO for this sprint, we simply check whether the whole
    # pre-computed report is in the database or not.
    #
    # For a future sprint... do something better!

    @classmethod
    def exists(cls, project):
        """Return True if a market report exists for this project."""
        return bool(project.tmp_market_report_json)

    @classmethod
    def for_project(cls, project):
        """Return a MarketReport for this project."""
        return cls(project)

    def __init__(self, project):
        self.project = project

    def to_jsonable(self):
        report = populate_zipcode_outlines(self.project)
        # make more changes to "tmp_market_report_json" if required
        return report


def populate_zipcode_outlines(project):
    report = dict(project.tmp_market_report_json)
    estimated_population = report.get("estimated_population", {})
    population_zipcodes = estimated_population.get("zip_codes", [])
    circle_center = estimated_population.get("center", {})
    circle_radius = estimated_population.get("radius")
    circle_radius_units = estimated_population.get("units")
    radius_in_miles = convert_to_miles(circle_radius, circle_radius_units)
    center_coords = circle_center.get("coordinates")

    # zipcode areas only
    if len(population_zipcodes) > 0:
        for population_zipcode in population_zipcodes:
            polygon_data = Zipcode.objects.look_up_polygon(population_zipcode["zip"])
            if polygon_data is not None:
                population_zipcode["outline"] = polygon_data["outline"]
                population_zipcode["properties"] = polygon_data["properties"]

    # if circle mode, populate zipcodes in the circle area
    elif center_coords is not None:
        polygons = Zipcode.objects.look_up_polygons_in_circle(
            center_coords,
            radius_in_miles,
            project.address.state
        )
        report["estimated_population"]["zip_codes"] = polygons

    return report
