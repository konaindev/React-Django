import json
import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone, crypto

from remark.geo.models import Address
from remark.users.models import Account, User
from remark.settings import LOGIN_URL, LOGIN_REDIRECT_URL


class CreatePasswordTestCase(TestCase):
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
            account=self.account, email="test@test.com"
        )

        self.user_activated = User.objects.create_user(
            account=self.account,
            email="test2@test.com",
            password="testpassword",
            activated=datetime.datetime.now(timezone.utc),
        )

    def test_get_data(self):
        v_rules = [
            {"label": "Be at least 8 characters", "key": "password-length"},
            {"label": "Contain alphabetic characters", "key": "characters"},
            {"label": "Not match personal information", "key": "personal"},
            {"label": "Not be a commonly used password", "key": "used"},
        ]
        hash = self.user.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        validate_url = reverse("validate_password")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["page_props"]["hash"], hash)
        self.assertEqual(response.context["page_props"]["validate_url"], validate_url)
        self.assertEqual(response.context["page_props"]["rules"], v_rules)

    def test_get_data_logged_user(self):
        self.client.login(email="test2@test.com", password="testpassword")
        hash = self.user.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_REDIRECT_URL, status_code=302, target_status_code=200
        )

    def test_get_data_wrong_hash(self):
        hash = crypto.get_random_string(24)
        url = reverse("create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_get_data_activated_user(self):
        hash = self.user_activated.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_set_password(self):
        hash = self.user.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        new_password = "test1password"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(public_id=hash)
        self.assertTrue(user.check_password(new_password))
        response_data = response.json()
        self.assertEqual(response_data["redirect_url"], LOGIN_URL)

    def test_set_password_wrong_hash(self):
        hash = crypto.get_random_string(24)
        url = reverse("create_password", kwargs={"hash": hash})
        new_password = "test1password"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_set_password_activated_user(self):
        hash = self.user_activated.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        new_password = "test1password"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )
        user = User.objects.get(public_id=hash)
        self.assertFalse(user.check_password(new_password))

    def test_set_wrong_password(self):
        hash = self.user.public_id
        url = reverse("create_password", kwargs={"hash": hash})
        new_password = "qwerty"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 500)
        user = User.objects.get(public_id=hash)
        self.assertFalse(user.check_password(new_password))
        response_data = response.json()
        self.assertIsNotNone(response_data["errors"])


class ValidatePasswordTestCase(TestCase):
    url = reverse("validate_password")

    def test_correct_password(self):
        password = crypto.get_random_string(12)
        data = json.dumps({"password": password})
        response = self.client.post(self.url, data, "json")
        response_data = response.json()
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(response_data["errors"], {})

    def test_validate_password(self):
        data = json.dumps({"password": "123"})
        response = self.client.post(self.url, data, "json")
        response_data = response.json()
        self.assertDictEqual(
            response_data["errors"],
            {"password-length": True, "characters": True, "used": True},
        )
