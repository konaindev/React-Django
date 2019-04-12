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

def validateJson(report, schema):
    schema_location = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), schema
    )

    with open(schema_location, "rt") as schema_file:
        schema = json.load(schema_file)

    jsonschema.validate(instance=report, schema=schema)

class ExcelImporter:
    def __init__(self, file_name):
        self.excel = openpyxl.load_workbook(file_name, data_only=True)

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

    def get_field_by_label(self, match, sheet="OUTPUT"):
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


class ModelingImporter():
    def __init__(self, filenames, name):
        self.filenames = filenames
        self.name = name

    def property(self):
        return {"property_name": self.name}

    def build_option(self, importer):
        option = "OUTPUT"
        return {
            "name": importer.get_field_by_label("Model Name", sheet=option),
            "dates": {
                "start": convert_date_to_string(
                    importer.get_field_by_label("Start Date", sheet=option)
                ),
                "end": convert_date_to_string(
                    importer.get_field_by_label("End Date", sheet=option)
                ),
            },
            "property": {
                "average_monthly_rent": convert_to_currency_string(
                    importer.get_field_by_label("Average Rent")
                ),
                "lowest_monthly_rent": convert_to_currency_string(
                    importer.get_field_by_label("Average Rent")
                    #importer.get_field_by_label("Lowest Rent")
                ),
                "cost_per_exe_vs_rent": importer.get_field_by_label(
                    "Cost per Exe vs Rent", sheet=option
                ),
                "total_units": int(
                    importer.get_field_by_label("Occupiable Units", sheet=option)
                ),
                "leasing": {
                    "change": int(
                        importer.get_field_by_label("Leasing Change", sheet=option)
                    ),
                    "cds": int(
                        importer.get_field_by_label("Cancels & Denials", sheet=option)
                    ),
                    "cd_rate": importer.get_field_by_label("CD Rate", sheet=option),
                    "renewal_notices": importer.get_field_by_label(
                        "Renewal Notices", sheet=option
                    ),
                    "renewals": importer.get_field_by_label("Renewals", sheet=option),
                    "renewal_rate": importer.get_field_by_label(
                        "Renewal Rate", sheet=option
                    ),
                    "resident_decisions": importer.get_field_by_label(
                        "Resident Decisions", sheet=option
                    ),
                    "vacation_notices": importer.get_field_by_label(
                        "Vacation Notices", sheet=option
                    ),
                    "rate": importer.get_field_by_label("Leasing Rate", sheet=option),
                    "units": int(importer.get_field_by_label("Lease Units", sheet=option)),
                },
                "occupancy": {
                    "move_ins": int(importer.get_field_by_label("Move Ins", sheet=option)),
                    "move_outs": int(
                        importer.get_field_by_label("Move Outs", sheet=option)
                    ),
                    "rate": importer.get_field_by_label("Occupancy Rate", sheet=option),
                    "units": int(
                        importer.get_field_by_label("Occupancy Units", sheet=option)
                    ),
                    "occupiable": int(
                        importer.get_field_by_label("Occupiable Units", sheet=option)
                    )
                },
            },
            "funnel": {
                "volumes": {
                    "usv": importer.get_field_by_label("USV Volume", sheet=option),
                    "inq": importer.get_field_by_label("INQ Volume", sheet=option),
                    "tou": importer.get_field_by_label("TOU Volume", sheet=option),
                    "app": importer.get_field_by_label("APP Volume", sheet=option),
                    "exe": importer.get_field_by_label("EXE Volume", sheet=option),
                },
                "costs": {
                    "usv": convert_to_currency_string(
                        importer.get_field_by_label("USV Cost", sheet=option)
                    ),
                    "inq": convert_to_currency_string(
                        importer.get_field_by_label("INQ Cost", sheet=option)
                    ),
                    "tou": convert_to_currency_string(
                        importer.get_field_by_label("TOU Cost", sheet=option)
                    ),
                    "app": convert_to_currency_string(
                        importer.get_field_by_label("APP Cost", sheet=option)
                    ),
                    "exe": convert_to_currency_string(
                        importer.get_field_by_label("EXE Cost", sheet=option)
                    ),
                },
                "conversions": {
                    "usv_inq": importer.get_field_by_label("USV Conversions", sheet=option),
                    "inq_tou": importer.get_field_by_label("INQ Conversions", sheet=option),
                    "tou_app": importer.get_field_by_label("TOU Conversions", sheet=option),
                    "app_exe": importer.get_field_by_label("APP Conversions", sheet=option),
                    "usv_exe": importer.get_field_by_label(
                        "USV_EXE Conversions", sheet=option
                    ),
                },
            },
            "four_week_funnel_averages": {
                "usv": importer.get_field_by_label("USV 4 Week", sheet=option),
                "inq": importer.get_field_by_label("INQ 4 Week", sheet=option),
                "tou": importer.get_field_by_label("TOU 4 Week", sheet=option),
                "app": importer.get_field_by_label("APP 4 Week", sheet=option),
                "exe": importer.get_field_by_label("EXE 4 Week", sheet=option),
            },
            "investment": {
                "acquisition": {
                    "expenses": {
                        "demand_creation": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Acquistion Demand Creation", sheet=option
                            )
                        ),
                        "leasing_enablement": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Acquisition Leasing Enablement", sheet=option
                            )
                        ),
                        "market_intelligence": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Acquisition Market Intelligence", sheet=option
                            )
                        ),
                        "reputation_building": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Acquisition Reputation Building", sheet=option
                            )
                        ),
                    },
                    "total": convert_to_currency_string(
                        importer.get_field_by_label("Acquisition Total", sheet=option)
                    ),
                    "romi": int(
                        importer.get_field_by_label("Acquisition ROMI", sheet=option)
                    ),
                    "estimated_revenue_gain": convert_to_currency_string(
                        importer.get_field_by_label(
                            "Acquisition Revenue Gain", sheet=option
                        )
                    ),
                },
                "retention": {
                    "expenses": {
                        "demand_creation": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Retention Demand Creation", sheet=option
                            )
                        ),
                        "leasing_enablement": convert_to_currency_string(
                            int(
                                importer.get_field_by_label(
                                    "Retention Leasing Enablement", sheet=option
                                )
                            )
                        ),
                        "market_intelligence": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Retention Market Intelligence", sheet=option
                            )
                        ),
                        "reputation_building": convert_to_currency_string(
                            importer.get_field_by_label(
                                "Retention Reputation Building", sheet=option
                            )
                        ),
                    },
                    "total": convert_to_currency_string(
                        importer.get_field_by_label("Retention Total", sheet=option)
                    ),
                    "romi": int(
                        importer.get_field_by_label("Retention ROMI", sheet=option)
                    ),
                    "estimated_revenue_gain": convert_to_currency_string(
                        importer.get_field_by_label("Retention Revenue Gain", sheet=option)
                    ),
                },
                "total": {
                    "total": convert_to_currency_string(
                        importer.get_field_by_label("Total Total", sheet=option)
                    ),
                    "romi": int(importer.get_field_by_label("Total ROMI", sheet=option)),
                    "estimated_revenue_gain": convert_to_currency_string(
                        importer.get_field_by_label("Total Revenue Gain", sheet=option)
                    ),
                },
            },
        }

    def get_report(self):
        result = self.property()
        result["options"] = []
        for filename in self.filenames:
            importer = ExcelImporter(filename)
            print("Processing option %s" % filename)
            result["options"].append(self.build_option(importer))

        validateJson(result, "../../data/schema/jsonschema/ModelingOptions.schema.json")
        return result


@click.command()
@click.option(
    "-f",
    "--filename",
    "filenames",
    type=click.Path(exists=True),
    multiple=True,
    required=True,
    help="A list of models"
)
@click.option(
    "-n",
    "--name",
    type=str,
    required=True,
    help="Property Name"
)
def import_excel(filenames, name):
    importer = ModelingImporter(filenames, name)
    output = importer.get_report()
    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    import_excel()
