import json
import datetime

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone, crypto
from unittest import mock

from remark.geo.models import Address
from remark.geo.mocks import mocked_geocode
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
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["page_props"]["hash"], hash)
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
        self.assertEqual(response_data["redirect_url"], reverse("complete_account"))

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


class SessionExpireTestCase(TestCase):
    def setUp(self):
        invited = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=11)
        self.user_expire = User.objects.create_user(
            email="test@test.com", invited=invited
        )
        self.user = User.objects.create_user(email="test2@test.com")

    def test_session_expire(self):
        user_public_id = self.user_expire.public_id
        url = reverse("session_expire", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_session_not_expire(self):
        user_public_id = self.user.public_id
        url = reverse("session_expire", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        redirect_url = reverse("create_password", kwargs={"hash": user_public_id})
        self.assertRedirects(
            response, redirect_url, status_code=302, target_status_code=200
        )

    def test_session_wrong_hash(self):
        url = reverse("session_expire", kwargs={"hash": "DoesNotExist"})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )


class ResendInviteTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="test@test.com")

        self.user_activated = User.objects.create_user(
            email="test2@test.com",
            password="testpassword",
            activated=datetime.datetime.now(timezone.utc),
        )

    @mock.patch("remark.users.views.datetime")
    @mock.patch("remark.users.views.send_invite_email")
    def test_resend_invite(self, mock_send_email, mock_datetime):
        date_now = datetime.datetime.now(timezone.utc)
        mock_datetime.datetime.now.return_value = date_now

        user_public_id = self.user.public_id
        url = reverse("resend_invite", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        mock_send_email.apply_async.assert_called()
        user = User.objects.get(public_id=user_public_id)
        self.assertEqual(user.invited, date_now)

    @mock.patch("remark.users.views.send_invite_email")
    def test_resend_invite_to_active_user(self, mock_send_email):
        user_public_id = self.user_activated.public_id
        url = reverse("resend_invite", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )
        mock_send_email.apply_async.assert_not_called()
        user = User.objects.get(public_id=user_public_id)
        self.assertFalse(user.invited)

    @mock.patch("remark.users.views.send_invite_email")
    def test_resend_invite_wrong_hash(self, mock_send_email):
        url = reverse("resend_invite", kwargs={"hash": "DoesNotExist"})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )
        mock_send_email.apply_async.assert_not_called()


class CompleteAccountTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.com", password="password"
        )
        self.client.login(email="test@test.com", password="password")

    @mock.patch("remark.users.views.geocode", side_effect=mocked_geocode)
    def test_complete_account(self, _):
        url = reverse("complete_account")
        params = {
            "first_name": "First name",
            "last_name": "Last name",
            "title": "Title",
            "company": "New Company",
            "company_role": ["owner"],
            "office_address": "2284 W. Commodore Way, Suite 200",
            "office_name": "Test office",
            "office_type": 1,
            "terms": True,
        }
        data = json.dumps(params)
        self.client.post(url, data, "json")
        user = User.objects.get(public_id=self.user.public_id)
        self.assertEqual(user.person.first_name, params["first_name"])
        self.assertEqual(user.person.last_name, params["last_name"])
        self.assertEqual(user.person.email, self.user.email)
