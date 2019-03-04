import datetime
import decimal
import os.path

from django.test import TestCase

from .models import Period, Project
from .reports import ComputedPeriod, Report


class DefaultComputedPeriodTestCase(TestCase):
    """
    Test that all computed properties on a default Period instance
    return sane values.
    """

    def setUp(self):
        project = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=19),
        )
        period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            monthly_average_rent=decimal.Decimal(0),
            leased_units_start=0,
            occupiable_units_start=0,
        )
        self.period = ComputedPeriod(period)

    def test_delta_leases(self):
        self.assertEqual(self.period.delta_leases, 0)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 0)

    def test_leased_rate(self):
        self.assertEqual(self.period.leased_rate, 0)

    def test_renewal_rate(self):
        self.assertEqual(self.period.renewal_rate, 0)

    def test_lease_cd_rate(self):
        self.assertEqual(self.period.lease_cd_rate, 0)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, None)

    def test_occupied_units(self):
        self.assertEqual(self.period.occupied_units, 0)

    def test_occupancy_rate(self):
        self.assertEqual(self.period.occupancy_rate, 0)

    def test_acq_investment(self):
        self.assertEqual(self.period.acq_investment, 0)

    def test_ret_investment(self):
        self.assertEqual(self.period.ret_investment, 0)

    def test_investment(self):
        self.assertEqual(self.period.investment, 0)

    def test_estimated_acq_revenue_gain(self):
        self.assertEqual(self.period.estimated_acq_revenue_gain, 0)

    def test_estimated_ret_revenue_gain(self):
        self.assertEqual(self.period.estimated_ret_revenue_gain, 0)

    def test_acq_romi(self):
        self.assertEqual(self.period.acq_romi, 0)

    def test_ret_romi(self):
        self.assertEqual(self.period.ret_romi, 0)

    def test_romi(self):
        self.assertEqual(self.period.romi, 0)

    def test_target_investment(self):
        self.assertEqual(self.period.target_investment, None)

    def test_target_estimated_acq_revenue_gain(self):
        self.assertEqual(self.period.target_estimated_acq_revenue_gain, None)

    def test_target_estimated_ret_revenue_gain(self):
        self.assertEqual(self.period.target_estimated_ret_revenue_gain, None)

    def test_target_acq_romi(self):
        self.assertEqual(self.period.target_acq_romi, None)

    def test_target_ret_romi(self):
        self.assertEqual(self.period.target_ret_romi, None)

    def test_target_romi(self):
        self.assertEqual(self.period.target_romi, None)

    def test_usv_inq_perc(self):
        self.assertEqual(self.period.usv_inq_perc, 0)

    def test_inq_tou_perc(self):
        self.assertEqual(self.period.inq_tou_perc, 0)

    def test_tou_app_perc(self):
        self.assertEqual(self.period.tou_app_perc, 0)

    def test_app_exe_perc(self):
        self.assertEqual(self.period.app_exe_perc, 0)

    def test_usv_exe_perc(self):
        self.assertEqual(self.period.usv_exe_perc, 0)

    def test_target_usv_inq_perc(self):
        self.assertEqual(self.period.target_usv_inq_perc, None)

    def test_target_inq_tou_perc(self):
        self.assertEqual(self.period.target_inq_tou_perc, None)

    def test_target_tou_app_perc(self):
        self.assertEqual(self.period.target_tou_app_perc, None)

    def test_target_app_exe_perc(self):
        self.assertEqual(self.period.target_app_exe_perc, None)

    def test_target_usv_exe_perc(self):
        self.assertEqual(self.period.target_usv_exe_perc, None)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, 0)

    def test_cost_per_inq(self):
        self.assertEqual(self.period.cost_per_inq, 0)

    def test_cost_per_tou(self):
        self.assertEqual(self.period.cost_per_tou, 0)

    def test_cost_per_app(self):
        self.assertEqual(self.period.cost_per_app, 0)

    def test_cost_per_exe(self):
        self.assertEqual(self.period.cost_per_exe, 0)

    def test_target_cost_per_usv(self):
        self.assertEqual(self.period.target_cost_per_usv, None)

    def test_target_cost_per_inq(self):
        self.assertEqual(self.period.target_cost_per_inq, None)

    def test_target_cost_per_tou(self):
        self.assertEqual(self.period.target_cost_per_tou, None)

    def test_target_cost_per_app(self):
        self.assertEqual(self.period.target_cost_per_app, None)

    def test_target_cost_per_exe(self):
        self.assertEqual(self.period.target_cost_per_exe, None)


class DefaultReportTestCase(TestCase):
    def setUp(self):
        project = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=19),
        )
        period = Period.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            monthly_average_rent=decimal.Decimal("0"),
            occupiable_units_start=0,
        )
        self.report = Report(project, period)

    def test_report_jsonable(self):
        from django.core.serializers.json import DjangoJSONEncoder

        jsonable = self.report.to_jsonable()
        json_string = DjangoJSONEncoder().encode(jsonable)
        self.assertTrue(json_string)

    def test_report_jsonable_is_schema_valid(self):
        import json
        import jsonschema
        from django.core.serializers.json import DjangoJSONEncoder

        schema_location = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "./PerformanceReport.schema.json",
        )

        with open(schema_location, "rt") as schema_file:
            schema = json.load(schema_file)

        jsonable = self.report.to_jsonable()
        json_string = DjangoJSONEncoder().encode(jsonable)
        decoded_jsonable = json.loads(json_string)
        jsonschema.validate(instance=decoded_jsonable, schema=schema)


class LincolnTowerPeriodTestCase(TestCase):
    """Test an example Lincoln Tower period model with computed properties."""

    def setUp(self):
        self.project = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=19),
        )
        self.raw_period = Period.objects.create(
            project=self.project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=19),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            occupiable_units_start=218,
            target_lease_percent=decimal.Decimal("0.9"),
            leases_ended=3,
            lease_renewal_notices=0,
            acq_reputation_building=decimal.Decimal("28000"),
            acq_demand_creation=decimal.Decimal("21000"),
            acq_leasing_enablement=decimal.Decimal("11000"),
            acq_market_intelligence=decimal.Decimal("7000"),
            monthly_average_rent=decimal.Decimal("7278"),
        )
        self.period = ComputedPeriod(self.raw_period)

    def test_delta_leases(self):
        self.assertEqual(self.period.delta_leases, 3)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 107)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 196)

    def test_leased_rate(self):
        self.assertEqual(self.period.leased_rate, 0.4908256880733945)

    def test_usv_inq_perc(self):
        self.assertEqual(self.period.usv_inq_perc, 0.012481644640234948)

    def test_inq_tou_perc(self):
        self.assertEqual(self.period.inq_tou_perc, 0.7254901960784313)

    def test_tou_app_perc(self):
        self.assertEqual(self.period.tou_app_perc, 0.21621621621621623)

    def test_app_exe_perc(self):
        self.assertEqual(self.period.app_exe_perc, 0.75)

    def test_investment(self):
        self.assertEqual(self.period.investment, decimal.Decimal("67000"))

    def test_estimated_revenue_gain(self):
        self.assertEqual(self.period.estimated_revenue_gain, decimal.Decimal("262008"))

    def test_romi(self):
        self.assertEqual(self.period.romi, 4)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, decimal.Decimal("16.40"))

    def test_cost_per_inq(self):
        self.assertEqual(self.period.cost_per_inq, decimal.Decimal("1313.73"))

    def test_cost_per_tou(self):
        self.assertEqual(self.period.cost_per_tou, decimal.Decimal("1810.81"))

    def test_cost_per_app(self):
        self.assertEqual(self.period.cost_per_app, decimal.Decimal("8375.00"))

    def test_cost_per_exe(self):
        self.assertEqual(self.period.cost_per_exe, decimal.Decimal("11166.67"))

    def test_report_jsonable(self):
        # CONSIDER moving this to a separate location
        report = Report(self.project, self.raw_period)
        self.assertTrue(report.to_jsonable())

