from collections import namedtuple

from lxml import etree

SchemaMetadata = namedtuple('SchemaMetadata', ('schema_file', 'schema_name', 'root_xpath'), defaults=(None, None, None))


class SchemaValidator:
    """Processes XML Schema files when they are accessed to use for validation and keeps them cached.
    This class is designed to keep instantiated for multiple pulls from multiple SOAP endpoints to use the cache."""
    __schema_locations = {
        'GetRawProperty_Login': SchemaMetadata(
            schema_file='xmlspecs/Itf_RevenueMgmtRawDataExport.xsd',
            schema_name='GetRawProperty_Login',
            root_xpath='//RevenueManagementRawData',
        ),
        'GetPropertyConfigurations': SchemaMetadata(
            schema_file='xmlspecs/Itf_PropertyConfiguration.xsd',
            schema_name='GetPropertyConfigurations',
            root_xpath='//Properties',
        )
    }
    __loaded_schemas = {k: None for k in __schema_locations.keys()}

    def get_schema_validator(self, schema_meta: SchemaMetadata):
        """
        Caches parsed schema from disk so multiple validations don't hit the disk each time
        :param schema_meta: The schema
        :return: lxml etree XMLSchema instance
        :raises: KeyError if the operation name doesn't have an associated schema
        """

        if self.__loaded_schemas[schema_meta.schema_name] is None:
            schema_doc = etree.parse(schema_meta.schema_file)
            self.__loaded_schemas[schema_meta.schema_name] = etree.XMLSchema(schema_doc)

        return self.__loaded_schemas[schema_meta.schema_name]

    def get_valid_data_or_die_trying(self, schema_name, root):
        """
        This validates an xml subtree of the original request to validate against the provided XML Schema files.
        We can't run this when we get the response because we have to grab the xsd's root element out of the soap response
        :param schema_name: string name of the SOAP operation we're validating for
        :param root: an lxml Element, expected to be the SOAP envelope, but I think lxml is more permissive than that
        :return: a valid subtree that matches the schema (.xsd) file
        :raises: DocumentInvalid if the document is not valid for the operation type
        :raises: KeyError if the operation name doesn't have an associated schema
        """

        schema_meta = self.__schema_locations[schema_name]

        data_root = root.xpath(schema_meta.root_xpath)

        # xpath returns a list of elements with the parameter name, and we're expecting just one item
        count = len(data_root)
        if count < 1:
            raise ValueError("Expected more properties than received")
        if count > 1:
            raise ValueError("Expected fewer properties than received")

        data_root = data_root[0]

        validator = self.get_schema_validator(schema_meta)
        validator.assertValid(data_root)

        return data_root
