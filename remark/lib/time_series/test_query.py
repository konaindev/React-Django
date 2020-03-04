from django.test import TestCase
from datetime import date
import decimal
import factory
from django.db.models import signals

from .query import select

from remark.projects.models import Campaign, Fund, LeaseStage, Period, Project, Property
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
        name="Test Asset Manager", is_asset_manager=True
    )
    property_manager = Business.objects.create(
        name="Test Property Manager", is_property_manager=True
    )
    property_owner = Business.objects.create(
        name="Test Property Owner", is_property_manager=True
    )
    fund = Fund.objects.create(account=account, name="Test Fund")
    property = Property.objects.create(
        geo_address=address,
        average_monthly_rent=decimal.Decimal("0"),
        lowest_monthly_rent=decimal.Decimal("0"),
    )
    project_name = "test"
    project = Project.objects.create(
            name=project_name,
            property=property,
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
        )
    Campaign.objects.create(
        name=f"Campaign for {project_name}",
        baseline_start=date(year=2018, month=11, day=19),
        baseline_end=date(year=2018, month=12, day=26),
        project=project,
    )
    return project


def create_period(project, start, end):
    stage = LeaseStage.objects.get(short_name="performance")
    return Period.objects.create(
        start=start,
        end=end,
        project=project,
        lease_stage=stage,
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
        periods = select(Period.objects.filter(project=self.project), start, end)
        self.assertEqual(periods[0].start.day, 1)
        self.assertEqual(periods[-1].end.day, 29)

    def testSelect(self):
        start = create_date(1)
        end = create_date(22)
        periods = select(Period.objects.filter(project=self.project), start, end)
        self.assertEqual(len(periods), 3)

    def testSelect2(self):
        start = create_date(7)
        end = create_date(22)
        periods = select(Period.objects.filter(project=self.project), start, end)
        self.assertEqual(len(periods), 2)

    def testSelectMiddle2(self):
        start = create_date(5)
        end = create_date(8)
        periods = select(Period.objects.filter(project=self.project), start, end)
        self.assertEqual(len(periods), 2)

