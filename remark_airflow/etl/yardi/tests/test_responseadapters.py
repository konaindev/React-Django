from collections import namedtuple
import unittest

import remark_airflow.etl.yardi.responseadapters as responseadapters
import os

print(os.path.dirname(os.path.realpath(__file__)))

MockYardiPropertiesNode = namedtuple('MockYardiPropertiesNode', ['tag', 'text'])


class TestYardiGetPropertiesAdapter(unittest.TestCase):
    def test_operation_name(self):
        adapter = responseadapters.YardiGetPropertiesAdapter()
        self.assertEqual(adapter.operation_name, 'GetPropertyConfigurations')

        print(os.path.dirname(os.path.realpath(__file__)))

    def test_process_result(self):
        code1 = 'remarkably1'
        code2 = 'remarkably2'
        property1_name = 'Remarkably Property'
        property2_state = 'WA'
        mockdata = (
            (
                MockYardiPropertiesNode('Code', code1),
                MockYardiPropertiesNode('MarketingName', property1_name)
            ),
            (
                MockYardiPropertiesNode('Code', code2),
                MockYardiPropertiesNode('State', property2_state)
            )
        )
        adapter = responseadapters.YardiGetPropertiesAdapter()
        result = adapter.process_result(mockdata)

        self.assertIn(code1, result)
        self.assertIn('Code', result[code1])
        self.assertEqual(code1, result[code1]['Code'])
        self.assertIn('MarketingName', result[code1])
        self.assertEqual(property1_name, result[code1]['MarketingName'])

        self.assertIn(code2, result)
        self.assertIn('Code', result[code2])
        self.assertEqual(code2, result[code2]['Code'])
        self.assertIn('State', result[code2])
        self.assertEqual(property2_state, result[code2]['State'])

    def test_process_result_duplicate_property_code_error(self):
        code1 = 'remarkably1'
        mockdata = (
            (
                MockYardiPropertiesNode('Code', code1),
            ),
            (
                MockYardiPropertiesNode('Code', code1),
            )
        )
        adapter = responseadapters.YardiGetPropertiesAdapter()

        with self.assertRaises(ValueError) as ve:
            result = adapter.process_result(mockdata)


class TestYardiGetDetailedPropertyInformationAdapter(unittest.TestCase):
    def test_operation_name(self):
        adapter = responseadapters.YardiGetDetailedPropertyInformationAdapter()
        self.assertEqual(adapter.operation_name, 'GetRawProperty_Login')


if __name__ == '__main__':
    unittest.main()
