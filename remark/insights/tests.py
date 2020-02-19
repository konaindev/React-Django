import datetime

from django.urls import reverse
from rest_framework.test import APITestCase

from remark.factories.insights import (
    crete_performance_insights,
    crete_baseline_insights,
)
from remark.factories.projects import create_project_with_user


class PerformanceInsightsTestCase(APITestCase):
    def setUp(self):
        self.project, user = create_project_with_user()
        self.client.force_authenticate(user=user)
        self.url = reverse(
            "v1_insights:performance_insights",
            kwargs={"public_id": self.project.public_id},
        )

    def test_one_performance_insights(self):
        crete_performance_insights(self.project.public_id)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["performance_insights"]), 1)
        expected = [
            {
                "start": "2019-06-07",
                "end": "2019-06-14",
                "text": "Property is 89% Leased against period target of 94%, assessed as On Track.",
            }
        ]
        self.assertListEqual(data["performance_insights"], expected)

    def test_no_performance_insights(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["performance_insights"]), 0)

    def test_many_performance_insights(self):
        crete_performance_insights(self.project.public_id)
        crete_performance_insights(
            self.project.public_id,
            start=datetime.date(year=2019, month=6, day=15),
            end=datetime.date(year=2019, month=6, day=22),
            insights={
                "lease_rate_against_target": "Property is 89% Leased against period target of 94%, assessed as On Track.",
                "change_health_status": "Campaign health has changed from Off Track to On Track during this period.",
            },
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["performance_insights"]), 2)
        expected = [
            {
                "start": "2019-06-15",
                "end": "2019-06-22",
                "text": "Property is 89% Leased against period target of 94%, assessed as On Track.",
            },
            {
                "start": "2019-06-15",
                "end": "2019-06-22",
                "text": "Campaign health has changed from Off Track to On Track during this period.",
            },
        ]
        self.assertListEqual(data["performance_insights"], expected)


class BaselineInsightsTestCase(APITestCase):
    def setUp(self):
        self.project, user = create_project_with_user()
        self.client.force_authenticate(user=user)
        self.url = reverse(
            "v1_insights:baseline_insights",
            kwargs={"public_id": self.project.public_id},
        )

    def test_one_performance_insights(self):
        crete_baseline_insights(self.project.public_id)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["baseline_insights"]), 1)
        expected = [
            {
                "start": "2018-04-01",
                "end": "2019-03-29",
                "text": "Volume of APP is your best performing metric compared to your Remarkably customer peer set average, this period.",
            }
        ]
        self.assertListEqual(data["baseline_insights"], expected)

    def test_no_performance_insights(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["baseline_insights"]), 0)

    def test_many_performance_insights(self):
        crete_baseline_insights(self.project.public_id)
        crete_baseline_insights(
            self.project.public_id,
            start=datetime.date(year=2019, month=6, day=15),
            end=datetime.date(year=2019, month=6, day=22),
            insights={
                "kpi_high_performing": "Volume of APP is your best performing metric compared to your Remarkably customer peer set average, this period.",
                "top_usv_referral": "Direct transitions is your top source of Unique Site Visitors (USV) volume, this period.",
            },
        )
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["baseline_insights"]), 2)
        expected = [
            {
                "start": "2019-06-15",
                "end": "2019-06-22",
                "text": "Direct transitions is your top source of Unique Site Visitors (USV) volume, this period.",
            },
            {
                "start": "2019-06-15",
                "end": "2019-06-22",
                "text": "Volume of APP is your best performing metric compared to your Remarkably customer peer set average, this period.",
            },
        ]
        self.assertListEqual(data["baseline_insights"], expected)
