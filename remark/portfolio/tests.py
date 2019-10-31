from datetime import datetime, date
import decimal

from django.contrib.auth.models import Group
from django.test import TestCase, SimpleTestCase

from remark.portfolio.api.strategy import calc_occupied_units
from remark.projects.models import (
    Project,
    Period,
    Fund,
    Property,
    TargetPeriod,
    LeaseStage,
)
from remark.geo.models import Address
from remark.crm.models import Business
from remark.projects.reports.selectors import PerformanceReportSelector
from remark.users.models import Account, User
from remark.lib.time_series.common import KPI

from .api.table_data import get_table_structure


def query_for_periods(project, start, end):
    p1 = Period.objects.filter(project=project).filter(start__lte=start).order_by("start").first()
    print(p1)
    return p1


class PortfolioTestCase(TestCase):
    def setup(self):
        address = Address.objects.create(
            street_address_1="2284 W. Commodore Way, Suite 200",
            city="Seattle",
            state="WA",
            zip_code=98199,
            country="US",
        )
        account = Account.objects.create(
            company_name="test", address=address, account_type=4
        )
        asset_manager = Business.objects.create(
            name="Test Asset Manager", business_type=2
        )
        property_manager = Business.objects.create(
            name="Test Property Manager", business_type=3
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", business_type=1
        )
        fund = Fund.objects.create(account=account, name="Test Fund")
        self.project = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            average_monthly_rent=decimal.Decimal("7278"),
            lowest_monthly_rent=decimal.Decimal("7278"),
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
            total_units=220,
        )
        self.raw_period = Period.objects.create(
            project=self.project,
            start=datetime.date(year=2019, month=5, day=1),
            end=datetime.date(year=2019, month=5, day=7),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            occupiable_units_start=218,
            occupied_units_start=218,
            leases_ended=3,
            lease_renewal_notices=0,
            acq_reputation_building=decimal.Decimal("28000"),
            acq_demand_creation=decimal.Decimal("21000"),
            acq_leasing_enablement=decimal.Decimal("11000"),
            acq_market_intelligence=decimal.Decimal("7000"),
        )
        self.raw_period.save()

    def tearDown(self):
        pass

    def testCheck(self):
        project = Project.objects.all().first()
        start = datetime(year=2019, month=5, day=1)
        end = datetime(year=2019, month=6, day=1)
        result = query_for_periods(project, start, end)
        print(result)


class TableDataTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            email="admin@remarkably.io", password="adminpassword"
        )
        address = Address.objects.create(
            street_address_1="2284 W. Commodore Way, Suite 200",
            city="Seattle",
            state="WA",
            zip_code=98199,
            country="US",
        )
        account = Account.objects.create(
            company_name="test", address=address, account_type=4
        )
        asset_manager = Business.objects.create(
            name="Test Asset Manager", is_asset_manager=True
        )
        property_manager = Business.objects.create(
            name="Test Property Manager", is_property_manager=True
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", is_property_owner=True
        )
        fund = Fund.objects.create(account=account, name="Test Fund")
        property = Property.objects.create(
            name="property 1",
            average_monthly_rent=decimal.Decimal("1948"),
            lowest_monthly_rent=decimal.Decimal("1400"),
            geo_address=address,
        )
        group = Group.objects.create(name="project 1 view group")
        group.user_set.add(user)
        project = Project.objects.create(
            name="project 1",
            baseline_start=date(year=2019, month=2, day=12),
            baseline_end=date(year=2019, month=4, day=16),
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
            property=property,
            view_group=group,
        )
        stage = LeaseStage.objects.get(short_name="performance")

        TargetPeriod.objects.create(
            project=project,
            start=date(year=2019, month=6, day=11),
            end=date(year=2019, month=6, day=18),
            target_leased_rate=decimal.Decimal("0.940"),
            target_occupied_units=190,
            target_move_ins=6,
            target_move_outs=2,
            target_lease_applications=7,
            target_leases_executed=6,
            target_lease_renewal_notices=3,
            target_lease_renewals=0,
            target_lease_vacation_notices=2,
            target_lease_cds=1,
            target_delta_leases=4,
            target_acq_investment=decimal.Decimal("1998.43"),
            target_ret_investment=decimal.Decimal("790.00"),
            target_usvs=480,
            target_inquiries=35,
            target_tours=13,
        )
        TargetPeriod.objects.create(
            project=project,
            start=date(year=2019, month=6, day=18),
            end=date(year=2019, month=6, day=25),
            target_leased_rate=decimal.Decimal("0.955"),
            target_occupied_units=193,
            target_move_ins=6,
            target_move_outs=3,
            target_lease_applications=7,
            target_leases_executed=6,
            target_lease_renewal_notices=0,
            target_lease_renewals=3,
            target_lease_vacation_notices=2,
            target_lease_cds=1,
            target_delta_leases=3,
            target_acq_investment=decimal.Decimal("1998.43"),
            target_ret_investment=decimal.Decimal("790.00"),
            target_usvs=480,
            target_inquiries=35,
            target_tours=13,
        )

        Period.objects.create(
            project=project,
            lease_stage=stage,
            start=date(year=2019, month=6, day=4),
            end=date(year=2019, month=6, day=11),
            leased_units_start=172,
            leases_ended=0,
            leases_executed=4,
            occupiable_units_start=199,
            occupied_units_start=164,
            move_ins=5,
            move_outs=0,
            lease_applications=5,
            lease_renewal_notices=1,
            lease_renewals=0,
            lease_vacation_notices=5,
            lease_cds=1,
            usvs=414,
            inquiries=36,
            tours=14,
            leased_units_end=0,
            occupied_units_end=169,
        )
        Period.objects.create(
            project=project,
            lease_stage=stage,
            start=date(year=2019, month=6, day=11),
            end=date(year=2019, month=6, day=18),
            leased_units_start=176,
            leases_ended=1,
            leases_executed=8,
            occupiable_units_start=199,
            occupied_units_start=169,
            move_ins=8,
            move_outs=1,
            lease_applications=8,
            lease_renewal_notices=3,
            lease_renewals=3,
            lease_vacation_notices=8,
            lease_cds=0,
            usvs=381,
            inquiries=34,
            tours=23,
            leased_units_end=1,
            occupied_units_end=176,
        )

        self.user = user
        self.project = project
        self.property = property
        self.start = date(year=2019, month=6, day=11)
        self.end = date(year=2019, month=6, day=17)

    def test_get_table_structure(self):
        kpis = [KPI.leased_rate, KPI.renewal_rate, KPI.occupancy_rate]

        table_data, portfolio_average = get_table_structure(
            self.user, self.start, self.end, kpis, True
        )
        # TODO: Add more metrics
        self.assertTrue(table_data[0]["targets"]["occupancy_rate"] <= 1)

    # TODO: move to remark/projects/reports
    def test_get_report_data(self):
        report_span = (
            f"{self.start.strftime('%Y-%m-%d')},{self.end.strftime('%Y-%m-%d')}"
        )
        selector = PerformanceReportSelector(
            project=self.project, report_span=report_span
        )
        report = selector.get_report_data()
        # TODO: Add more metrics
        self.assertTrue(report["targets"]["property"]["occupancy"]["rate"] <= 1)


class CalcOccupiedUnitsTestCase(SimpleTestCase):
    def setUp(self):
        self.item = {
            "acq_investment": decimal.Decimal("1269.83"),
            "delta_leases": 1,
            "inquiries": 17,
            "lease_applications": 4,
            "lease_cds": 1,
            "lease_renewal_notices": 2,
            "lease_renewals": 2,
            "lease_vacation_notices": 1,
            "leased_rate": decimal.Decimal("0.817"),
            "leases_executed": 3,
            "move_ins": 3,
            "move_outs": 1,
            "occupied_units": 209,
            "ret_investment": decimal.Decimal("37.54"),
            "tours": 11,
            "usvs": 116,
            "start": date(2019, 6, 10),
            "end": date(2019, 6, 20),
        }

    def test_date_in_middle(self):
        when = date(2019, 6, 15)
        left, right = calc_occupied_units(self.item, None, when)
        self.assertEqual(left, 208)
        self.assertEqual(right, 209)

    def test_date_equals_start(self):
        when = date(2019, 6, 10)
        left, right = calc_occupied_units(self.item, None, when)
        self.assertEqual(left, 209)
        self.assertEqual(right, 209)

    def test_next_date_after_start(self):
        when = date(2019, 6, 11)
        left, right = calc_occupied_units(self.item, None, when)
        self.assertEqual(left, 209)
        self.assertEqual(right, 209)

    def test_date_before_end(self):
        when = date(2019, 6, 19)
        left, right = calc_occupied_units(self.item, None, when)
        self.assertEqual(left, 207)
        self.assertEqual(right, 209)
