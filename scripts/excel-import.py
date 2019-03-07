"""
This script loads the TAM Excel spreadsheet,
pulls the relevant data from the Output tab,
then produces the final JSON
"""
import logging
import os
import sys
import json
import jsonschema
from django.core.serializers.json import DjangoJSONEncoder

from pycel import ExcelCompiler
from pycel.excelutil import date_from_int

def pycel_logging_to_console(enable=True):
    if enable:
        logger = logging.getLogger('pycel')
        logger.setLevel('INFO')

        console = logging.StreamHandler(sys.stdout)
        console.setLevel(logging.INFO)
        logger.addHandler(console)




MAX_ROW = 500


ALPHA = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']

def convertToCurrencyString(num):
    if type(num) is str:
        return num
    if type(num) is float:
        return "{0:0=2f}".format(num)
    return "{0:0=2d}".format(num)

def convertArrayToCurrencyStrings(ary):
    result = []
    for x in ary:
        result.append(convertToCurrencyString(x))
    return result

def convertDateToString(d):
    # Y M D
    dt = date_from_int(d)
    return "{1}/{2}/{0}".format(dt[0], dt[1], dt[2])

class ExcelImporter():
    def __init__(self, fname, schema_file):
        self.excel = ExcelCompiler(filename=fname)
        self.schema = schema_file

    def validate(self, report):
        if self.schema is None:
            raise Exception("Schema is not set.")

        schema_location = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            self.schema,
        )

        with open(schema_location, "rt") as schema_file:
            schema = json.load(schema_file)

        jsonschema.validate(instance=report, schema=schema)

    def eval(self, sheet, col, row):
        return self.excel.evaluate("%s!%s%d" % (sheet, col, row))

    def lookup_row(self, sheet, col, match):
        for x in range(1, MAX_ROW):
            result = self.eval(sheet, col, x)
            if result == match:
                return x
        raise Exception("Could not find row: %s!%s matching %s" % (sheet, col, match))

    def find_row_eval(self, sheet, returnCol, searchCol, match):
        row = self.lookup_row(sheet, searchCol, match)
        return self.eval(sheet, returnCol, row)

    def get_field_by_label(self, match, sheet='Output'):
        return self.find_row_eval(sheet, 'B', 'A', match)

    def row_array(self, sheet, findCol, startCol, match):
        row = self.lookup_row(sheet, findCol, match)
        result = []
        start = False
        for x in ALPHA:
            if x == startCol:
                start = True

            if not start:
                continue

            item = self.eval(sheet, x, row)

            if item == '' or item is None:
                return result

            result.append(item)
        raise Exception('row_array::Should not reach this point. Check ALPHA length.')

    def col_array(self, sheet, col, match):
        row = self.lookup_row(sheet, col, match)
        result = []
        for x in range(row + 1, MAX_ROW):
            item = self.eval(sheet, col, x)
            if item is None or item == '':
                return result
            result.append(item)
        raise Exception('col_array::should not reach this point')

    def table_array(self, sheet, col, match):
        row = self.lookup_row(sheet, 'A', match)
        result = []
        i = ALPHA.index(col)
        myAlpha = ALPHA[i:]
        for y in myAlpha:
            subresult = []
            for x in range(row + 1, MAX_ROW):
                item = self.eval(sheet, y, x)
                if item is None or item == '':
                    break
                subresult.append(item)
            if len(subresult) == 0:
                break
            result.append(subresult)
        return result

class TAMImporter(ExcelImporter):
    def __init__(self, fname):
        super().__init__(fname, "../data/schema/jsonschema/MarketAnalysis.schema.json")

    def future_year(self):
        return self.find_row_eval('Output', 'B', 'A', 'Future Year')

    def location(self):
        return {
            'location' : self.find_row_eval('Output', 'B', 'A', 'City, State'),
            'estimated_population': {
                'center': {
                  'type': 'Point',
                  'coordinates': [
                        self.find_row_eval('Output', 'B', 'A', 'Coordinates'),
                        self.find_row_eval('Output', 'C', 'A', 'Coordinates')
                    ]
                },
                'population': self.find_row_eval('Output', 'B', 'A', 'Est. Population'),
                'radius': self.find_row_eval('Output', 'B', 'A', 'Radius'),
                'units': self.find_row_eval('Output', 'B', 'A', 'Radius Units')
            }
        }

    def rent_to_income(self):
        return {
            "categories": [
              {
                "name": "Low",
                "low": self.find_row_eval('Output', 'B', 'A', 'Low'),
                "high": self.find_row_eval('Output', 'C', 'A', 'Low')
              },
              {
                "name": "Moderately Low",
                "low": self.find_row_eval('Output', 'B', 'A', 'Moderately Low'),
                "high": self.find_row_eval('Output', 'C', 'A', 'Moderately Low')
              },
              {
                "name": "Target",
                "low": self.find_row_eval('Output', 'B', 'A', 'Target'),
                "high": self.find_row_eval('Output', 'C', 'A', 'Target')
              },
              {
                "name": "Moderately High",
                "low": self.find_row_eval('Output', 'B', 'A', 'Moderately High'),
                "high": self.find_row_eval('Output', 'C', 'A', 'Moderately High')
              },
              {
                "name": "High",
                "low": self.find_row_eval('Output', 'B', 'A', 'High'),
                "high": self.find_row_eval('Output', 'C', 'A', 'High')
              }
            ],
            "incomes": convertArrayToCurrencyStrings(
                self.row_array('Output', 'A', 'B', 'Rent | Incomes')),
            "rental_rates": convertArrayToCurrencyStrings(
                self.col_array('Output', 'A', 'Rent | Incomes')),
            "data": self.table_array('Output', 'B', 'Rent | Incomes')
          }

    def segment(self, label):
        top_row = self.lookup_row('Output', 'A', 'Age Segment: %s' % label)
        result = {
            "age_group": label,
            "market_size": self.find_row_eval('Output', 'B', 'A', label),
            "segment_population": self.eval('Output', 'E', top_row + 1),
            "usv": self.find_row_eval('Output', 'C', 'A', label),
            "growth": self.find_row_eval('Output', 'D', 'A', label),
            "future_size": self.find_row_eval('Output', 'E', 'A', label),
        }

        i = ALPHA.index('B')
        myAlpha = ALPHA[i:]
        groups = []
        for col in myAlpha:
            income_group = convertToCurrencyString(
                self.eval('Output', col, top_row))
            if income_group == 'All':
                break
            groups.append({
              "income": income_group,
              "group_population": self.eval('Output', col, top_row + 1),
              "home_owners": {
                "total": self.eval('Output', col, top_row + 2),
                "family": self.eval('Output', col, top_row + 4),
                "nonfamily": self.eval('Output', col, top_row + 5)
              },
              "renters": {
                "total": self.eval('Output', col, top_row + 3),
                "family": self.eval('Output', col, top_row + 6),
                "nonfamily": self.eval('Output', col, top_row + 7)
              },
              "active_populations": ["renters.nonfamily", "renters.family"],
              "market_size": self.eval('Output', col, top_row + 8)
            })
        result['income_groups'] = groups
        return result

    def segments(self):
        target_segments = self.col_array('Output', 'A', 'Target Segment')
        result = []
        for seg in target_segments:
            item = self.segment(seg)
            result.append(item)
        return result

    def total(self):
        return {
            "segment_population": self.find_row_eval('Output', 'B', 'A', 'Est. Population'),
            "market_size": self.find_row_eval('Output', 'B', 'A', 'Total Market Size'),
            "usv": self.find_row_eval('Output', 'B', 'A', 'Total USV'),
            "future_size": self.find_row_eval('Output', 'B', 'A', 'Future Population Size')
          }

    def average(self):
        return {
            "age": self.find_row_eval('Output', 'B', 'A', 'Total Average Age'),
            "growth": self.find_row_eval('Output', 'B', 'A', 'Total Average Growth')
         }

    def get_report(self):
        result = self.location()
        result['rent_to_income'] = self.rent_to_income()
        result['segments'] = self.segments()
        result['future_year'] = self.future_year()
        result['total'] = self.total()
        result['average'] = self.average()

        self.validate(result)

        return json.dumps(result)


class ModelingImporter(ExcelImporter):
    def __init__(self, fname):
        super().__init__(fname, "../data/schema/jsonschema/ModelingOptions.schema.json")

    def property(self):
        return {
            "property_name": self.get_field_by_label('Property Name')
        }

    def build_option(self, option):
        return {
          "name": self.get_field_by_label('Name', sheet=option),
          "dates": {
            "start": convertDateToString(
                self.get_field_by_label('Start Date', sheet=option)),
            "end": convertDateToString(
                self.get_field_by_label('End Date', sheet=option))
          },
          "property": {
            "monthly_average_rent": convertToCurrencyString(
                self.get_field_by_label('Average Rent')),
            "lowest_monthly_rent": convertToCurrencyString(
                self.get_field_by_label('Lowest Rent')),
            "cost_per_exe_vs_rent": self.get_field_by_label('Cost per Exe vs Rent', sheet=option),
            "leasing": {
              "change": self.get_field_by_label('Leasing Change', sheet=option),
              "cds": self.get_field_by_label('Cancels & Denials', sheet=option),
              "cd_rate": self.get_field_by_label('CD Rate', sheet=option),
              "renewal_notices": self.get_field_by_label('Renewal Notices', sheet=option),
              "renewals": self.get_field_by_label('Renewals', sheet=option),
              "renewal_rate": self.get_field_by_label('Renewal Rate', sheet=option),
              "resident_decisions": self.get_field_by_label('Resident Decisions', sheet=option),
              "vacation_notices": self.get_field_by_label('Vacation Notices', sheet=option),
              "rate": self.get_field_by_label('Leasing Rate', sheet=option),
              "units": self.get_field_by_label('Lease Units', sheet=option)
            },
            "occupancy": {
              "move_ins": self.get_field_by_label('Move Ins', sheet=option),
              "move_outs": self.get_field_by_label('Move Outs', sheet=option),
              "rate": self.get_field_by_label('Occupancy Rate', sheet=option),
              "units": self.get_field_by_label('Occupancy Units', sheet=option),
              "occupiable": self.get_field_by_label('Occupiable Units', sheet=option)
            }
          },
          "funnel": {
            "volumes": {
              "usv": self.get_field_by_label('USV Volume', sheet=option),
              "inq": self.get_field_by_label('INQ Volume', sheet=option),
              "tou": self.get_field_by_label('TOU Volume', sheet=option),
              "app": self.get_field_by_label('APP Volume', sheet=option),
              "exe": self.get_field_by_label('EXE Volume', sheet=option)
            },
            "costs": {
              "usv": convertToCurrencyString(
                self.get_field_by_label('USV Cost', sheet=option)),
              "inq": convertToCurrencyString(
                self.get_field_by_label('INQ Cost', sheet=option)),
              "tou": convertToCurrencyString(
                self.get_field_by_label('TOU Cost', sheet=option)),
              "app": convertToCurrencyString(
                self.get_field_by_label('APP Cost', sheet=option)),
              "exe": convertToCurrencyString(
                self.get_field_by_label('EXE Cost', sheet=option))
            },
            "conversions": {
              "usv_inq": self.get_field_by_label('USV Conversions', sheet=option),
              "inq_tou": self.get_field_by_label('INQ Conversions', sheet=option),
              "tou_app": self.get_field_by_label('TOU Conversions', sheet=option),
              "app_exe": self.get_field_by_label('APP Conversions', sheet=option),
              "usv_exe": self.get_field_by_label('USV_EXE Conversions', sheet=option)
            }
          },
          "four_week_funnel_averages": {
            "usv": self.get_field_by_label('USV 4 Week', sheet=option),
            "inq": self.get_field_by_label('INQ 4 Week', sheet=option),
            "tou": self.get_field_by_label('TOU 4 Week', sheet=option),
            "app": self.get_field_by_label('APP 4 Week', sheet=option),
            "exe": self.get_field_by_label('EXE 4 Week', sheet=option)
          },
          "investment": {
            "acquisition": {
              "expenses": {
                "demand_creation": convertToCurrencyString(
                  self.get_field_by_label('Acquistion Demand Creation', sheet=option)),
                "leasing_enablement": convertToCurrencyString(
                  self.get_field_by_label('Acquisition Leasing Enablement', sheet=option)),
                "market_intelligence": convertToCurrencyString(
                  self.get_field_by_label('Acquisition Market Intelligence', sheet=option)),
                "reputation_building": convertToCurrencyString(
                  self.get_field_by_label('Acquisition Reputation Building', sheet=option))
              },
              "total": convertToCurrencyString(
                self.get_field_by_label('Acquisition Total', sheet=option)),
              "romi": self.get_field_by_label('Acquisition ROMI', sheet=option),
              "estimated_revenue_gain": convertToCurrencyString(
                self.get_field_by_label('Acquisition Revenue Gain', sheet=option))
            },
            "retention": {
              "expenses": {
                "demand_creation": convertToCurrencyString(
                  self.get_field_by_label('Retention Demand Creation', sheet=option)),
                "leasing_enablement": convertToCurrencyString(
                  self.get_field_by_label('Retention Leasing Enablement', sheet=option)),
                "market_intelligence": convertToCurrencyString(
                  self.get_field_by_label('Retention Market Intelligence', sheet=option)),
                "reputation_building": convertToCurrencyString(
                  self.get_field_by_label('Retention Reputation Building', sheet=option))
              },
              "total": convertToCurrencyString(
                self.get_field_by_label('Retention Total', sheet=option)),
              "romi": self.get_field_by_label('Retention ROMI', sheet=option),
              "estimated_revenue_gain": convertToCurrencyString(
                self.get_field_by_label('Retention Revenue Gain', sheet=option))
            },
            "total": {
              "total": convertToCurrencyString(
                self.get_field_by_label('Total Total', sheet=option)),
              "romi": self.get_field_by_label('Total ROMI', sheet=option),
              "estimated_revenue_gain": convertToCurrencyString(
                self.get_field_by_label('Total Revenue Gain', sheet=option))
            }
          }
        }

    def get_report(self):
        result = self.property()
        result['options'] = []
        options = self.row_array('Output', 'A', 'B', 'Models')
        for option in options:
            result['options'].append(self.build_option(option))

        self.validate(result)

        return json.dumps(result)



if __name__ == '__main__':
    pycel_logging_to_console()

    if len(sys.argv) <= 2:
        raise Exception("You need to pass in the Excel File Type and the Excel file path")

    if sys.argv[1] == 'tam':
        importer = TAMImporter(sys.argv[2])
    elif sys.argv[1] == 'modeling':
        importer = ModelingImporter(sys.argv[2])

    print("TAM Excel Path: %s" % sys.argv[2])
    output = importer.get_report()
    print("Complete.")
    print(output)
