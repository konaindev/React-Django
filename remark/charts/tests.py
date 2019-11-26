import os

from copy import copy
from django.test import SimpleTestCase
from django.urls import reverse


class DonutChartTestCase(SimpleTestCase):
    test_data = {
        "goal": 95,
        "current": 80,
        "goal_date": "2015-11-17",
        "bg": "20272E",
        "bg_target": "404E5C",
        "bg_current": "006EFF",
        "type": "svg",
    }

    def setUp(self):
        self.url = reverse("donut")
        self.current_dir = os.path.dirname(os.path.abspath(__file__))

    def _generate_svg_file(self, data):
        # verify "/charts/donut" endpoint working fine
        with self.settings(DEBUG=True):
            resp = self.client.get(self.url, data)
        # print(resp.content)
        self.assertEqual(200, resp.status_code)
        self.assertEqual("image/svg+xml", resp["Content-Type"])

        # output as svg files for easy reference
        goal = data["goal"]
        current = data["current"]
        file_path = f"output_files/donut_{goal}_{current}.svg"
        path = os.path.join(self.current_dir, file_path)
        with open(path, "wb") as f:
            f.write(resp.content)
        f.close()

    def test_various_scenarios(self):
        # array of [goal, current] pairs
        pairs = [
            [41, 16],
            [95, 80],
            [47, 60],
            [53, 60],
            [53, 50],
            [20, 40],
            [60, 60],
            [120, 95],
            [95, 105],
            [120, 105],
        ]

        for pair in pairs:
            data = copy(self.test_data)
            data["goal"] = pair[0]
            data["current"] = pair[1]
            self._generate_svg_file(data)

    def test_required_params(self):
        resp = self.client.get(self.url, {})
        self.assertEqual(400, resp.status_code)
        errors = resp.json()
        error_keys = {"goal", "goal_date", "current", "bg", "bg_target", "bg_current"}
        self.assertSetEqual(error_keys, set(errors))
