from datetime import timedelta, datetime
import decimal

from django.test import TestCase
from mock import patch, Mock

from remark.portfolio.management.commands.generate_remarkably_average import _command

from remark.portfolio.models import RemarkablyPortfolioAveragePeriod
from remark.projects.models import Project, Period, Fund
from remark.geo.models import Address
from remark.crm.models import Business
from remark.users.models import Account
from remark.projects.reports.performance import PerformanceReport


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

