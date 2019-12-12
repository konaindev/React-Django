from abc import ABC, abstractmethod


class SoapResponseAdapter(ABC):
    """
    Basic interface for translating xml data to a form we can digest.
    """
    def __init__(self, operation_name):
        self.operation_name = operation_name
        self.processed_result = None

    @abstractmethod
    def process_result(self, element_tree):
        """
        Converts retrieved data from a SOAP endpoint into a form we can use for our database
        :param element_tree: lxml Element root node that passes the validation specified in Itf_PropertyConfiguration.xsd
        :return: a data structure containing information about a client's properties.
        """
        raise NotImplementedError()


class YardiGetPropertiesAdapter(SoapResponseAdapter):
    """
    This class handles the transformation from yardi's GetPropertyConfigurations to a python data structure (for now).
    """
    def __init__(self):
        super().__init__("GetPropertyConfigurations")

    def process_result(self, element_tree):

        # Based on the Schema Itf_PropertyConfiguration.xsd, this document should be a pretty simple one to parse.
        # consider a named tuple for entries, but unclear what scope that would have or be useful.
        self.processed_result = {}
        for prop in element_tree:
            # I want the property 'Code' value from the document to use as a key in property_data, it is at the
            # same hierarchical level as the other property details.

            property_temp = {}
            for entry in prop:
                property_temp[entry.tag] = entry.text

            if property_temp['Code'] in self.processed_result:
                raise ValueError(f'Unexpected duplicate property code {property_temp["Code"]}')
            self.processed_result[property_temp['Code']] = property_temp

        return self.processed_result


class YardiGetDetailedPropertyInformationAdapter(SoapResponseAdapter):
    """
    This class handles the transformation from yardi's GetRawProperty_Login to ... nothing yet
    """
    def __init__(self):
        super().__init__("GetRawProperty_Login")

    def process_result(self, element_tree):
        pass

