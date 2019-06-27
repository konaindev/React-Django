from cairosvg import svg2png
from django.http import HttpResponse, JsonResponse

from remark.lib.views import RemarkView

from .donut import DonutChart
from .forms import DonutForm


class DonutPieChartView(RemarkView):
    chart_width = 499
    chart_height = 499
    donut_width = 74.9393
    r0 = 140.511
    max_value = 100

    options = {
        "width": chart_width,
        "height": chart_height,
        "x0": chart_width / 2,
        "y0": chart_height / 2,
        "r0": 140.511,
        "r": r0 + donut_width,
        "donut_width": donut_width,
        "max_value": max_value,
    }

    font = {
        "font_size": "15px",
        "font_family": "Formular",
        "color": "#f5faf7",
    }

    def get(self, request):
        form = DonutForm(request.GET)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), status=400)
        data = form.cleaned_data
        chart = DonutChart(data, self.font, self.options).build_svg()
        content_type = "image/svg+xml"
        if data["type"] == "png":
            chart = svg2png(chart, dpi=72)
            content_type = "image/png"
        return HttpResponse(chart, content_type=content_type)
