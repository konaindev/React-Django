import json
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

from remark.lib.views import RemarkView

from .models import Business


class CompanySearchView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        params = json.loads(request.body)
        business = Business.objects.filter(name__istartswith=params["company"])[:5]
        company = [{"value": b.public_id, "label": b.name} for b in business]
        return JsonResponse({"company": company})
