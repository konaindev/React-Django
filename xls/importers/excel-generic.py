"""
This script loads the TAM Excel spreadsheet,
pulls the relevant data from the Output tab,
then produces the final JSON
"""
import datetime
import json
import jsonschema
import os

import click
import openpyxl


MAX_ROW = 500


ALPHA = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
]


def convert_to_currency_string(num):
    if type(num) is str:
        return num
    if type(num) is float:
        return "{0:0=2f}".format(num)
    return "{0:0=2d}".format(num)


def convert_array_to_currency_strings(ary):
    result = []
    for x in ary:
        result.append(convert_to_currency_string(x))
    return result


def convert_date_to_string(d):
    if isinstance(d, datetime.datetime):
        return d.date().isoformat()
    if isinstance(d, datetime.date):
        return d.isoformat()
    assert False


class ExcelImporter:
    def __init__(self, file_name, schema_file):
        self.excel = openpyxl.load_workbook(file_name, data_only=True)
        self.schema = schema_file

    def validate(self, report):
        if self.schema is None:
            raise Exception("Schema is not set.")

        schema_location = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), self.schema
        )

        with open(schema_location, "rt") as schema_file:
            schema = json.load(schema_file)

        jsonschema.validate(instance=report, schema=schema)

    def eval(self, sheet, col, row):
        return self.excel[sheet][f"{col}{row}"].value

    def lookup_row(self, sheet, col, match):
        for x in range(1, MAX_ROW):
            result = self.eval(sheet, col, x)
            if result == match:
                return x
        raise Exception("Could not find row: %s!%s matching %s" % (sheet, col, match))

    def find_row_eval(self, sheet, return_col, search_col, match):
        row = self.lookup_row(sheet, search_col, match)
        return self.eval(sheet, return_col, row)

    def get_field_by_label(self, match, sheet="Output"):
        return self.find_row_eval(sheet, "B", "A", match)

    def row_array(self, sheet, find_col, start_col, match):
        row = self.lookup_row(sheet, find_col, match)
        result = []
        start = False
        for x in ALPHA:
            if x == start_col:
                start = True

            if not start:
                continue

            item = self.eval(sheet, x, row)

            if item == "" or item is None:
                return result

            result.append(item)
        raise Exception("row_array::Should not reach this point. Check ALPHA length.")

    def col_array(self, sheet, col, match):
        row = self.lookup_row(sheet, col, match)
        result = []
        for x in range(row + 1, MAX_ROW):
            item = self.eval(sheet, col, x)
            if item is None or item == "":
                return result
            result.append(item)
        raise Exception("col_array::should not reach this point")

    def table_array(self, sheet, col, match):
        row = self.lookup_row(sheet, "A", match)
        result = []
        i = ALPHA.index(col)
        myAlpha = ALPHA[i:]
        for y in myAlpha:
            subresult = []
            for x in range(row + 1, MAX_ROW):
                item = self.eval(sheet, y, x)
                if item is None or item == "":
                    break
                subresult.append(item)
            if len(subresult) == 0:
                break
            result.append(subresult)
        return result


class TAMImporter(ExcelImporter):
    def __init__(self, file_name):
        super().__init__(
            file_name, "../../data/schema/jsonschema/MarketAnalysis.schema.json"
        )

    def future_year(self):
        return self.find_row_eval("Output", "B", "A", "Future Year")

    def location(self):
        return {
            "location": self.find_row_eval("Output", "B", "A", "City, State"),
            "estimated_population": {
                "center": {
                    "type": "Point",
                    "coordinates": [
                        self.find_row_eval("Output", "B", "A", "Coordinates"),
                        self.find_row_eval("Output", "C", "A", "Coordinates"),
                    ],
                },
                "population": self.find_row_eval("Output", "B", "A", "Est. Population"),
                "radius": self.find_row_eval("Output", "B", "A", "Radius"),
                "units": self.find_row_eval("Output", "B", "A", "Radius Units"),
            },
        }

    def rent_to_income(self):
        return {
            "categories": [
                {
                    "name": "Low",
                    "low": self.find_row_eval("Output", "B", "A", "Low"),
                    "high": self.find_row_eval("Output", "C", "A", "Low"),
                },
                {
                    "name": "Moderately Low",
                    "low": self.find_row_eval("Output", "B", "A", "Moderately Low"),
                    "high": self.find_row_eval("Output", "C", "A", "Moderately Low"),
                },
                {
                    "name": "Target",
                    "low": self.find_row_eval("Output", "B", "A", "Target"),
                    "high": self.find_row_eval("Output", "C", "A", "Target"),
                },
                {
                    "name": "Moderately High",
                    "low": self.find_row_eval("Output", "B", "A", "Moderately High"),
                    "high": self.find_row_eval("Output", "C", "A", "Moderately High"),
                },
                {
                    "name": "High",
                    "low": self.find_row_eval("Output", "B", "A", "High"),
                    "high": self.find_row_eval("Output", "C", "A", "High"),
                },
            ],
            "incomes": convert_array_to_currency_strings(
                self.row_array("Output", "A", "B", "Rent | Incomes")
            ),
            "rental_rates": convert_array_to_currency_strings(
                self.col_array("Output", "A", "Rent | Incomes")
            ),
            "data": self.table_array("Output", "B", "Rent | Incomes"),
        }

    def segment(self, label):
        top_row = self.lookup_row("Output", "A", "Age Segment: %s" % label)
        result = {
            "age_group": label,
            "market_size": self.find_row_eval("Output", "B", "A", label),
            "segment_population": self.eval("Output", "E", top_row + 1),
            "usv": self.find_row_eval("Output", "C", "A", label),
            "growth": self.find_row_eval("Output", "D", "A", label),
            "future_size": self.find_row_eval("Output", "E", "A", label),
        }

        i = ALPHA.index("B")
        myAlpha = ALPHA[i:]
        groups = []
        for col in myAlpha:
            income_group = convert_to_currency_string(self.eval("Output", col, top_row))
            if income_group == "All":
                break
            groups.append(
                {
                    "income": income_group,
                    "group_population": self.eval("Output", col, top_row + 1),
                    "home_owners": {
                        "total": self.eval("Output", col, top_row + 2),
                        "family": self.eval("Output", col, top_row + 4),
                        "nonfamily": self.eval("Output", col, top_row + 5),
                    },
                    "renters": {
                        "total": self.eval("Output", col, top_row + 3),
                        "family": self.eval("Output", col, top_row + 6),
                        "nonfamily": self.eval("Output", col, top_row + 7),
                    },
                    "active_populations": ["renters.nonfamily", "renters.family"],
                    "market_size": self.eval("Output", col, top_row + 8),
                }
            )
        result["income_groups"] = groups
        return result

    def segments(self):
        target_segments = self.col_array("Output", "A", "Target Segment")
        result = []
        for seg in target_segments:
            item = self.segment(seg)
            result.append(item)
        return result

    def total(self):
        return {
            "segment_population": self.find_row_eval(
                "Output", "B", "A", "Est. Population"
            ),
            "market_size": self.find_row_eval("Output", "B", "A", "Total Market Size"),
            "usv": self.find_row_eval("Output", "B", "A", "Total USV"),
            "future_size": self.find_row_eval(
                "Output", "B", "A", "Future Population Size"
            ),
        }

    def average(self):
        return {
            "age": self.find_row_eval("Output", "B", "A", "Total Average Age"),
            "growth": self.find_row_eval("Output", "B", "A", "Total Average Growth"),
        }

    def get_report(self):
        result = self.location()
        result["rent_to_income"] = self.rent_to_income()
        result["segments"] = self.segments()
        result["future_year"] = self.future_year()
        result["total"] = self.total()
        result["average"] = self.average()

        self.validate(result)

        return result


class ModelingImporter(ExcelImporter):
    def __init__(self, file_name):
        super().__init__(
            file_name, "../../data/schema/jsonschema/ModelingOptions.schema.json"
        )

    def property(self):
        return {"property_name": self.get_field_by_label("Property Name")}

    def build_option(self, option):
        return {
            "name": self.get_field_by_label("Name", sheet=option),
            "dates": {
                "start": convert_date_to_string(
                    self.get_field_by_label("Start Date", sheet=option)
                ),
                "end": convert_date_to_string(
                    self.get_field_by_label("End Date", sheet=option)
                ),
            },
            "property": {
                "monthly_average_rent": convert_to_currency_string(
                    self.get_field_by_label("Average Rent")
                ),
                "lowest_monthly_rent": convert_to_currency_string(
                    self.get_field_by_label("Lowest Rent")
                ),
                "cost_per_exe_vs_rent": self.get_field_by_label(
                    "Cost per Exe vs Rent", sheet=option
                ),
                "leasing": {
                    "change": int(
                        self.get_field_by_label("Leasing Change", sheet=option)
                    ),
                    "cds": int(
                        self.get_field_by_label("Cancels & Denials", sheet=option)
                    ),
                    "cd_rate": self.get_field_by_label("CD Rate", sheet=option),
                    "renewal_notices": self.get_field_by_label(
                        "Renewal Notices", sheet=option
                    ),
                    "renewals": self.get_field_by_label("Renewals", sheet=option),
                    "renewal_rate": self.get_field_by_label(
                        "Renewal Rate", sheet=option
                    ),
                    "resident_decisions": self.get_field_by_label(
                        "Resident Decisions", sheet=option
                    ),
                    "vacation_notices": self.get_field_by_label(
                        "Vacation Notices", sheet=option
                    ),
                    "rate": self.get_field_by_label("Leasing Rate", sheet=option),
                    "units": int(self.get_field_by_label("Lease Units", sheet=option)),
                },
                "occupancy": {
                    "move_ins": int(self.get_field_by_label("Move Ins", sheet=option)),
                    "move_outs": int(
                        self.get_field_by_label("Move Outs", sheet=option)
                    ),
                    "rate": self.get_field_by_label("Occupancy Rate", sheet=option),
                    "units": int(
                        self.get_field_by_label("Occupancy Units", sheet=option)
                    ),
                    "occupiable": int(
                        self.get_field_by_label("Occupiable Units", sheet=option)
                    ),
                },
            },
            "funnel": {
                "volumes": {
                    "usv": self.get_field_by_label("USV Volume", sheet=option),
                    "inq": self.get_field_by_label("INQ Volume", sheet=option),
                    "tou": self.get_field_by_label("TOU Volume", sheet=option),
                    "app": self.get_field_by_label("APP Volume", sheet=option),
                    "exe": self.get_field_by_label("EXE Volume", sheet=option),
                },
                "costs": {
                    "usv": convert_to_currency_string(
                        self.get_field_by_label("USV Cost", sheet=option)
                    ),
                    "inq": convert_to_currency_string(
                        self.get_field_by_label("INQ Cost", sheet=option)
                    ),
                    "tou": convert_to_currency_string(
                        self.get_field_by_label("TOU Cost", sheet=option)
                    ),
                    "app": convert_to_currency_string(
                        self.get_field_by_label("APP Cost", sheet=option)
                    ),
                    "exe": convert_to_currency_string(
                        self.get_field_by_label("EXE Cost", sheet=option)
                    ),
                },
                "conversions": {
                    "usv_inq": self.get_field_by_label("USV Conversions", sheet=option),
                    "inq_tou": self.get_field_by_label("INQ Conversions", sheet=option),
                    "tou_app": self.get_field_by_label("TOU Conversions", sheet=option),
                    "app_exe": self.get_field_by_label("APP Conversions", sheet=option),
                    "usv_exe": self.get_field_by_label(
                        "USV_EXE Conversions", sheet=option
                    ),
                },
            },
            "four_week_funnel_averages": {
                "usv": self.get_field_by_label("USV 4 Week", sheet=option),
                "inq": self.get_field_by_label("INQ 4 Week", sheet=option),
                "tou": self.get_field_by_label("TOU 4 Week", sheet=option),
                "app": self.get_field_by_label("APP 4 Week", sheet=option),
                "exe": self.get_field_by_label("EXE 4 Week", sheet=option),
            },
            "investment": {
                "acquisition": {
                    "expenses": {
                        "demand_creation": convert_to_currency_string(
                            self.get_field_by_label(
                                "Acquistion Demand Creation", sheet=option
                            )
                        ),
                        "leasing_enablement": convert_to_currency_string(
                            self.get_field_by_label(
                                "Acquisition Leasing Enablement", sheet=option
                            )
                        ),
                        "market_intelligence": convert_to_currency_string(
                            self.get_field_by_label(
                                "Acquisition Market Intelligence", sheet=option
                            )
                        ),
                        "reputation_building": convert_to_currency_string(
                            self.get_field_by_label(
                                "Acquisition Reputation Building", sheet=option
                            )
                        ),
                    },
                    "total": convert_to_currency_string(
                        self.get_field_by_label("Acquisition Total", sheet=option)
                    ),
                    "romi": int(
                        self.get_field_by_label("Acquisition ROMI", sheet=option)
                    ),
                    "estimated_revenue_gain": convert_to_currency_string(
                        self.get_field_by_label(
                            "Acquisition Revenue Gain", sheet=option
                        )
                    ),
                },
                "retention": {
                    "expenses": {
                        "demand_creation": convert_to_currency_string(
                            self.get_field_by_label(
                                "Retention Demand Creation", sheet=option
                            )
                        ),
                        "leasing_enablement": convert_to_currency_string(
                            int(
                                self.get_field_by_label(
                                    "Retention Leasing Enablement", sheet=option
                                )
                            )
                        ),
                        "market_intelligence": convert_to_currency_string(
                            self.get_field_by_label(
                                "Retention Market Intelligence", sheet=option
                            )
                        ),
                        "reputation_building": convert_to_currency_string(
                            self.get_field_by_label(
                                "Retention Reputation Building", sheet=option
                            )
                        ),
                    },
                    "total": convert_to_currency_string(
                        self.get_field_by_label("Retention Total", sheet=option)
                    ),
                    "romi": int(
                        self.get_field_by_label("Retention ROMI", sheet=option)
                    ),
                    "estimated_revenue_gain": convert_to_currency_string(
                        self.get_field_by_label("Retention Revenue Gain", sheet=option)
                    ),
                },
                "total": {
                    "total": convert_to_currency_string(
                        self.get_field_by_label("Total Total", sheet=option)
                    ),
                    "romi": int(self.get_field_by_label("Total ROMI", sheet=option)),
                    "estimated_revenue_gain": convert_to_currency_string(
                        self.get_field_by_label("Total Revenue Gain", sheet=option)
                    ),
                },
            },
        }

    def get_report(self):
        result = self.property()
        result["options"] = []
        options = self.row_array("Output", "A", "B", "Models")
        for option in options:
            print("Processing option %s" % option)
            result["options"].append(self.build_option(option))

        self.validate(result)

        return result


@click.command()
@click.option(
    "-k",
    "--kind",
    type=click.Choice(["tam", "modeling"]),
    required=True,
    help="The kind of spreadsheet to import.",
)
@click.argument("file_name", type=click.Path(exists=True))
def import_excel(kind, file_name):
    if kind == "tam":
        importer = TAMImporter(file_name)
    elif kind == "modeling":
        importer = ModelingImporter(file_name)
    output = importer.get_report()
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    import_excel()
