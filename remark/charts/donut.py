import math

from django.template.loader import render_to_string
from svgwrite import path, text


class DonutChart:
    def __init__(self, data, font_options, options):
        self.goal = data["goal"]
        self.current = data["current"]
        self.goal_date = data["goal_date"]
        self.bg = f"#{data['bg']}"
        self.bg_target = f"#{data['bg_target']}"
        self.bg_current = f"#{data['bg_current']}"
        self.font = font_options
        self.width = options["width"]
        self.height = options["height"]
        self.x0 = options["x0"]
        self.y0 = options["y0"]
        self.r0 = options["r0"]
        self.r = options["r"]
        self.donut_width = options["donut_width"]
        self.max_value = options["max_value"]

    def calc_slice_coord(self, value, r):
        angle = value * (2 * math.pi / self.max_value)
        x = self.x0 + r * math.sin(angle)
        y = self.y0 - r * math.cos(angle)
        return round(x, 4), round(y, 4)

    def get_slice_path(self, value, initial_value, color):
        p = path.Path(fill=color)
        max_value = self.max_value
        x0 = self.x0
        y0 = self.y0
        r = self.r
        initial_target = self.calc_slice_coord(initial_value, self.r)
        p.push('M', initial_target)
        target = self.calc_slice_coord(value, self.r)
        large_arc = True
        if (value - initial_value) <= (max_value / 2):
            large_arc = False
        p.push_arc(
            target=target,
            rotation=0,
            r=(r, r),
            large_arc=large_arc,
            angle_dir="+",
            absolute=True,
        )
        p.push("L", (x0, y0))
        return p.tostring()

    def get_slice_text(self, name, value, initial_value):
        max_value = self.max_value
        if (value - initial_value) <= (max_value / 2):
            text_value = initial_value + (value - initial_value) / 2
            x, y = self.calc_slice_coord(text_value, self.r0)
        else:
            x, y = self.calc_slice_coord(max_value / 2, self.r0)
        t = text.Text(
            "",
            insert=(x, y),
        )
        t.add(text.TSpan(f"{name.capitalize()}:"))
        t.add(text.TSpan(f"{value}%", x=[x], dy=["17px"]))
        return t.tostring()

    def get_title_text(self, value, date):
        t = text.Text(
            "",
            insert=(self.x0, self.y0),
            dy=["-8px"],
        )
        t.add(text.TSpan(f"{value}% Leased Goal"))
        t.add(text.TSpan(f"by {date:%-m/%d/%Y}", x=[self.x0], dy=["24px"]))
        return t.tostring()

    def build_svg(self):
        svg_paths = []
        texts = []
        values_data = []
        current_data = {
            "value": self.current,
            "name": "current",
            "color": self.bg_current,
        }
        goal_data = {
            "value": self.goal,
            "name": "goal",
            "color": self.bg_target,
        }
        if self.goal > self.current:
            values_data.append(current_data)
            values_data.append(goal_data)
        elif self.current > self.goal:
            values_data.append(goal_data)
            values_data.append(current_data)
        else:
            values_data.append(current_data)
        prev_value = 0
        for d in values_data:
            value = d["value"]
            texts.append(
                self.get_slice_text(d["name"], d["value"], prev_value)
            )
            svg_paths.append(self.get_slice_path(value, prev_value, d["color"]))
            prev_value = d["value"]
        texts.append(self.get_title_text(self.goal, self.goal_date))
        context = {
            "svg_paths": svg_paths,
            "texts": texts,
            "bg": self.bg,
            "font": self.font,
            "width": self.width,
            "height": self.height,
            "x0": self.x0,
            "y0": self.y0,
            "r0": self.r0,
            "r": self.r,
            "donut_width": self.donut_width,
            "max_value": self.max_value,
        }
        return render_to_string("donut.svg", context).encode("utf-8")
