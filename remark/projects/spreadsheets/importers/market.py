from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    advance_col,
    advance_row,
    ChoiceCell,
    cols_until_empty,
    cols_until,
    CurrencyCell,
    find_row,
    FloatCell,
    IntCell,
    loc,
    location_range_rect,
    next_col,
    next_row,
    rows_until_empty,
    StrCell,
)

from .base import ProjectExcelImporter


# TODO in this importer, I explored a few different ways to use the APIs.
# They all work; I like some better than others, and learned a few things
# about how to simplify the APIs. But I haven't *done* that yet, so please
# forgive the inconsistencies for the time being. -Dave


def find(predicate, target="B"):
    """Return a locator that scans the Output!A column for header values and returns target column."""
    return find_row("Output!A", predicate, target=target)


class MarketImporter(ProjectExcelImporter):
    expected_type = "tam"  # TODO rationalize our naming here.
    expected_version = 1

    RENT_TO_INCOME_CATEGORIES = [
        "Low",
        "Moderately Low",
        "Target",
        "Moderately High",
        "High",
    ]

    SEGMENT_OVERVIEW_SCHEMA = {
        "age_group": StrCell(loc("Output!A")),
        "market_size": IntCell(loc("Output!B")),
        "usv": IntCell(loc("Output!C")),
        "growth": FloatCell(loc("Output!D")),
        "future_size": IntCell(loc("Output!E")),
    }

    POPULATION_RADIUS_SCHEMA = {
        "center": {
            "type": "Point",
            "coordinates": [
                FloatCell(find("coordinates", "C")),
                FloatCell(find("coordinates", "B")),
            ],
        },
        "radius": FloatCell(find("tam type", "C")),
        "units": ChoiceCell(find("tam type", "D"), choices=["mi", "km"]),
    }

    @staticmethod
    def POPULATION_ZIP_SCHEMA(row):
        return {
            "zip": StrCell(loc(sheet="Output", row=row)),
            "outline": None,
            "properties": None,
        }

    @staticmethod
    def RTI_SCHEMA(category):
        return {
            "name": category,
            "low": FloatCell(loc("B")),
            "high": FloatCell(loc("C")),
        }

    TOTAL_SCHEMA = {
        "segment_population": IntCell(find("est. population")),
        "market_size": IntCell(find("total market size")),
        "usv": IntCell(find("total usv")),
        "future_size": IntCell(find("future population size")),
    }

    AVERAGE_SCHEMA = {
        "age": IntCell(find("total average age")),
        "growth": FloatCell(find("total average growth")),
    }

    def get_location(self):
        return self.schema(StrCell(find("city, state")))

    def get_estimated_population_radius(self):
        return self.schema(self.POPULATION_RADIUS_SCHEMA)

    def get_estimated_population_zip(self):
        _, _, row = find("tam type")(self.workbook)
        cols = cols_until_empty(self.workbook, "C", test_sheet="Output", test_row=row)
        zip_codes = self.schema_list(
            schema=self.POPULATION_ZIP_SCHEMA(row), locations=cols
        )
        return {"zip_codes": zip_codes}

    def get_estimated_population(self):
        tam_type = self.schema(
            ChoiceCell(find("tam type"), choices=["radius", "zipcodes"])
        )
        if tam_type == "radius":
            result = self.get_estimated_population_radius()
        else:
            result = self.get_estimated_population_zip()
        result["population"] = self.schema(IntCell(find("est. population")))
        return result

    def get_rent_to_income_category(self, category):
        _, _, row = find(matchp(exact=category))(self.workbook)
        return self.schema(schema=self.RTI_SCHEMA(category), sheet="Output", row=row)

    def get_rent_to_income_categories(self):
        return [
            self.get_rent_to_income_category(category)
            for category in self.RENT_TO_INCOME_CATEGORIES
        ]

    def get_rent_to_income_incomes(self):
        _, _, row = find("rent | incomes")(self.workbook)
        cols = cols_until_empty(self.workbook, "B", test_sheet="Output", test_row=row)
        return self.schema_list(
            CurrencyCell(loc(sheet="Output", row=row)), locations=cols
        )

    def get_rent_to_income_rental_rates(self):
        _, _, row = find("rent | incomes")(self.workbook)
        rows = rows_until_empty(self.workbook, next_row(row), test_location="Output!A")
        return self.schema_list(CurrencyCell(loc("Output!A")), locations=rows)

    def get_rent_to_income_data(self, income_count, rental_rate_count):
        _, _, row = find("rent | incomes")(self.workbook)
        locations = location_range_rect(
            start_col="B",
            end_col=advance_col(income_count - 1)("B"),
            start_row=next_row(row),
            end_row=advance_row(rental_rate_count)(row),  # +1-1=0
            sheet="Output",
            row_major=False,
        )
        return self.schema_rect(FloatCell(), locations=locations)

    def get_rent_to_income(self):
        categories = self.get_rent_to_income_categories()
        incomes = self.get_rent_to_income_incomes()
        rental_rates = self.get_rent_to_income_rental_rates()
        data = self.get_rent_to_income_data(
            income_count=len(incomes), rental_rate_count=len(rental_rates)
        )
        return {
            "categories": categories,
            "incomes": incomes,
            "rental_rates": rental_rates,
            "data": data,
        }

    def update_segment_details(self, segment):
        _, _, row = find(f"age segment: {segment['age_group']}")(self.workbook)
        cols = list(
            cols_until(
                self.workbook,
                matchp(exact="All"),
                "B",
                test_sheet="Output",
                test_row=row,
            )
        )

        def _find(predicate):
            return find_row("Output!A", predicate, start_row=row)

        schema = {
            "income": CurrencyCell(_find("age segment")),
            "group_population": IntCell(_find("population")),
            "home_owners": {
                "total": IntCell(_find("home owners")),
                "family": IntCell(_find("family ho")),
                "nonfamily": IntCell(_find("non-family ho")),
            },
            "renters": {
                "total": IntCell(_find("renters")),
                "family": IntCell(_find("family r")),
                "nonfamily": IntCell(_find("non-family r")),
            },
            "market_size": IntCell(_find("est. market")),
            "active_populations": ["renters.nonfamily", "renters.family"],
        }

        segment["income_groups"] = self.schema_list(
            schema, locations=cols, sheet="Output"
        )
        segment["segment_population"] = self.schema(
            IntCell(loc(sheet="Output", row=next_row(row), col=next_col(cols[-1])))
        )

    def get_segments(self):
        _, _, row = find("target segment")(self.workbook)
        rows = rows_until_empty(self.workbook, next_row(row), test_location="Output!A")
        # Grab the overviews for each segment
        segments = self.schema_list(self.SEGMENT_OVERVIEW_SCHEMA, locations=rows)
        for segment in segments:
            self.update_segment_details(segment)
        return segments

    def get_future_year(self):
        return self.schema(IntCell(find("future year")))

    def get_total(self):
        return self.schema(self.TOTAL_SCHEMA)

    def get_average(self):
        return self.schema(self.AVERAGE_SCHEMA)

    def clean(self, ctx):
        super().clean(ctx)

        self.cleaned_data["location"] = self.get_location()
        self.cleaned_data["estimated_population"] = self.get_estimated_population()
        self.cleaned_data["rent_to_income"] = self.get_rent_to_income()
        self.cleaned_data["segments"] = self.get_segments()
        self.cleaned_data["future_year"] = self.get_future_year()
        self.cleaned_data["total"] = self.get_total()
        self.cleaned_data["average"] = self.get_average()

