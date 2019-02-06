import datetime
import decimal
from unittest import skip

from django.test import TestCase

from .models import Period, Project
from .reports import Report


@skip("Temporarily skipping until surgery is complete. -Dave")
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

    def test_net_lease_change(self):
        self.assertEqual(self.period.net_lease_change, 0)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 0)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 0)

    def test_lease_rate(self):
        self.assertEqual(self.period.leased_rate, 0)

    def test_usvs_to_inquiries_percent(self):
        self.assertEqual(self.period.usvs_to_inquiries_percent, 0)

    def test_inquiries_to_tours_percent(self):
        self.assertEqual(self.period.inquiries_to_tours_percent, 0)

    def test_tours_to_lease_applications_percent(self):
        self.assertEqual(self.period.tours_to_lease_applications_percent, 0)

    def test_lease_applications_to_leases_executed_percent(self):
        self.assertEqual(self.period.lease_applications_to_leases_executed_percent, 0)

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


@skip("Temporarily skipping until surgery is complete. -Dave")
class LincolnTowerPeriodTestCase(TestCase):
    """Test basic period model computed properties."""

    def setUp(self):
        project = Project.objects.create(name="test")
        self.period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=19),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            occupiable_units=218,
            target_lease_percent=decimal.Decimal("0.9"),
            leases_ended=3,
            lease_renewal_notices=0,
            acq_reputation_building=decimal.Decimal("28000"),
            acq_demand_creation=decimal.Decimal("21000"),
            acq_leasing_enablement=decimal.Decimal("11000"),
            acq_market_intelligence=decimal.Decimal("7000"),
            monthly_average_rent=decimal.Decimal("7278"),
        )

    def test_net_lease_change(self):
        self.assertEqual(self.period.net_lease_change, 3)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 107)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 196)

    def test_leased_rate(self):
        self.assertEqual(self.period.leased_rate, decimal.Decimal("0.491"))

    def test_usvs_to_inquiries_percent(self):
        self.assertEqual(
            self.period.usvs_to_inquiries_percent, decimal.Decimal("0.012")
        )

    def test_inquiries_to_tours_percent(self):
        self.assertEqual(
            self.period.inquiries_to_tours_percent, decimal.Decimal("0.725")
        )

    def test_tours_to_lease_applications_percent(self):
        self.assertEqual(
            self.period.tours_to_lease_applications_percent, decimal.Decimal("0.216")
        )

    def test_lease_applications_to_leases_executed_percent(self):
        self.assertEqual(
            self.period.lease_applications_to_leases_executed_percent,
            decimal.Decimal("0.750"),
        )

    def test_marketing_investment(self):
        self.assertEqual(self.period.marketing_investment, decimal.Decimal("67000"))

    def test_estimated_monthly_revenue_change(self):
        self.assertEqual(
            self.period.estimated_monthly_revenue_change, decimal.Decimal("21834")
        )

    def test_estimated_annual_revenue_change(self):
        self.assertEqual(
            self.period.estimated_annual_revenue_change, decimal.Decimal("262008")
        )

    def test_return_on_marketing_investment(self):
        self.assertEqual(self.period.return_on_marketing_investment, 4)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, decimal.Decimal("13.71"))

    def test_cost_per_inquiry(self):
        self.assertEqual(self.period.cost_per_inquiry, decimal.Decimal("1098.04"))

    def test_cost_per_tour(self):
        self.assertEqual(self.period.cost_per_tour, decimal.Decimal("1810.81"))

    def test_cost_per_lease_application(self):
        self.assertEqual(
            self.period.cost_per_lease_application, decimal.Decimal("8375.00")
        )

    def test_cost_per_lease_execution(self):
        self.assertEqual(
            self.period.cost_per_lease_execution, decimal.Decimal("11166.67")
        )

    def test_report_jsonable(self):
        # CONSIDER moving this to a separate location
        report = Report(self.period)
        self.assertTrue(report.to_jsonable())

