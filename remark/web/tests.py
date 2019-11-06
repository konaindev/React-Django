import datetime
import decimal
import json

from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse

from unittest.mock import patch, Mock

from remark.crm.models import Business, Person, Office
from remark.geo.models import Address
from remark.users.models import Account, User
from remark.projects.models import Fund, Project, Property
from remark.web.views import DashboardView

from .models import Localization, LocalizationVersion


class PropertyListTestCase(TestCase):
    def setUp(self):
        address = Address.objects.create(
            street_address_1="2284 W. Commodore Way, Suite 200",
            city="Seattle",
            state="WA",
            zip_code=98199,
            country="US",
        )

        group1 = Group.objects.create(name="project 1 view group")
        group2 = Group.objects.create(name="project 2 view group")
        group3 = Group.objects.create(name="project 3 view group")
        admin_group1 = Group.objects.create(name="project 1 admin group")
        admin_group2 = Group.objects.create(name="project 2 admin group")
        admin_group3 = Group.objects.create(name="project 3 admin group")
        self.account = Account.objects.create(
            company_name="test", address=address, account_type=4
        )
        self.user = User.objects.create_user(
            account=self.account, email="test@test.com", password="testpassword"
        )
        admin_group1.user_set.add(self.user)
        admin_group2.user_set.add(self.user)
        self.asset_manager1 = Business.objects.create(
            name="Test Asset Manager", is_asset_manager=True
        )
        self.asset_manager2 = Business.objects.create(
            name="Test Asset Manager 2", is_asset_manager=True
        )
        self.asset_manager3 = Business.objects.create(
            name="Test Asset Manager 3", is_asset_manager=True
        )
        self.property_manager1 = Business.objects.create(
            name="Test Property Manager", is_property_manager=True
        )
        self.property_manager2 = Business.objects.create(
            name="Test Property Manager 2", is_property_manager=True
        )
        self.property_manager3 = Business.objects.create(
            name="Test Property Manager 3", is_property_manager=True
        )
        office = Office.objects.create(
            office_type=1,
            name="Office",
            address=address,
            business=self.asset_manager1,
        )
        self.person = Person.objects.create(
            first_name="Burch",
            last_name="Sill",
            role="admin",
            email="test@test.com",
            user=self.user,
            office=office,
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", is_property_owner=True
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
            name="project 1",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=self.account,
            asset_manager=self.asset_manager1,
            property_manager=self.property_manager1,
            property_owner=property_owner,
            fund=self.fund1,
            property=property1,
            view_group=group1,
            admin_group=admin_group1,
        )
        property2 = Property.objects.create(
            name="project",
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            geo_address=address,
        )
        self.project2 = Project.objects.create(
            name="project 2",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=self.account,
            asset_manager=self.asset_manager2,
            property_manager=self.property_manager2,
            property_owner=property_owner,
            fund=self.fund1,
            property=property2,
            view_group=group2,
            admin_group=admin_group2,
        )
        property3 = Property.objects.create(
            name="project",
            average_monthly_rent=decimal.Decimal("0"),
            lowest_monthly_rent=decimal.Decimal("0"),
            geo_address=address,
        )
        self.project3 = Project.objects.create(
            name="project 3",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=self.account,
            asset_manager=self.asset_manager3,
            property_manager=self.property_manager3,
            property_owner=property_owner,
            fund=self.fund2,
            property=property3,
            view_group=group3,
            admin_group=admin_group3,
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
            "funds": [{"id": self.fund1.public_id, "label": self.fund1.name}],
            "properties": [
                {
                    "address": "Seattle, WA",
                    "image_url": "",
                    "performance_rating": -1,
                    "property_id": self.project2.public_id,
                    "property_name": self.project2.name,
                    "url": "/projects/{}/market/".format(self.project2.public_id),
                    "members": [
                        {
                            "profile_image_url": "",
                            "email": self.user.email,
                            "user_id": self.user.public_id,
                            "account_name": self.person.full_name,
                            "role": self.person.role,
                        }
                    ],
                },
                {
                    "address": "Seattle, WA",
                    "image_url": "",
                    "performance_rating": -1,
                    "property_id": self.project1.public_id,
                    "property_name": self.project1.name,
                    "url": "/projects/{}/market/".format(self.project1.public_id),
                    "members": [
                        {
                            "profile_image_url": "",
                            "email": self.user.email,
                            "user_id": self.user.public_id,
                            "account_name": self.person.full_name,
                            "role": self.person.role,
                        }
                    ],
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
            "locations": [{"city": "Seattle", "label": "Seattle, WA", "state": "wa"}],
            "user": {
                "account_name": self.user.get_name(),
                "email": self.user.email,
                "logout_url": "/users/logout/",
                "account_settings_url": "/users/account-settings",
                "user_id": self.user.public_id,
                'profile_image_url': '',
                "is_superuser": self.user.is_superuser,
            },
        }

        response = self.client.get(reverse("dashboard"), HTTP_ACCEPT="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(type(response).__name__, "JsonResponse")
        response_json = response.json()
        self.assertCountEqual(response_json["asset_managers"], data["asset_managers"])
        self.assertCountEqual(response_json["funds"], data["funds"])
        self.assertCountEqual(response_json["properties"], data["properties"])
        self.assertCountEqual(
            response_json["property_managers"], data["property_managers"]
        )
        self.assertCountEqual(response_json["locations"], data["locations"])
        self.assertCountEqual(response_json["user"], data["user"])

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
            "funds": [{"id": self.fund1.public_id, "label": self.fund1.name}],
            "properties": [
                {
                    "address": "Seattle, WA",
                    "image_url": "",
                    "performance_rating": -1,
                    "property_id": self.project1.public_id,
                    "property_name": self.project1.name,
                    "url": "/projects/{}/market/".format(self.project1.public_id),
                    "members": [
                        {
                            "profile_image_url": "",
                            "email": self.user.email,
                            "user_id": self.user.public_id,
                            "account_name": self.person.full_name,
                            "role": self.person.role,
                        }
                    ],
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
            "locations": [{"city": "Seattle", "label": "Seattle, WA", "state": "wa"}],
            "user": {
                "account_name": self.user.get_name(),
                "email": self.user.email,
                "logout_url": "/users/logout/",
                "account_settings_url": "/users/account-settings",
                "user_id": self.user.public_id,
<<<<<<< HEAD
                'profile_image_url': '',
=======
                "is_superuser":  self.user.is_superuser,
>>>>>>> fd6669779bafdf97360b34ce540173ad22531220
            },
        }

        query = (
            f"q=project&pm={self.property_manager1.public_id}"
            f"&pm={self.property_manager2.public_id}"
            f"&am={self.asset_manager1.public_id}"
            f"&fb={self.fund1.public_id}"
        )
        url = f"{reverse('dashboard')}?{query}"
        response = self.client.get(url, HTTP_ACCEPT="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(type(response).__name__, "JsonResponse")
        response_json = response.json()
        self.assertCountEqual(response_json["asset_managers"], data["asset_managers"])
        self.assertCountEqual(response_json["funds"], data["funds"])
        self.assertCountEqual(response_json["properties"], data["properties"])
        self.assertCountEqual(
            response_json["property_managers"], data["property_managers"]
        )
        self.assertCountEqual(response_json["locations"], data["locations"])
        self.assertCountEqual(response_json["user"], data["user"])


class TestDashboardView(TestCase):
    def test_calling_access_cache(self):
        with patch('remark.lib.cache.access_cache') as cache_mock:
            dashboard = DashboardView()
            dashboard.get_project_details(Mock(), Mock())
            cache_mock.assert_called_once()
            dashboard.get_user_filter_options(Mock())
            self.assertEqual(cache_mock.call_count, 2)


class LocalizationTestCase(TestCase):
    def setUp(self):
        self.localization_version = "loc_123456"
        Localization.objects.create(
            key="test",
            en_us="String for test",
        )
        en_version = LocalizationVersion.objects.get(language="en_us")
        en_version.version = self.localization_version
        en_version.save()
        LocalizationVersion.objects.create(
            language="fr",
            version=self.localization_version,
        )

    def test_add_string(self):
        Localization.objects.create(key="new", en_us="New string")
        version_en = LocalizationVersion.objects.get(language="en_us")
        version_fr = LocalizationVersion.objects.get(language="fr")
        self.assertNotEqual(version_en.version, self.localization_version)
        self.assertNotEqual(version_fr.version, self.localization_version)

    def test_update_string(self):
        localization = Localization.objects.get(key="test")
        localization.en_us = "New string"
        localization.save()
        version_en = LocalizationVersion.objects.get(language="en_us")
        version_fr = LocalizationVersion.objects.get(language="fr")
        self.assertNotEqual(version_en.version, self.localization_version)
        self.assertEqual(version_fr.version, self.localization_version)

    def test_get_localization(self):
        url = reverse("localization")
        data = json.dumps({
            "version": self.localization_version,
            "language": "en_us",
        })
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 208)
        response_json = response.json()
        self.assertEqual(response_json["ok"], True)
        self.assertEqual(response_json["data"]["language"], "en_us")
        self.assertEqual(response_json["data"]["version"], self.localization_version)
        self.assertEqual(response_json["data"]["strings"], {})

    def test_get_localization_without_version(self):
        url = reverse("localization")
        data = json.dumps({
            "language": "en_us",
        })
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(response_json["ok"], True)
        self.assertEqual(response_json["data"]["language"], "en_us")
        self.assertEqual(response_json["data"]["version"], self.localization_version)
        self.assertEqual(response_json["data"]["strings"]["test"], "String for test")

    def test_get_localization_with_old_version(self):
        url = reverse("localization")
        data = json.dumps({
            "version": "old_version",
            "language": "en_us",
        })
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(response_json["ok"], True)
        self.assertEqual(response_json["data"]["language"], "en_us")
        self.assertEqual(response_json["data"]["version"], self.localization_version)
        self.assertEqual(response_json["data"]["strings"]["test"], "String for test")

    def test_get_localization_without_params(self):
        url = reverse("localization")
        data = json.dumps({})
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 200)
        response_json = response.json()
        self.assertEqual(response_json["ok"], True)
        self.assertEqual(response_json["data"]["language"], "en_us")
        self.assertEqual(response_json["data"]["version"], self.localization_version)
        self.assertEqual(response_json["data"]["strings"]["test"], "String for test")

    def test_get_localization_wrong_language(self):
        url = reverse("localization")
        data = json.dumps({
            "language": "jp",
        })
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 500)
