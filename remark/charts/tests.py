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

    def _check_correct_png(self, data, file_path):
        resp = self.client.get(self.url, data)
        path = os.path.join(self.current_dir, file_path)
        with open(path, "rb") as f:
            expect = f.read()
        self.assertEqual(200, resp.status_code)
        self.assertEqual("image/png", resp["Content-Type"])
        result = resp.content
        self.assertEqual(expect, result)

    def test_overlapped_labels_on_right(self):
        data = copy(self.test_data)
        data["goal"] = 47
        data["current"] = 60
        self._check_correct_png(data, "test_files/right_overlap.png")

    def test_overlapped_labels_on_left(self):
        data = copy(self.test_data)
        data["goal"] = 53
        data["current"] = 60
        self._check_correct_png(data, "test_files/left_overlap.png")

    def test_current_greater_goal(self):
        data = copy(self.test_data)
        data["goal"] = 20
        data["current"] = 40
        self._check_correct_png(data, "test_files/current_greater_goal.png")

    def test_goal_greater_current(self):
        self._check_correct_png(
            self.test_data, "test_files/goal_greater_current.png")

    def test_current_equal_goal(self):
        data = copy(self.test_data)
        data["goal"] = 60
        data["current"] = 60
        self._check_correct_png(data, "test_files/current_equal_goal.png")

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
