from cairosvg import svg2png
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from svgwrite.path import Path

from remark.lib.views import RemarkView

from .forms import DonutForm


class DonutPieChartView(RemarkView):
    def get(self, request):
        form = DonutForm(request.GET)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), status=400)
        data = form.cleaned_data
        start = "M249.5 34.0497"
        current_path = '<path d="M249.5 34.0497 A215.4503 215.4503 0 1 1 109 249.5" fill="red" />'
        data['current_path'] = current_path
        svg = render_to_string("donut.svg", data)
        # import pdb; pdb.set_trace()
        # png = svg2png(svg.encode("utf-8"))
        return HttpResponse(svg, content_type="image/svg+xml")
