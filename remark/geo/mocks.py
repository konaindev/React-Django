from unittest import mock


def mocked_geocode(location):
    mock_obj = mock.MagicMock()
    mock_obj.formatted_address = "2284 W Commodore Way #200, Seattle, WA 98199, USA"
    mock_obj.street_address = "2284 W Commodore Way"
    mock_obj.city = "Seattle"
    mock_obj.state = "WA"
    mock_obj.zip5 = "98199"
    mock_obj.country = "US"
    mock_obj.geocode_json = {}
    return mock_obj
