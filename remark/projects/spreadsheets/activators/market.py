from ..kinds import SpreadsheetKind
from .json_activators import JSONFieldActivator
from remark.geo.models import Zipcode


class MarketActivator(JSONFieldActivator):
    spreadsheet_kind = SpreadsheetKind.MARKET
    project_field = "tmp_market_report_json"

    def activate_outlines(self):
        # At this point, self.data will contain imported data
        # from a TAM spreadsheet.
        #
        # *IF* "zip_codes" is in self.data["estimated_population"],
        # *THEN* geometry outlines will be populated in "MarketReport" class
        #
        population_zip_codes = self.data["estimated_population"].get("zip_codes", [])
        processed = []
        for population_zip_code in population_zip_codes:
            zip_code = population_zip_code["zip"]
            # some spreadsheets have duplicated zipcodes
            if zip_code in processed:
                population_zip_codes.remove(population_zip_code)
                continue
            else:
                processed.append(zip_code)

    def activate(self):
        self.activate_outlines()
        super().activate()
