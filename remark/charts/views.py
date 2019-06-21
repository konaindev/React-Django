from django.http import JsonResponse
from django.shortcuts import render

from remark.lib.views import RemarkView

from .forms import DonutForm


class DonutPieChartView(RemarkView):
    def get(self, request):
        form = DonutForm(request.GET)
        # if not form.is_valid():
        #     return JsonResponse(form.errors.get_json_data(), status=400)
        # data = form.cleaned_data
        return render(request, "donut.svg", {}, content_type="image/svg+xml")
