import unittest
from unittest import mock

from xmlschema.validators import exceptions as schema_exceptions
from requests import exceptions as requests_exceptions

from remark_airflow.etl.yardi import schemavalidator, soapoperations


class MockHttpResponse:
    """
    This is to simulate an exception thrown when making a request.
    """
    def __init__(self, *args, **kwargs):
        pass

    @staticmethod
    def raise_for_status():
        raise requests_exceptions.HTTPError()


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

    @mock.patch('remark_airflow.etl.yardi.soapoperations.ElementTree.fromstring')
    @mock.patch('remark_airflow.etl.yardi.soapoperations.requests.post', return_value=unittest.mock.Mock())
    def test_make_request_happy_path(self, mock_post, mock_element_tree):
        valid_data = "It's valid, trust me."

        class FakeSchemaValidator:
            @staticmethod
            def get_valid_data_or_die_trying(op, root):
                return valid_data

        endpoint = 'endpoint'
        operation = 'operation'
        op = soapoperations.SoapOperation(endpoint, operation, FakeSchemaValidator())

        d = op.make_request()
        self.assertEqual(valid_data, d)

        mock_element_tree.assert_called_once()
        mock_post.assert_called_once()

        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], endpoint)
        data, headers = kwargs['data'], kwargs['headers']

        self.assertIn(op.operation_name, data)
        self.assertIn(op.action, headers['Content-Type'])

        response_mock = mock_post.return_value
        response_mock.raise_for_status.assert_called_once()

        # tests to see if the 'content' object attribute was accessed, I'm not sure this functionality is
        # actually an official part of unittest.mock.Mock()
        self.assertTrue(hasattr(response_mock, 'content'))

    @mock.patch('remark_airflow.etl.yardi.soapoperations.ElementTree.fromstring')
    @mock.patch('remark_airflow.etl.yardi.soapoperations.requests.post', return_value=unittest.mock.Mock())
    def test_make_request_invalid_document(self, mock_post, mock_element_tree):

        class FakeSchemaValidator:
            @staticmethod
            def get_valid_data_or_die_trying(op, root):
                raise schema_exceptions.XMLSchemaValidationError('foo', 'bar')

        endpoint = 'endpoint'
        operation = 'operation'
        op = soapoperations.SoapOperation(endpoint, operation, FakeSchemaValidator())

        with self.assertRaises(schema_exceptions.XMLSchemaValidationError) as ex:
            d = op.make_request()

    @mock.patch('remark_airflow.etl.yardi.soapoperations.requests.post', new=MockHttpResponse)
    def test_make_request_http_error(self):

        op = soapoperations.SoapOperation('endpoint', 'operation', "I'm a schema validator!")

        with self.assertRaises(requests_exceptions.HTTPError) as ex:
            d = op.make_request()


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
