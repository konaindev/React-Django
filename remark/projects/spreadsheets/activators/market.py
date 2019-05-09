from ..kinds import SpreadsheetKind
from .json_activators import JSONFieldActivator
from remark.geo.models import ZipcodePolygon


class MarketActivator(JSONFieldActivator):
    spreadsheet_kind = SpreadsheetKind.MARKET
    project_field = "tmp_market_report_json"

    def activate_outlines(self):
        # At this point, self.data will contain imported data
        # from a TAM spreadsheet.
        #
        # *IF* "zip_codes" is in self.data["estimated_population"],
        # *THEN* you will want to set a value for the "outline" key
        # of each one:
        #
        population_zip_codes = self.data["estimated_population"].get("zip_codes", [])
        for population_zip_code in population_zip_codes:
            zip_code = population_zip_code["zip"]
            polygon_data = ZipcodePolygon.objects.look_up_polygon(zip_code)

            if polygon_data is not None:
                population_zip_code["properties"] = polygon_data["properties"]
                population_zip_code["outline"] = polygon_data["geometry"]

    def activate(self):
        self.activate_outlines()
        super().activate()
