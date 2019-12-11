import unittest

from defusedxml import ElementTree
import xmlschema

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
        pass

    def test_get_valid_data_bad_operation_name(self):
        pass

    def test_get_valid_data_bad_document(self):
        pass

    def test_get_valid_data_bad_xpath(self):
        pass

    def test_get_valid_data_bad_missing_root_element(self):
        pass

    def test_get_valid_data_bad_multiple_root_elemments(self):
        pass


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
