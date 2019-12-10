import unittest

from remark_airflow.etl.yardi import schemavalidator, soapoperations


class TestYardiGetProperties(unittest.TestCase):
    def test_init(self):
        validator = schemavalidator.SchemaValidator()
        gp = soapoperations.GetProperties(validator)
        self.assertEqual(gp.operation_name, 'GetPropertyConfigurations')
        self.assertEqual(gp.endpoint, soapoperations.YARDI_REVENUE_MANAGEMENT_ENDPOINT)
        self.assertEqual(gp.schemas, validator)


class TestYardiGetDetailedPropertyInformation(unittest.TestCase):
    def test_init(self):
        validator = schemavalidator.SchemaValidator()
        propertyid = 'abc'
        gp = soapoperations.GetDetailedPropertyInformation(validator, propertyid)
        self.assertEqual(gp.operation_name, 'GetRawProperty_Login')
        self.assertEqual(gp.endpoint, soapoperations.YARDI_REVENUE_MANAGEMENT_ENDPOINT)
        self.assertEqual(gp.schemas, validator)
        self.assertEqual(gp.propertyid, propertyid)


if __name__ == '__main__':
    unittest.main()
