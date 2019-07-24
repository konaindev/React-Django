from django.test import TestCase
from datetime import date

from .granularity import merge, _merge, split


# create_date - making it fast to write
def cd(day):
    return date(day=day, month=1, year=2019)

TEST_TS_DATA = [
    {
        "start": cd(1),
        "end": cd(8),
        "apps": 5.0
    },
    {
        "start": cd(8),
        "end": cd(15),
        "apps": 2.0
    }
]


TEST_TS_INT_DATA = [
    {
        "start": cd(1),
        "end": cd(8),
        "apps": 5
    },
    {
        "start": cd(8),
        "end": cd(15),
        "apps": 2
    }
]

TEST_PORTFOLIO_DATA = [
    {
        "start": cd(1),
        "end": cd(8),
        "apps": 5
    },
    {
        "start": cd(8),
        "end": cd(15),
        "apps": 2
    },
    {
        "start": cd(1),
        "end": cd(8),
        "apps": 10
    },
    {
        "start": cd(8),
        "end": cd(15),
        "apps": 4
    }
]

TEST_MERGE_DOC = {
    "apps": "sum",
}

TEST_SPLIT_DOC = {
    "apps": "linear"
}

class GranularityTestCase(TestCase):

    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def testBasic(self):
        result = merge(TEST_MERGE_DOC, TEST_SPLIT_DOC, TEST_TS_DATA, cd(1), cd(15))
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 7)

    def testFull(self):
        result = merge(TEST_MERGE_DOC, TEST_SPLIT_DOC, TEST_TS_DATA, cd(4), cd(10))
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 3.428571428571429)

    def testFullWithInt(self):
        result = merge(TEST_MERGE_DOC, TEST_SPLIT_DOC, TEST_TS_INT_DATA, cd(4), cd(10))
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 4)

    def testPortfolio(self):
        result = merge(TEST_MERGE_DOC, TEST_SPLIT_DOC, TEST_PORTFOLIO_DATA, cd(4), cd(10))
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 11)

    def testSplit(self):
        p = {
            "start": cd(1),
            "end": cd(8),
            "apps": 5.0
        }
        split_doc = {
            "apps": "linear"
        }
        left, right = split(split_doc, p, cd(4))
        self.assertEqual(type(left), dict)
        self.assertEqual(type(right), dict)
        self.assertEqual(left["apps"], 2.142857142857143)
        self.assertEqual(right["apps"], 5.0 - left["apps"])

    def testMerge(self):
        merge_doc = {
            "apps": "sum",
        }
        ts = [
            { "apps": 5.0 },
            { "apps": 2.0 }
        ]
        result = _merge(merge_doc, ts)
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 7.0)

    def testMergeFullTS(self):
        merge_doc = {
            "apps": "sum",
        }
        ts = [
            {"apps": 5.0, "start": 1, "end": 2},
            {"apps": 2.0, "start": 1, "end": 2}
        ]
        result = _merge(merge_doc, ts)
        self.assertEqual(type(result), dict)
        self.assertEqual(result["apps"], 7.0)
