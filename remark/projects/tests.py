import datetime
import decimal

from django.test import TestCase

from .models import Period, Project


class DefaultPeriodTestCase(TestCase):
    """
    Test basic period model computed properties on a default Period.
    """

    def setUp(self):
        project = Project.objects.create(name="test")
        self.period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=19),
        )

    def test_net_new_leases(self):
        self.assertEqual(self.period.net_new_leases, 0)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 0)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 0)

    def test_target_lease_rate(self):
        self.assertEqual(self.period.lease_rate, 0)

    def test_usvs_to_inquiries_percent(self):
        self.assertEqual(self.period.usvs_to_inquiries_percent, 0)

    def test_inquiries_to_tours_percent(self):
        self.assertEqual(self.period.inquiries_to_tours_percent, 0)

    def test_tours_to_lease_applications_percent(self):
        self.assertEqual(self.period.tours_to_lease_applications_percent, 0)

    def test_lease_applications_to_lease_executions_percent(self):
        self.assertEqual(self.period.lease_applications_to_lease_executions_percent, 0)

    def test_marketing_investment(self):
        self.assertEqual(self.period.marketing_investment, 0)

    def test_estimated_monthly_revenue_change(self):
        self.assertEqual(self.period.estimated_monthly_revenue_change, 0)

    def test_estimated_annual_revenue_change(self):
        self.assertEqual(self.period.estimated_annual_revenue_change, 0)

    def test_return_on_marketing_investment(self):
        self.assertEqual(self.period.return_on_marketing_investment, 0)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, 0)

    def test_cost_per_inquiry(self):
        self.assertEqual(self.period.cost_per_inquiry, 0)

    def test_cost_per_tour(self):
        self.assertEqual(self.period.cost_per_tour, 0)

    def test_cost_per_lease_application(self):
        self.assertEqual(self.period.cost_per_lease_application, 0)

    def test_cost_per_lease_execution(self):
        self.assertEqual(self.period.cost_per_lease_execution, 0)

