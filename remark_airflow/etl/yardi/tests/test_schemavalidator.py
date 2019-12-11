import unittest
import urllib.error

from defusedxml import ElementTree
import xmlschema
from xmlschema.validators import exceptions as xmlschema_exceptions

from remark_airflow.etl.yardi.schemavalidator import SchemaMetadata, SchemaValidator

schemas_relpath = '../xmlschemas'


class TestSchemaValidator(unittest.TestCase):
    # TODO: All of these

    def setUp(self):
        class InternalValidator(SchemaValidator):
            _schema_locations = {
                'GetRawProperty_Login': SchemaMetadata(
                    schema_file=f'{schemas_relpath}/Itf_RevenueMgmtRawDataExport.xsd',
                    schema_name='GetRawProperty_Login',
                    root_xpath='.//RevenueManagementRawData',
                ),
                'GetPropertyConfigurations': SchemaMetadata(
                    schema_file=f'{schemas_relpath}/Itf_PropertyConfiguration.xsd',
                    schema_name='GetPropertyConfigurations',
                    root_xpath='.//Properties',
                )
            }
            _loaded_schemas = {k: None for k in _schema_locations.keys()}

        self.validator = InternalValidator()

    def test_schema_file_path_override(self):
        for k, v in self.validator._schema_locations.items():
            self.assertIn(schemas_relpath, v.schema_file)

    def test_cache(self):
        for k, v in self.validator._schema_locations.items():
            self.assertIsNone(self.validator._loaded_schemas[k])
            loaded = self.validator.get_schema_validator(v)
            my_load = xmlschema.XMLSchema(v.schema_file)

            # this is a very loose comparison, it doesn't walk the trees
            self.assertEqual(repr(loaded), repr(my_load))
            self.assertIn(k, self.validator._loaded_schemas)
            self.assertEqual(loaded, self.validator._loaded_schemas[k])

            cached = self.validator.get_schema_validator(v)
            # see if it's the same object (not loaded from disk again)
            self.assertIs(loaded, cached)

    def test_get_valid_data_happy_path(self):
        root = ElementTree.fromstring(property_configurations_xml)
        data = self.validator.get_valid_data_or_die_trying('GetPropertyConfigurations', root)
        self.assertIn('Property', data)
        self.assertEqual(len(data['Property']), 2)

    def test_get_valid_data_bad_filename(self):
        op_name = 'BadFile'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='.//MyElement'
        )
        self.validator._schema_locations[op_name] = metadata
        self.validator._loaded_schemas[op_name] = None

        element = ElementTree.fromstring('<outer><MyElement>abcd</MyElement></outer>')

        with self.assertRaises(urllib.error.URLError):
            self.validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_no_entry_in_loaded_dictionary(self):
        op_name = 'NoEntry'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='blahblah'
        )
        self.validator._schema_locations[op_name] = metadata

        with self.assertRaises(KeyError):
            self.validator.get_valid_data_or_die_trying(metadata, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_operation_name(self):
        op_name = "NonExistent"

        with self.assertRaises(KeyError):
            self.validator.get_valid_data_or_die_trying(op_name, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_document(self):
        op_name = 'GetPropertyConfigurations'

        element = ElementTree.fromstring('<outer><Properties><Property>text</Property></Properties></outer>')
        with self.assertRaises(xmlschema_exceptions.XMLSchemaValidationError):
            self.validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_bad_xpath(self):
        op_name = 'BadXPath'
        metadata = SchemaMetadata(
            schema_file='abcdefg',
            schema_name=op_name,
            root_xpath='.//NotReal'
        )
        self.validator._schema_locations[op_name] = metadata
        self.validator._loaded_schemas[op_name] = None

        element = ElementTree.fromstring('<outer><MyElement>abcd</MyElement></outer>')

        with self.assertRaises(ValueError):
            self.validator.get_valid_data_or_die_trying(op_name, element)

    def test_get_valid_data_bad_missing_root_element(self):
        op_name = 'GetPropertyConfigurations'

        with self.assertRaises(ValueError):
            self.validator.get_valid_data_or_die_trying(op_name, ElementTree.fromstring('<fake/>'))

    def test_get_valid_data_bad_multiple_root_elemments(self):
        op_name = 'GetPropertyConfigurations'

        element = ElementTree.fromstring('<outer><Properties/><Properties/></outer>')
        with self.assertRaises(ValueError):
            self.validator.get_valid_data_or_die_trying(op_name, element)


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
