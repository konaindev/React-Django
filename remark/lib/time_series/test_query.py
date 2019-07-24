from django.test import TestCase
from datetime import date
import decimal
import factory
from django.db.models import signals

from .query import select

from remark.projects.models import Period, Project, Fund
from remark.users.models import Account
from remark.crm.models import Business
from remark.geo.models import Address


def create_project():
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
    project = Project.objects.create(
            name="test",
            baseline_start=date(year=2018, month=11, day=19),
            baseline_end=date(year=2018, month=12, day=26),
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
        )
    return project


def create_period(project, start, end):
    return Period.objects.create(
        start=start,
        end=end,
        project=project,
        leased_units_start=0,
        occupiable_units_start=0,
        occupied_units_start=0,
    )


def create_date(day):
    return date(day=day, month=1, year=2019)


class QueryDescriptionTestCase(TestCase):

    @factory.django.mute_signals(signals.post_save)
    def setUp(self) -> None:
        self.project = create_project()
        self.p1 = create_period(self.project, create_date(1), create_date(7))
        self.p2 = create_period(self.project, create_date(7), create_date(15))
        self.p3 = create_period(self.project, create_date(15), create_date(22))
        self.p4 = create_period(self.project, create_date(22), create_date(29))

    def tearDown(self) -> None:
        pass

    def testQuery(self):
        count = Period.objects.all().count()
        self.assertEqual(count, 4, "We dont have three periods")

    def testQueryOrder(self):
        start = create_date(1)
        end = create_date(29)
        query = select(Period.objects.filter(project=self.project), start, end)
        periods = list(query)
        self.assertEqual(periods[0].start.day, 1)
        self.assertEqual(periods[-1].end.day, 29)

    def testSelect(self):
        start = create_date(1)
        end = create_date(22)
        count = select(Period.objects.filter(project=self.project), start, end).count()
        self.assertEqual(count, 3)

    def testSelect2(self):
        start = create_date(7)
        end = create_date(22)
        count = select(Period.objects.filter(project=self.project), start, end).count()
        self.assertEqual(count, 2)

    def testSelectMiddle2(self):
        start = create_date(5)
        end = create_date(8)
        count = select(Period.objects.filter(project=self.project), start, end).count()
        self.assertEqual(count, 2)
