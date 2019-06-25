import math

from cairosvg import svg2png
from django.http import HttpResponse, JsonResponse
from django.template.loader import render_to_string
from svgwrite import text
from svgwrite.path import Path

from remark.lib.views import RemarkView

from .forms import DonutForm


def calc_coord(value, max_value, x0, y0, r):
    angle = value * (2 * math.pi / max_value)
    x = x0 + r * math.sin(angle)
    y = y0 - r * math.cos(angle)
    return round(x, 4), round(y, 4)


def get_slice_path():
    pass


class DonutPieChartView(RemarkView):
    def get(self, request):
        form = DonutForm(request.GET)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), status=400)
        data = form.cleaned_data
        values_data = []
        current_data = {
            "value": data["current"],
            "name": "current",
            "color": data["bg_current"],
        }
        goal_data = {
            "value": data["goal"],
            "name": "goal",
            "color": data["bg_target"],
        }
        if data["goal"] > data["current"]:
            values_data.append(current_data)
            values_data.append(goal_data)
        elif data["current"] > data["goal"]:
            values_data.append(goal_data)
            values_data.append(current_data)
        else:
            values_data.append(current_data)
        max_value = 100
        x0 = 249.5
        y0 = 249.5
        r = 215.4503
        start = (x0, y0 - r)
        svg_paths = []
        prev_value = 0
        for d in values_data:
            value = d["value"]
            path = Path(fill=d["color"])
            path.push('M', start)
            target = calc_coord(value, max_value, x0, y0, r)
            large_arc = True
            if (value - prev_value) <= (max_value / 2):
                large_arc = False
            path.push_arc(
                target=target,
                rotation=0,
                r=(r, r),
                large_arc=large_arc,
                angle_dir="+",
                absolute=True,
            )
            path.push("L", (x0, y0))
            svg_paths.append(path.tostring())
            start = target
            prev_value = d["value"]
        date = data["goal_date"]
        goal = data["goal"]
        title = text.Text(
            "",
            insert=(x0, y0),
            fill="white",
            text_anchor="middle",
            font_size="15px",
            dy=["-8px"],
        )
        title.add(text.TSpan(f"{goal}% Leased Goal"))
        title.add(text.TSpan(f"by {date:%-m/%d/%Y}", x=[x0], dy=["24px"]))
        data["svg_paths"] = svg_paths
        data["title"] = title.tostring()
        svg = render_to_string("donut.svg", data)
        png = svg2png(svg.encode("utf-8"))
        return HttpResponse(png, content_type="image/png")
