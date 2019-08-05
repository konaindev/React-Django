import math

from django.template.loader import render_to_string
from svgwrite import path, text
from svgwrite.shapes import Line


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
        self.is_labels_overlap = (0 <= self.current - self.goal <= 6)

    def calc_slice_coord(self, value, r):
        angle = value * (2 * math.pi / self.max_value)
        x = self.x0 + r * math.sin(angle)
        y = self.y0 - r * math.cos(angle)
        return round(x, 4), round(y, 4)

    def get_goal_text(self):
        if self.is_labels_overlap:
            return ""
        if 0 <= self.goal - self.current <= 4:
            x, y = self.calc_slice_coord(self.current + 3, self.r0)
        else:
            x, y = self.calc_slice_coord(self.goal - 3, self.r0)
        t = text.Text(
            "",
            insert=(x, y),
        )
        t.add(text.TSpan("Goal:"))
        t.add(text.TSpan(f"{self.goal}%", x=[x], dy=["17px"]))
        return t.tostring()

    def get_current_text(self):
        half_size = self.max_value / 2
        if (half_size - 7 <= self.current <= half_size + 14) or \
                (self.current >= self.max_value - 15) or (self.current <= self.max_value + 9):
            x, y = self.calc_slice_coord(self.current - 4, self.r0)
        else:
            x, y = self.calc_slice_coord(self.current - 3, self.r0)
        t = text.Text(
            "",
            insert=(x, y),
        )
        t.add(text.TSpan("Current:"))
        t.add(text.TSpan(f"{self.current}%", x=[x], dy=["17px"]))
        return t.tostring()

    def get_title_text(self):
        t = text.Text(
            "",
            insert=(self.x0, self.y0),
            dy=["-8px"],
        )
        t.add(text.TSpan(f"{self.goal}% Leased Goal"))
        t.add(text.TSpan(f"by {self.goal_date:%-m/%d/%Y}", x=[self.x0], dy=["24px"]))
        return t.tostring()

    def get_slice_path(self, value, initial_value, color, **options):
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

    def get_line(self, value, color, **options):
        end = self.calc_slice_coord(value, self.r)
        start = (self.x0, self.y0)
        line = Line(start, end, stroke=color, stroke_dasharray="4 4")
        return line.tostring()

    def build_svg(self):
        ring_background = self.bg

        goal_data = {
            "name": "goal",
            "line_color": "white",
            "ring_color": self.bg_target,
            "line_value": self.goal,
            "ring_value": self.goal,
            "line_shown": False,
            "ring_shown": False,
        }
        current_data = {
            "name": "current",
            "line_color": "white", # could be overridden
            "ring_color": self.bg_current,
            "line_value": self.current,
            "ring_value": self.current,
            "line_shown": False,
            "ring_shown": True,
        }

        if self.current >= 100 or self.goal >= 100 or self.goal <= self.current:
            goal_data["line_shown"] = True

        if self.current >= 100:
            ring_background = self.bg_current
            current_data["ring_shown"] = False
            current_data["line_shown"] = True
        else:
            if self.goal >= 100:
                goal_data["ring_shown"] = True
                goal_data["ring_value"] = 100
            elif self.goal > self.current:
                goal_data["ring_shown"] = True

        svg_paths = []
        texts = []

        groups = [current_data, goal_data]
        prev_value = 0
        for group in groups:
            if group["line_shown"]:
                svg_paths.append(self.get_line(
                    group["line_value"],
                    group["line_color"]
                ))
            if group["ring_shown"]:
                svg_paths.append(self.get_slice_path(
                    group["ring_value"],
                    initial_value=prev_value,
                    color=group["ring_color"]
                ))
                prev_value=group["ring_value"]

        texts.append(self.get_goal_text())
        texts.append(self.get_current_text())
        texts.append(self.get_title_text())

        context = {
            "svg_paths": svg_paths,
            "texts": texts,
            "bg": ring_background,
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
