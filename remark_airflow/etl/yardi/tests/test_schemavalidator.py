import os
import unittest
import urllib.error

from defusedxml import ElementTree
import xmlschema
from xmlschema.validators import exceptions as xmlschema_exceptions
from remark_airflow.etl.yardi.extract.schemavalidator import SchemaMetadata, SchemaValidator, get_schemas_path


class TestSchemaValidator(unittest.TestCase):

    def test_cache(self):
        validator = SchemaValidator()
        for k, v in validator._schema_locations.items():
            self.assertIsNone(validator._loaded_schemas[k])
            loaded = validator.get_schema_validator(v)
            my_load = xmlschema.XMLSchema(os.path.join(get_schemas_path(), v.schema_file))

            # this is a very loose comparison, it doesn't walk the trees
            self.assertEqual(repr(loaded), repr(my_load))
            self.assertIn(k, validator._loaded_schemas)
            self.assertEqual(loaded, validator._loaded_schemas[k])

            cached = validator.get_schema_validator(v)
            # see if it's the same object (not loaded from disk again)
            self.assertIs(loaded, cached)

    def test_get_valid_data_happy_path(self):
        validator = SchemaValidator()
        root = ElementTree.fromstring(property_configurations_xml)
        data = validator.get_valid_data_or_die_trying('GetPropertyConfigurations', root)
        self.assertIn('Property', data)
        self.assertEqual(len(data['Property']), 2)

    def test_get_valid_data_bad_filename(self):
        validator = SchemaValidator()

        op_name = 'BadFile'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='.//MyElement'
        )
        validator._schema_locations[op_name] = metadata
        validator._loaded_schemas[op_name] = None

        element = ElementTree.fromstring('<outer><MyElement>abcd</MyElement></outer>')

        with self.assertRaises(urllib.error.URLError):
            validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_no_entry_in_loaded_dictionary(self):
        validator = SchemaValidator()
        op_name = 'NoEntry'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='blahblah'
        )
        validator._schema_locations[op_name] = metadata

        with self.assertRaises(KeyError):
            validator.get_valid_data_or_die_trying(metadata, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_operation_name(self):
        op_name = "NonExistent"
        validator = SchemaValidator()

        with self.assertRaises(KeyError):
            validator.get_valid_data_or_die_trying(op_name, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_document(self):
        op_name = 'GetPropertyConfigurations'
        validator = SchemaValidator()

        element = ElementTree.fromstring('<outer><Properties><Property>text</Property></Properties></outer>')
        with self.assertRaises(xmlschema_exceptions.XMLSchemaValidationError):
            validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_bad_xpath(self):

        validator = SchemaValidator()
        op_name = 'BadXPath'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='.//NotReal'
        )
        validator._schema_locations[op_name] = metadata
        validator._loaded_schemas[op_name] = None

        element = ElementTree.fromstring('<outer><MyElement>abcd</MyElement></outer>')

        with self.assertRaises(ValueError):
            validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_bad_missing_root_element(self):
        op_name = 'GetPropertyConfigurations'
        validator = SchemaValidator()

        with self.assertRaises(ValueError):
            validator.get_valid_data_or_die_trying(op_name, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_multiple_root_elemments(self):
        op_name = 'GetPropertyConfigurations'

        validator = SchemaValidator()
        element = ElementTree.fromstring('<outer><Properties/><Properties/></outer>')
        with self.assertRaises(ValueError):
            validator.get_valid_data_or_die_trying(op_name, element)


property_configurations_xml = """
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
   <soap:Body>
      <GetPropertyConfigurationsResponse xmlns="http://tempuri.org/YSI.Interfaces.WebServices/ItfResidentData">
         <GetPropertyConfigurationsResult>
            <Properties xmlns="">
               <Property>
                  <Code>remark01</Code>
                  <MarketingName>Remarkably 1 Test Property</MarketingName>
                  <AddressLine1>100 West Channel Road</AddressLine1>
                  <AddressLine2/>
                  <AddressLine3/>
                  <City>Santa Monica</City>
                  <State>CA</State>
                  <PostalCode>90402</PostalCode>
                  <AccountsReceivable>10/2019</AccountsReceivable>
                  <AccountsPayable>10/2019</AccountsPayable>
               </Property>
               <Property>
                  <Code>remark02</Code>
                  <MarketingName>Remarkably 2 Test Property</MarketingName>
                  <AddressLine1>4550 Hollister Avenue</AddressLine1>
                  <AddressLine2/>
                  <AddressLine3/>
                  <City>Goleta</City>
                  <State>CA</State>
                  <PostalCode>93117</PostalCode>
                  <AccountsReceivable>10/2019</AccountsReceivable>
                  <AccountsPayable>10/2019</AccountsPayable>
               </Property>
            </Properties>
         </GetPropertyConfigurationsResult>
      </GetPropertyConfigurationsResponse>
   </soap:Body>
</soap:Envelope>"""
