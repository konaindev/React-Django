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
    return "{0:0=2d}".format(num)

def convertArrayToCurrencyStrings(ary):
    result = []
    for x in ary:
        result.append(convertToCurrencyString(x))
    return result

class TAMImporter():
    def __init__(self, fname):
        self.excel = ExcelCompiler(filename=fname)

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
        for x in range(row+1, MAX_ROW):
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
        for x in range(row, MAX_ROW):
            subresult = []
            for y in myAlpha:
                item = self.eval(sheet, y, x)
                if item is None or item == '':
                    break
                subresult.append(item)
            if len(subresult) is 0:
                break
            result.append(subresult)
        return result


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
            "segment_population": self.eval('Output', 'E', top_row+1),
            "usv": self.find_row_eval('Output', 'C', 'A', label),
            "growth": self.find_row_eval('Output', 'D', 'A', label),
            "future_size": self.find_row_eval('Output', 'E', 'A', label),
        }

        i = ALPHA.index('B')
        myAlpha = ALPHA[i:]
        groups = []
        for col in myAlpha:
            income_group = self.eval('Output', col, top_row)
            if income_group == 'All':
                break
            groups.append({
              "income": income_group,
              "group_population": self.eval('Output', col, top_row+1),
              "home_owners": {
                "total": self.eval('Output', col, top_row+2),
                "family": self.eval('Output', col, top_row+4),
                "nonfamily": self.eval('Output', col, top_row+5)
              },
              "renters": {
                "total": self.eval('Output', col, top_row+3),
                "family": self.eval('Output', col, top_row+6),
                "nonfamily": self.eval('Output', col, top_row+7)
              },
              "active_populations": ["renters.nonfamily", "renters.family"],
              "market_size": self.eval('Output', col, top_row+8)
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

    def validate(self, report):
        schema_location = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "../data/schema/jsonschema/MarketAnalysis.schema.json",
        )

        with open(schema_location, "rt") as schema_file:
            schema = json.load(schema_file)

        jsonschema.validate(instance=report, schema=schema)


def main(fname):
    # load & compile the file to a graph
    excel = ExcelCompiler(filename=fname)

    # test evaluation
    print("Should be 51 is %s" % excel.evaluate('Deadline Based Model!R24'))

    d = excel.evaluate('Deadline Based Model!O24')
    print("Should be 2020/6/1 is %d/%d/%d" % date_from_int(d))


if __name__ == '__main__':
    pycel_logging_to_console()

    if len(sys.argv) <= 1:
        raise Exception("You need to pass in the TAM Excel file path")

    print("TAM Excel Path: %s" % sys.argv[1])
    importer = TAMImporter(sys.argv[1])
    output = importer.get_report()
    print("Complete.")
    print(output)
