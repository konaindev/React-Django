import unittest, unittest.mock

from remark_airflow.etl.yardi import schemavalidator, soapoperations


class TestYardiSoapOperation(unittest.TestCase):
    def test_init(self):
        endpoint = 'foo'
        operation_name = 'bar'
        validator = schemavalidator.SchemaValidator()

        op = soapoperations.SoapOperation(endpoint, operation_name, validator)
        self.assertEqual(op.action, op._action_base + operation_name)

        self.assertIsNone(op.docroot)

        self.assertEqual(op.endpoint, endpoint)

        self.assertIsNone(op.extra_operation_parameters)

        self.assertEqual(op.headers, {})

        self.assertIsNone(op.request)
        self.assertIsNone(op.response)
        self.assertIsNone(op.result_data)

        self.assertEqual(op.schemas, validator)

    def test_compose_request_body(self):
        endpoint = 'foo'
        operation_name = 'bar'
        validator = schemavalidator.SchemaValidator()

        op = soapoperations.SoapOperation(endpoint, operation_name, validator)
        req = op.compose_request_body()

        self.assertIn(soapoperations.SOAP_WRAPPER_POSTAMBLE, req)
        self.assertIn(soapoperations.SOAP_WRAPPER_PREAMBLE, req)
        self.assertIn(f"<itf:{operation_name}>", req)
        self.assertIn(f"</itf:{operation_name}>", req)

    def test_compose_request_body_extra_parameters(self):
        endpoint = 'foo'
        operation_name = 'bar'
        validator = schemavalidator.SchemaValidator()

        op = soapoperations.SoapOperation(endpoint, operation_name, validator)
        test_str = 'I am an extra operation parameter.'
        op.extra_operation_parameters = test_str

        req = op.compose_request_body()
        self.assertIn(test_str, req)

    def test_compose_headers(self):
        endpoint = 'foo'
        operation_name = 'bar'
        validator = schemavalidator.SchemaValidator()

        op = soapoperations.SoapOperation(endpoint, operation_name, validator)
        bodysize = 23
        headers = op.compose_headers(bodysize)
        self.assertIn('Accept', headers)
        self.assertEqual(headers['Accept'], '*/*')
        self.assertIn('Accept-Encoding', headers)
        self.assertEqual(headers['Accept-Encoding'], 'gzip,deflate')
        self.assertIn('Connection', headers)
        self.assertEqual(headers['Connection'], 'Keep-Alive')
        self.assertIn('Content-Length', headers)
        self.assertEqual(headers['Content-Length'], str(bodysize))
        self.assertIsInstance(headers['Content-Length'], str)
        self.assertIn('Content-Type', headers)
        self.assertIn('application/soap+xml;charset=UTF-8;action=', headers['Content-Type'])
        self.assertIn(op.action, headers['Content-Type'])

    @unittest.mock.patch('remark_airflow.etl.yardi.soapoperations.requests.post')
    def test_make_request(self, mock_obj):
        pass


class TestYardiGetProperties(unittest.TestCase):
    def test_init(self):
        validator = schemavalidator.SchemaValidator()
        op = soapoperations.GetProperties(validator)
        self.assertEqual(op.operation_name, 'GetPropertyConfigurations')
        self.assertEqual(op.endpoint, soapoperations.YARDI_REVENUE_MANAGEMENT_ENDPOINT)
        self.assertEqual(op.schemas, validator)


class TestYardiGetDetailedPropertyInformation(unittest.TestCase):
    def test_init(self):
        validator = schemavalidator.SchemaValidator()
        propertyid = 'abc'
        op = soapoperations.GetDetailedPropertyInformation(validator, propertyid)

        self.assertEqual(op.operation_name, 'GetRawProperty_Login')
        self.assertEqual(op.endpoint, soapoperations.YARDI_REVENUE_MANAGEMENT_ENDPOINT)
        self.assertEqual(op.schemas, validator)
        self.assertEqual(op.propertyid, propertyid)

        extra_params = op.extra_operation_parameters
        self.assertIn('YardiPropertyId', extra_params)
#        self.assertIn('IncludeUnitSection', extra_params)
        self.assertIn('IncludeChargeSection', extra_params)
        self.assertIn('IncludeLeaseSection', extra_params)
        self.assertIn('IncludeGuestCardSection', extra_params)


if __name__ == '__main__':
    unittest.main()
