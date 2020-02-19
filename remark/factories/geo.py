from remark.geo.models import Country, Address


def create_us():
    return Country.objects.create(id=233, name="United States", code="US")


def create_address(**kwargs):
    params = {
        "street_address_1": "2284 W. Commodore Way, Suite 200",
        "city": "Seattle",
        "state": "WA",
        "zip_code": 98199,
        "country": "US",
        **kwargs,
    }
    return Address.objects.create(**params)
