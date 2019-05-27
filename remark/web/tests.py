import datetime
import decimal

from django.test import TestCase
from django.urls import reverse

from remark.crm.models import Business
from remark.geo.models import Address
from remark.users.models import Account, User
from remark.projects.models import Fund, Project


class PropertyListTestCase(TestCase):
    def setUp(self):
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
        User.objects.create_user(
            account=account, email="test@test.com", password="testpassword"
        )
        self.asset_manager1 = Business.objects.create(
            name="Test Asset Manager", business_type=2, address=address
        )
        self.asset_manager2 = Business.objects.create(
            name="Test Asset Manager 2", business_type=2, address=address
        )
        self.property_manager1 = Business.objects.create(
            name="Test Property Manager", business_type=3, address=address
        )
        self.property_manager2 = Business.objects.create(
            name="Test Property Manager 2", business_type=3, address=address
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", business_type=1, address=address
        )
        self.fund = Fund.objects.create(account=account, name="Test Fund")
        Fund.objects.create(account=account, name="Test Fund")
        self.project1 = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            account=account,
            asset_manager=self.asset_manager1,
            property_manager=self.property_manager1,
            property_owner=property_owner,
            fund=self.fund,
        )
        self.project2 = Project.objects.create(
            name="project",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            account=account,
            asset_manager=self.asset_manager2,
            property_manager=self.property_manager2,
            property_owner=property_owner,
            fund=self.fund,
        )
        self.client.login(email="test@test.com", password="testpassword")

    def test_without_query(self):
        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.context["page_props"]["properties"][0]["property_name"],
            self.project1.name,
        )
        self.assertEqual(
            response.context["page_props"]["properties"][1]["property_name"],
            self.project2.name,
        )
        self.assertEqual(len(response.context["page_props"]["property_managers"]), 2)
        self.assertEqual(len(response.context["page_props"]["asset_managers"]), 2)
        self.assertEqual(len(response.context["page_props"]["funds"]), 2)

    def test_query(self):
        query = "q=tes&pm={}&pm={}&am={}&fb={}".format(
            self.property_manager1.public_id,
            self.property_manager2.public_id,
            self.asset_manager1.public_id,
            self.fund.public_id,
        )
        url = "{}?{}".format(reverse("dashboard"), query)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.context["page_props"]["properties"]), 1)
        self.assertEqual(
            response.context["page_props"]["properties"][0]["property_name"],
            self.project1.name,
        )
