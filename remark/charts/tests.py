import os

from copy import copy
from django.test import SimpleTestCase
from django.urls import reverse


class DonutChartTestCase(SimpleTestCase):
    test_data = {
        "goal": 95,
        "goal_date": "2015-11-17",
        "current": 80,
        "bg": "20272E",
        "bg_target": "404E5C",
        "bg_current": "006EFF",
    }

    def setUp(self):
        self.url = reverse("donut")
        self.current_dir = os.path.dirname(os.path.abspath(__file__))

    def test_png_image(self):
        resp = self.client.get(self.url, self.test_data)
        path = os.path.join(self.current_dir, "test_files/donut.png")
        with open(path, "rb") as f:
            expect = f.read()
        self.assertEqual(200, resp.status_code)
        self.assertEqual("image/png", resp["Content-Type"])
        result = resp.content
        self.assertEqual(expect, result)

    def test_svg_image(self):
        data = copy(self.test_data)
        data["type"] = "svg"
        with self.settings(DEBUG=True):
            resp = self.client.get(self.url, data)
        path = os.path.join(self.current_dir, "test_files/donut.svg")
        with open(path, "rb") as f:
            expect = f.read()
        self.assertEqual(200, resp.status_code)
        self.assertEqual("image/svg+xml", resp["Content-Type"])
        result = resp.content
        self.assertEqual(expect, result)

    def test_required_params(self):
        resp = self.client.get(self.url, {})
        self.assertEqual(400, resp.status_code)
        errors = resp.json()
        error_keys = {
            "goal",
            "goal_date",
            "current",
            "bg",
            "bg_target",
            "bg_current",
        }
        self.assertSetEqual(error_keys, set(errors))
