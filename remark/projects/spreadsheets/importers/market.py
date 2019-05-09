from remark.lib.match import matchp
from remark.lib.spreadsheets import (
    advance_col,
    advance_row,
    ChoiceCell,
    cols_until,
    cols_until_empty,
    CurrencyCell,
    find_row,
    FloatCell,
    IntCell,
    loc,
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


def find_output(predicate, target="B"):
    """Return a locator that scans the META!A column for header values and returns target column."""
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
        "age_group": StrCell(loc("A")),
        "market_size": IntCell(loc("B")),
        "usv": IntCell(loc("C")),
        "growth": FloatCell(loc("D")),
        "future_size": IntCell(loc("E")),
    }

    # Who loves functional programming? I do I do!
    # TODO CONSIDER these could probably live on the base importer but take a locator...
    # and simplify things? -Dave
    def _get(self, predicate, target, schema_cell, **kwargs):
        """Return an arbitrary cell based on search in the output header column"""
        return self.schema_value(schema_cell(find_output(predicate, target), **kwargs))

    def get_int(self, predicate, target="B"):
        """Return an int based on search in the output header column"""
        return self._get(predicate, target, IntCell)

    def get_str(self, predicate, target="B"):
        """Return a str based on search in the output header column"""
        return self._get(predicate, target, StrCell)

    def get_choice(self, predicate, target="B", choices=[]):
        """Return a choice str based on search in the output header column"""
        return self._get(predicate, target, ChoiceCell, choices=choices)

    def get_float(self, predicate, target="B"):
        """Return a float based on search in the output header column"""
        return self._get(predicate, target, FloatCell)

    def get_currency(self, predicate, target="B"):
        """Return a currency based on search in the output header column"""
        return self._get(predicate, target, CurrencyCell)

    def get_location(self):
        return self.get_str("city, state")

    def get_estimated_population_radius(self):
        return {
            "center": {
                "type": "Point",
                "coordinates": [
                    self.get_float("coordinates", "B"),
                    self.get_float("coordinates", "C"),
                ],
            },
            "radius": self.get_float("tam type", "C"),
            "units": self.get_choice("tam type", "D", choices=["mi", "km"]),
        }

    def get_estimated_population_zip(self):
        _, _, row = find_output("tam type")(self.workbook)
        cols = cols_until_empty(self.workbook, "C", sheet="Output", row=row)
        zip_codes = self.col_table(
            schema={
                "zip": StrCell(loc(sheet="Output", row=row)),
                "outline": None,
                "properties": None,
            },
            cols=cols,
        )
        return {"zip_codes": zip_codes}

    def get_estimated_population(self):
        tam_type = self.get_choice("tam type", choices=["radius", "zipcodes"])
        if tam_type == "radius":
            result = self.get_estimated_population_radius()
        else:
            result = self.get_estimated_population_zip()
        result["population"] = self.get_int("est. population")
        return result

    def get_rent_to_income_category(self, category):
        _, _, row = find_output(matchp(exact=category))(self.workbook)
        return self.row(
            schema={
                "name": category,
                "low": FloatCell(loc("B")),
                "high": FloatCell(loc("C")),
            },
            sheet="Output",
            row=row,
        )

    def get_rent_to_income_categories(self):
        return [
            self.get_rent_to_income_category(category)
            for category in self.RENT_TO_INCOME_CATEGORIES
        ]

    def get_rent_to_income_incomes(self):
        _, _, row = find_output("rent | incomes")(self.workbook)
        cols = cols_until_empty(self.workbook, "B", sheet="Output", row=row)
        return self.col_array(CurrencyCell(loc(sheet="Output", row=row)), cols=cols)

    def get_rent_to_income_rental_rates(self):
        _, _, row = find_output("rent | incomes")(self.workbook)
        rows = rows_until_empty(self.workbook, next_row(row), location="Output!A")
        return self.row_array(CurrencyCell(loc("Output!A")), rows=rows)

    def get_rent_to_income_data(self, income_count, rental_rate_count):
        _, _, row = find_output("rent | incomes")(self.workbook)
        return self.table_array(
            FloatCell(loc()),
            start_col="B",
            end_col=advance_col(income_count - 1)("B"),
            start_row=next_row(row),
            end_row=advance_row(rental_rate_count)(row),  # +1-1=0
            sheet="Output",
            row_major=False,
        )

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
        _, _, row = find_output(f"age segment: {segment['age_group']}")(self.workbook)
        cols = list(
            cols_until(self.workbook, matchp(exact="All"), "B", sheet="Output", row=row)
        )

        def _find(predicate):
            return find_row("Output!A", predicate, start_row=row)

        schema = {
            "income": CurrencyCell(_find("age segment")),
            "group_population": IntCell(_find("population")),
            "home_owners.total": IntCell(_find("home owners")),
            "home_owners.family": IntCell(_find("family ho")),
            "home_owners.nonfamily": IntCell(_find("non-family ho")),
            "renters.total": IntCell(_find("renters")),
            "renters.family": IntCell(_find("family r")),
            "renters.nonfamily": IntCell(_find("non-family r")),
            "market_size": IntCell(_find("est. market")),
            "active_populations": ["renters.nonfamily", "renters.family"],
        }

        segment["income_groups"] = self.col_table(schema, cols=cols, sheet="Output")
        segment["segment_population"] = self.schema_value(
            IntCell(loc(sheet="Output", row=next_row(row), col=next_col(cols[-1])))
        )

    def get_segments(self):
        _, _, row = find_output("target segment")(self.workbook)
        rows = rows_until_empty(self.workbook, next_row(row), location="Output!A")
        # Grab the overviews for each segment
        segments = self.row_table(
            self.SEGMENT_OVERVIEW_SCHEMA, rows=rows, sheet="Output"
        )
        for segment in segments:
            self.update_segment_details(segment)
        return segments

    def get_future_year(self):
        return self.get_int("future year")

    def get_total(self):
        return {
            "segment_population": self.get_int("est. population"),
            "market_size": self.get_int("total market size"),
            "usv": self.get_int("total usv"),
            "future_size": self.get_int("future population size"),
        }

    def get_average(self):
        return {
            "age": self.get_int("total average age"),
            "growth": self.get_float("total average growth"),
        }

    def clean(self):
        super().clean()

        self.cleaned_data["location"] = self.get_location()
        self.cleaned_data["estimated_population"] = self.get_estimated_population()
        self.cleaned_data["rent_to_income"] = self.get_rent_to_income()
        self.cleaned_data["segments"] = self.get_segments()
        self.cleaned_data["future_year"] = self.get_future_year()
        self.cleaned_data["total"] = self.get_total()
        self.cleaned_data["average"] = self.get_average()
