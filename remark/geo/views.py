import json
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

from remark.lib.views import RemarkView
from .geocode import geocode


class OfficeAddressView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        data = json.loads(request.body)
        address = geocode(data["address"])
        if address:
            offices_addresses = [
                {
                    "value": address.formatted_address,
                    "street": address.street_address,
                    "city": address.city,
                    "state": address.state,
                }
            ]
        else:
            offices_addresses = []
        print(offices_addresses)
        return JsonResponse({"offices_addresses": offices_addresses}, status=200)
