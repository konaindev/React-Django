import os

from copy import copy
from django.test import SimpleTestCase
from django.urls import reverse


class DonutChartTestCase(SimpleTestCase):
    test_data = {
        "goal": 95,
        "goal_date": "2015-11-17",
        "current": 80,
        "bg": "#20272E",
        "bg_target": "#404E5C",
        "bg_current": "#006EFF",
    }

    def setUp(self):
        self.url = reverse("donut")
        self.current_dir = os.path.dirname(os.path.abspath(__file__))

    def test_png_image(self):
        r = self.client.get(self.url, self.test_data)
        result = r.content
        path = os.path.join(self.current_dir, "test_files/donut.png")
        with open(path, "rb") as f:
            expect = f.read()
        self.assertEqual(expect, result)

    def test_svg_image(self):
        data = copy(self.test_data)
        data["type"] = "svg"
        r = self.client.get(self.url, data)
        result = r.content
        path = os.path.join(self.current_dir, "test_files/donut.svg")
        with open(path, "r") as f:
            expect = f.read().encode("utf-8")
        self.assertEqual(expect, result)
