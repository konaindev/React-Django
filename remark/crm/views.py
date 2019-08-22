import json
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

from remark.lib.views import RemarkView

from .models import Business, Office


class CompanySearchView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        params = json.loads(request.body)
        business = Business.objects.filter(name__istartswith=params["company"])[:5]
        company = []
        for b in business:
            company.append({
                "value": b.public_id,
                "label": b.name,
            })
        return JsonResponse({"company": company})


class OfficeAddressView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        params = json.loads(request.body)
        addresses = []
        try:
            params = {"address__formatted_address__icontains": params.get("address")}
            if params.get("business_id"):
                params["business_id"] = params.get("business_id")
            offices = Office.objects.filter(**params)[:5]
            addresses = [{
                "value": o.address.formatted_address,
                "street": o.address.street_address_1,
                "city": o.address.city,
                "state": o.address.state,
            } for o in offices]
        except Business.DoesNotExist:
            pass
        return JsonResponse({"addresses": addresses})
