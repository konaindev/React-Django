import datetime
import decimal

from django.test import TestCase
from django.urls import reverse

from remark.crm.models import Business
from remark.geo.models import Address
from remark.users.models import Account, User
from remark.projects.models import Fund, Project, Property


class PropertyListTestCase(TestCase):
    def setUp(self):
        address = Address.objects.create(
            street_address_1="2284 W. Commodore Way, Suite 200",
            city="Seattle",
            state="WA",
            zip_code=98199,
            country="US",
        )

        self.account = Account.objects.create(
            company_name="test", address=address, account_type=4
        )
        self.user = User.objects.create_user(
            account=self.account, email="test@test.com", password="testpassword"
        )
        self.asset_manager1 = Business.objects.create(
            name="Test Asset Manager", business_type=2
        )
        self.asset_manager2 = Business.objects.create(
            name="Test Asset Manager 2", business_type=2
        )
        self.property_manager1 = Business.objects.create(
            name="Test Property Manager", business_type=3
        )
        self.property_manager2 = Business.objects.create(
            name="Test Property Manager 2", business_type=3
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", business_type=1
        )
        self.fund1 = Fund.objects.create(account=self.account, name="Test Fund 1")
        self.fund2 = Fund.objects.create(account=self.account, name="Test Fund 2")
        property1 = Property.objects.create(
            name="test",
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            geo_address=address,
        )
        self.project1 = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=self.account,
            asset_manager=self.asset_manager1,
            property_manager=self.property_manager1,
            property_owner=property_owner,
            fund=self.fund1,
            property=property1,
        )
        property2 = Property.objects.create(
            name="project",
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            geo_address=address,
        )
        self.project2 = Project.objects.create(
            name="project",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=self.account,
            asset_manager=self.asset_manager2,
            property_manager=self.property_manager2,
            property_owner=property_owner,
            fund=self.fund1,
            property=property2,
        )
        self.client.login(email="test@test.com", password="testpassword")

    def test_without_query(self):
        data = {
            "asset_managers": [
                {
                    "id": self.asset_manager1.public_id,
                    "label": self.asset_manager1.name,
                },
                {
                    "id": self.asset_manager2.public_id,
                    "label": self.asset_manager2.name,
                },
            ],
            "funds": [
                {"id": self.fund1.public_id, "label": self.fund1.name},
            ],
            "properties": [
                {
                    "address": "Seattle, WA",
                    "image_url": None,
                    "performance_rating": -1,
                    "property_id": self.project2.public_id,
                    "property_name": self.project2.name,
                    "url": "/projects/{}/baseline/".format(self.project2.public_id),
                },
                {
                    "address": "Seattle, WA",
                    "image_url": None,
                    "performance_rating": -1,
                    "property_id": self.project1.public_id,
                    "property_name": self.project1.name,
                    "url": "/projects/{}/baseline/".format(self.project1.public_id),
                },
            ],
            "property_managers": [
                {
                    "id": self.property_manager1.public_id,
                    "label": self.property_manager1.name,
                },
                {
                    "id": self.property_manager2.public_id,
                    "label": self.property_manager2.name,
                },
            ],
            "locations": [{"city": "Seattle", "label": ("Seattle, WA",), "state": "wa"}],
            "user": {
                "account_id": self.account.id,
                "account_name": self.account.company_name,
                "email": self.user.email,
                "logout_url": "/users/logout/",
                "user_id": self.user.public_id,
            },
        }

        response = self.client.get(reverse("dashboard"))
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(
            response.context["page_props"]["asset_managers"], data["asset_managers"]
        )
        self.assertCountEqual(response.context["page_props"]["funds"], data["funds"])
        self.assertCountEqual(
            response.context["page_props"]["properties"], data["properties"]
        )
        self.assertCountEqual(
            response.context["page_props"]["property_managers"],
            data["property_managers"],
        )
        self.assertCountEqual(
            response.context["page_props"]["locations"], data["locations"]
        )
        self.assertCountEqual(response.context["page_props"]["user"], data["user"])

    def test_query(self):
        data = {
            "asset_managers": [
                {
                    "id": self.asset_manager1.public_id,
                    "label": self.asset_manager1.name,
                },
                {
                    "id": self.asset_manager2.public_id,
                    "label": self.asset_manager2.name,
                },
            ],
            "funds": [
                {"id": self.fund1.public_id, "label": self.fund1.name},
            ],
            "properties": [
                {
                    "address": "Seattle, WA",
                    "image_url": None,
                    "performance_rating": -1,
                    "property_id": self.project1.public_id,
                    "property_name": self.project1.name,
                    "url": "/projects/{}/baseline/".format(self.project1.public_id),
                }
            ],
            "property_managers": [
                {
                    "id": self.property_manager1.public_id,
                    "label": self.property_manager1.name,
                },
                {
                    "id": self.property_manager2.public_id,
                    "label": self.property_manager2.name,
                },
            ],
            "locations": [{"city": "Seattle", "label": ("Seattle, WA",), "state": "wa"}],
            "user": {
                "account_id": self.account.id,
                "account_name": self.account.company_name,
                "email": self.user.email,
                "logout_url": "/users/logout/",
                "user_id": self.user.public_id,
            },
        }

        query = "q=tes&pm={}&pm={}&am={}&fb={}".format(
            self.property_manager1.public_id,
            self.property_manager2.public_id,
            self.asset_manager1.public_id,
            self.fund1.public_id,
        )
        url = "{}?{}".format(reverse("dashboard"), query)
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertCountEqual(
            response.context["page_props"]["asset_managers"], data["asset_managers"]
        )
        self.assertCountEqual(response.context["page_props"]["funds"], data["funds"])
        self.assertCountEqual(
            response.context["page_props"]["properties"], data["properties"]
        )
        self.assertCountEqual(
            response.context["page_props"]["property_managers"],
            data["property_managers"],
        )
        self.assertCountEqual(
            response.context["page_props"]["locations"], data["locations"]
        )
        self.assertCountEqual(response.context["page_props"]["user"], data["user"])
