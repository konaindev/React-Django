from . import ReportBase
from remark.geo.models import Zipcode


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
        report = dict(self.project.tmp_market_report_json)
        estimated_population = report.get("estimated_population", {})
        center = estimated_population.get("center", {})
        coordinates = center.get("coordinates")
        if coordinates is not None:
            polygons = Zipcode.objects.look_up_polygons_in_circle(
                coordinates,
                estimated_population["radius"],
            )

        report["estimated_population"]["zip_codes"] = polygons
        self.project.tmp_market_report_json = report

        return self.project.tmp_market_report_json
