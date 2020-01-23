import json

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Business, Office


class CompanySearchView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        params = json.loads(request.body)
        business = Business.objects.filter(name__istartswith=params["company"])[:5]
        company = []
        for b in business:
            company.append({
                "value": b.public_id,
                "label": b.name,
                "roles": b.get_roles()
            })
        return Response({
            "company": company
        })


class OfficeAddressView(APIView):

    permission_classes = [IsAuthenticated]

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
                "state": o.address.full_state,
                "country": o.address.country,
                "zip": o.address.zip_code
            } for o in offices]
        except Business.DoesNotExist:
            pass
        return Response({
            "addresses": addresses
        })
