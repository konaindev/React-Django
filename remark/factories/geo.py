from remark.geo.models import Country


def create_us():
    return Country.objects.create(id=233, name="United States", code="US")
