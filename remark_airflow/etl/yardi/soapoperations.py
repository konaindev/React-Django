import os
from lxml import etree
import requests

YARDI_DATABASENAME = os.environ.get('YARDI_DATABASENAME', None)
YARDI_INTERFACE_ENTITY = os.environ.get('YARDI_INTERFACE_ENTITY', None)
YARDI_INTERFACE_LICENSE = os.environ.get('YARDI_INTERFACE_LICENSE', None)
YARDI_PASSWORD = os.environ.get('YARDI_PASSWORD', None)
YARDI_PLATFORM = os.environ.get('YARDI_PLATFORM', None)
YARDI_SERVERNAME = os.environ.get('YARDI_SERVERNAME', None)
YARDI_USERNAME = os.environ.get('YARDI_USERNAME', None)

YARDI_REVENUE_MANAGEMENT_ENDPOINT = 'https://www.yardipcv.com/8223tp7s7dev/webservices/itfrevenuemanagement.asmx'

YARDI_SOAP_AUTH_FIELDS = f"""
      <itf:Database>{YARDI_DATABASENAME}</itf:Database>
      <itf:InterfaceEntity>{YARDI_INTERFACE_ENTITY}</itf:InterfaceEntity>
      <itf:InterfaceLicense>{YARDI_INTERFACE_LICENSE}</itf:InterfaceLicense>
      <itf:Password>{YARDI_PASSWORD}</itf:Password>
      <itf:Platform>{YARDI_PLATFORM}</itf:Platform>
      <itf:ServerName>{YARDI_SERVERNAME}</itf:ServerName>
      <itf:UserName>{YARDI_USERNAME}</itf:UserName>night
"""

SOAP_WRAPPER_PREAMBLE = """
<soap-env:Envelope xmlns:soap-env="http://www.w3.org/2003/05/soap-envelope" xmlns:itf="http://tempuri.org/YSI.Interfaces.WebServices/ItfRevenueManagement">
  <soap-env:Body>
"""

SOAP_WRAPPER_POSTAMBLE = """
  </soap-env:Body>
</soap-env:Envelope>
"""


class SoapOperation:
    __operation_result_schema = None
    __action_base = "http://tempuri.org/YSI.Interfaces.WebServices/ItfRevenueManagement/"

    def __init__(self, endpoint, operation_name, schemas):
        """
        Abstract Base Class for making Yardi Soap Requests
        :param endpoint: The URL being called to fulfill the request
        :param operation_name: The name of the SOAP operation, also used in the SOAP request body tag
        """
        self.action = self.__action_base + operation_name
        self.docroot = None
        self.endpoint = endpoint
        self.extra_operation_parameters = None
        self.headers = {}
        self.operation_name = operation_name
        self.request = None
        self.response = None
        self.result_data = None
        self.schemas = schemas

    def compose_request_body(self):
        """
        Puts the parts together for the SOAP request body
        :return: request body
        """
        req = SOAP_WRAPPER_PREAMBLE + f"<itf:{self.operation_name}>" + YARDI_SOAP_AUTH_FIELDS
        req += self.extra_operation_parameters if self.extra_operation_parameters else ""
        req += f"</itf:{self.operation_name}>" + SOAP_WRAPPER_POSTAMBLE
        return req

    def compose_headers(self, size):
        """
        Prepares headers for making request
        :param size: the size of the post body
        :returns: dictionary suitable for requests module headers
        """

        headers = {
            'Accept-Encoding': 'gzip,deflate',
            'Content-Type': f'application/soap+xml;charset=UTF-8;action="{self.action}"',
            'Content-Length': str(size),
            'Connection': 'Keep-Alive',
            'Accept': '*/*',
        }
        return headers

    def make_request(self):
        """
        Builds and executes SOAP request.
        :raises: HTTP errors for non-successful requests
        """

        self.request = self.compose_request_body()
        self.headers = self.compose_headers(len(self.request))
        self.response = requests.post(self.endpoint, data=self.request, headers=self.headers)
        self.response.raise_for_status()
        self.docroot = etree.fromstring(self.response.content)
        self.result_data = self.schemas.get_valid_data_or_die_trying(self.operation_name, self.docroot)

        return self.result_data


class GetProperties(SoapOperation):
    """
    Calls Yardi's GetPropertyConfigurations to get a list of properties, property ids, and addresses
    """
    def __init__(self, schemas):
        super().__init__(YARDI_REVENUE_MANAGEMENT_ENDPOINT, "GetPropertyConfigurations", schemas)


class GetDetailedPropertyInformation(SoapOperation):
    """
    This class calls Yardi's GetRawProperty_Login operation, which is the only endpoint where
    I've been able to find detailed guestcard information
    """
    def __init__(self, schemas, propertyid):
        super().__init__(YARDI_REVENUE_MANAGEMENT_ENDPOINT, "GetRawProperty_Login", schemas)

        self.propertyid = propertyid
        self.extra_operation_parameters = f'<itf:YardiPropertyId>{propertyid}</itf:YardiPropertyId>'
        # XXX: Including unit section makes schema validation fail because the schema does not
        # allow the 'exclude' attribute on the unit tag
        # TODO: So far (Dec 2019) no update to the schema definition, so we will probably have to edit
        #  the schema definition Yardi provides.
#        self.extra_operation_parameters += '<itf:IncludeUnitSection>true</itf:IncludeUnitSection>'
        self.extra_operation_parameters += '<itf:IncludeChargeSection>true</itf:IncludeChargeSection>'
        self.extra_operation_parameters += '<itf:IncludeLeaseSection>true</itf:IncludeLeaseSection>'
        self.extra_operation_parameters += '<itf:IncludeGuestCardSection>true</itf:IncludeGuestCardSection>'
