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
        "type": "svg",
    }

    def setUp(self):
        self.url = reverse("donut")
        self.current_dir = os.path.dirname(os.path.abspath(__file__))

    def _check_correct_svg(self, data, file_path):
        with self.settings(DEBUG=True):
            resp = self.client.get(self.url, data)
        path = os.path.join(self.current_dir, file_path)
        with open(path, "rb") as f:
            expect = f.read()
        self.assertEqual(200, resp.status_code)
        self.assertEqual("image/svg+xml", resp["Content-Type"])
        result = resp.content
        self.assertEqual(expect, result)

    # def test_overlapped_labels_on_right(self):
    #     data = copy(self.test_data)
    #     data["goal"] = 47
    #     data["current"] = 60
    #     self._check_correct_svg(data, "test_files/right_overlap.svg")

    # def test_overlapped_labels_on_left(self):
    #     data = copy(self.test_data)
    #     data["goal"] = 53
    #     data["current"] = 60
    #     self._check_correct_svg(data, "test_files/left_overlap.svg")
    # def test_current_greater_goal(self):
    #     data = copy(self.test_data)
    #     data["goal"] = 20
    #     data["current"] = 40
    #     self._check_correct_svg(data, "test_files/current_greater_goal.svg")

    # def test_current_equal_goal(self):
    #     data = copy(self.test_data)
    #     data["goal"] = 60
    #     data["current"] = 60
    #     self._check_correct_svg(data, "test_files/current_equal_goal.svg")

    # def test_goal_greater_current(self):
    #     self._check_correct_svg(
    #         self.test_data, "test_files/goal_greater_current.svg")

    def test_over_100_goal_only(self):
        data = copy(self.test_data)
        data["goal"] = 120
        data["current"] = 95
        self._check_correct_svg(
            data, "test_files/over_100_goal_only.svg")
    
    def test_over_100_current_only(self):
        data = copy(self.test_data)
        data["goal"] = 95
        data["current"] = 105
        self._check_correct_svg(
            data, "test_files/over_100_current_only.svg")

    def test_over_100_goal_and_current(self):
        data = copy(self.test_data)
        data["goal"] = 120
        data["current"] = 105
        self._check_correct_svg(
            data, "test_files/over_100_goal_and_current.svg")

    def test_goal_greater_current_and_smaller_50(self):
        data = copy(self.test_data)
        data["goal"] = 41
        data["current"] = 16
        self._check_correct_svg(
            data, "test_files/goal_greater_current_and_smaller_50.svg")

    def test_goal_label_moved_due_to_overlap(self):
        data = copy(self.test_data)
        data["goal"] = 53
        data["current"] = 50
        self._check_correct_svg(
            data, "test_files/goal_label_moved_due_to_overlap.svg")

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
