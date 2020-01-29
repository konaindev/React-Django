import json
import datetime

from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone, crypto
from parameterized import parameterized
from unittest import mock

from remark.geo.models import Address
from remark.geo.mocks import mocked_geocode
from remark.users.models import Account, User
from remark.settings import LOGIN_URL, LOGIN_REDIRECT_URL
from django.contrib.auth.tokens import PasswordResetTokenGenerator

'''
class ResetPasswordConfirmTestCase(APITestCase):
    def setUp(self) -> None:
        self.url = "/api/v1/users/reset-password-confirm/"
        self.user = User.objects.create_user(
            email="test2@test.com",
            password=crypto.get_random_string(12),
            activated=datetime.datetime.now(timezone.utc),
        )
        self.uid = urlsafe_base64_encode(force_bytes(user.pk))
        self.token_generator = PasswordResetTokenGenerator()

    def test_reset_password_confirm(self):
        data = {

        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_invalid_form(self):
        data = {

        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
'''


class ResetPasswordTestCase(APITestCase):
    def setUp(self) -> None:
        self.url = "/api/v1/users/reset-password/"
        self.user = User.objects.create_user(
            email="test2@test.com",
            password=crypto.get_random_string(12),
            activated=datetime.datetime.now(timezone.utc),
        )

    def test_reset_password(self):
        data = {
            "email": self.user.email,
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_missing_user(self):
        data = {}
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


class ChangePasswordTestCase(APITestCase):
    def setUp(self) -> None:
        self.url = "/api/v1/users/change-password/"
        self.original_password = crypto.get_random_string(12)
        self.user = User.objects.create_user(
            email="test2@test.com",
            password=self.original_password,
            activated=datetime.datetime.now(timezone.utc),
        )

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        new_password = crypto.get_random_string(12)
        data = {
            'old_password': self.original_password,
            'new_password1': new_password,
            'new_password2': new_password
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_new_passwords_dont_match(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'old_password': self.original_password,
            'new_password1': crypto.get_random_string(12),
            'new_password2': crypto.get_random_string(12)
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_original_password_doesnt_match(self):
        self.client.force_authenticate(user=self.user)
        new_password = crypto.get_random_string(12)
        data = {
            'old_password': crypto.get_random_string(12),
            'new_password1': new_password,
            'new_password2': new_password
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_no_session(self):
        new_password = crypto.get_random_string(12)
        data = {
            'old_password': self.original_password,
            'new_password1': new_password,
            'new_password2': new_password
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PasswordRulesTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test2@test.com",
            password="testpassword",
            activated=datetime.datetime.now(timezone.utc),
        )

        self.url = "/api/v1/users/password-rules/"

    def test_correct_password(self):
        data = {
            "user_id": self.user.public_id,
            "password": crypto.get_random_string(12)
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertDictEqual(response_data["errors"], {})

    def test_short_password(self):
        data = {
            "user_id": self.user.public_id,
            "password": "test"
        }
        response = self.client.post(self.url, data, "json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertDictEqual(
            response_data["errors"],
            {"password-length": True, "personal": True, "used": True}
        )


class CreatePasswordTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.com"
        )

        self.user_activated = User.objects.create_user(
            email="test2@test.com",
            password="testpassword",
            activated=datetime.datetime.now(timezone.utc),
        )

        activated_date = datetime.datetime.now(timezone.utc) - datetime.timedelta(days=11)

        self.user_expired_invite = User.objects.create_user(
            email="test3@test.com",
            password="testpassword",
            activated=activated_date,
        )

        self.url = "/api/v1/users/create-password/"

    def test_new_password(self):
        data = {
            "user_id": self.user.public_id,
            "password": crypto.get_random_string(24)
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, "response not 200")

    def test_short_password(self):
        data = {
            "user_id": self.user.public_id,
            "password": "test"
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_no_user(self):
        data = {
            "user_id": "Fake User ID",
            "password": crypto.get_random_string(24)
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_user_already_activated(self):
        data = {
            "user_id": self.user_activated.public_id,
            "password": crypto.get_random_string(24)
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_expired_invitation(self):
        data = {
            "user_id": self.user_expired_invite.public_id,
            "password": crypto.get_random_string(24)
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)


'''
    def test_get_data(self):
        v_rules = [
            {"label": "Be at least 8 characters", "key": "password-length"},
            {"label": "Contain alphabetic characters", "key": "characters"},
            {"label": "Not match personal information", "key": "personal"},
            {"label": "Not be a commonly used password", "key": "used"},
        ]
        hash = self.user.public_id
        url = reverse("users_create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["page_props"]["hash"], hash)
        self.assertEqual(response.context["page_props"]["rules"], v_rules)

    def test_get_data_logged_user(self):
        self.client.login(email="test2@test.com", password="testpassword")
        hash = self.user.public_id
        url = reverse("users_create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_REDIRECT_URL, status_code=302, target_status_code=200
        )

    def test_get_data_wrong_hash(self):
        hash = crypto.get_random_string(24)
        url = reverse("users_create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_get_data_activated_user(self):
        hash = self.user_activated.public_id
        url = reverse("users_create_password", kwargs={"hash": hash})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_set_password(self):
        hash = self.user.public_id
        url = reverse("users_create_password", kwargs={"hash": hash})
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
        url = reverse("users_create_password", kwargs={"hash": hash})
        new_password = "test1password"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )

    def test_set_password_activated_user(self):
        hash = self.user_activated.public_id
        url = reverse("users_create_password", kwargs={"hash": hash})
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
        url = reverse("users_create_password", kwargs={"hash": hash})
        new_password = "qwerty"
        data = json.dumps({"password": new_password})
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 500)
        user = User.objects.get(public_id=hash)
        self.assertFalse(user.check_password(new_password))
        response_data = response.json()
        self.assertIsNotNone(response_data["errors"])


class ValidatePasswordTestCase(APITestCase):
    url = "/users/password-rules"# reverse("users_password_rules")

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



class ResendInviteTestCase(APITestCase):
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
        url = reverse("users_resend_invite", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        mock_send_email.apply_async.assert_called()
        user = User.objects.get(public_id=user_public_id)
        self.assertEqual(user.invited, date_now)

    @mock.patch("remark.users.views.send_invite_email")
    def test_resend_invite_to_active_user(self, mock_send_email):
        user_public_id = self.user_activated.public_id
        url = reverse("users_resend_invite", kwargs={"hash": user_public_id})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )
        mock_send_email.apply_async.assert_not_called()
        user = User.objects.get(public_id=user_public_id)
        self.assertFalse(user.invited)

    @mock.patch("remark.users.views.send_invite_email")
    def test_resend_invite_wrong_hash(self, mock_send_email):
        url = reverse("users_resend_invite", kwargs={"hash": "DoesNotExist"})
        response = self.client.get(url)
        self.assertRedirects(
            response, LOGIN_URL, status_code=302, target_status_code=200
        )
        mock_send_email.apply_async.assert_not_called()


class AccountSecurityTestCase(TestCase):
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
        self.user = User.objects.create_user(
            account=account,
            email="test@test.com",
            password="testpassword",
            activated=datetime.datetime.now(timezone.utc)
        )
        self.url = reverse("account_security")
        self.client.login(email="test@test.com", password="testpassword")

    def test_email_update(self):
        data = {"email": "new@test.com"}
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(200, response.status_code)
        user = User.objects.get(public_id=self.user.public_id)
        self.assertEqual(data["email"], user.email)

    def test_password_update(self):
        data = {
            "email": "test@test.com",
            "old_password": "testpassword",
            "password": "testtesttest",
            "confirm_password": "testtesttest",
        }
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(200, response.status_code)
        user = User.objects.get(public_id=self.user.public_id)
        self.assertTrue(user.check_password(data["password"]))

    def test_set_wrong_email(self):
        data = {"email": "new@test"}
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(500, response.status_code)
        errors = response.json()
        self.assertIn("email", errors)
        self.assertIsNotNone(errors["email"])
        user = User.objects.get(public_id=self.user.public_id)
        self.assertEqual(self.user.email, user.email)

    def test_password_not_confirmed(self):
        data = {
            "email": "test@test.com",
            "old_password": "testpassword",
            "password": "testtesttest",
            "confirm_password": "bad",
        }
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(500, response.status_code)
        errors = response.json()
        self.assertIn("__all__", errors)
        self.assertEqual("New passwords don’t match.", errors["__all__"][0]["message"])
        user = User.objects.get(public_id=self.user.public_id)
        self.assertTrue(user.check_password(data["old_password"]))

    def test_old_password_not_match(self):
        data = {
            "email": "test@test.com",
            "old_password": "password",
            "password": "testtesttest",
            "confirm_password": "testtesttest",
        }
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(500, response.status_code)
        errors = response.json()
        self.assertIn("old_password", errors)
        self.assertIsNotNone(errors["old_password"])
        user = User.objects.get(public_id=self.user.public_id)
        self.assertTrue(user.check_password("testpassword"))

    @parameterized.expand([
        ["test"],
        ["password"],
        ["11111111"],
        ["test@test.com"],
    ])
    def test_wrong_password(self, password):
        data = {
            "email": "test@test.com",
            "old_password": "testpassword",
            "password": password,
            "confirm_password": password,
        }
        response = self.client.post(self.url, data, "application/json")
        self.assertEqual(500, response.status_code)
        errors = response.json()
        self.assertIn("password", errors)
        self.assertIsNotNone(errors["password"])
        user = User.objects.get(public_id=self.user.public_id)
        self.assertTrue(user.check_password("testpassword"))
        

class CompleteAccountTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@test.com", password="password"
        )
        self.client.login(email="test@test.com", password="password")

    @mock.patch("remark.users.views.geocode", side_effect=mocked_geocode)
    @mock.patch("remark.users.views.send_welcome_email.apply_async")
    def test_complete_account(self, mock_send_welcome_email, _):
        url = reverse("users_complete_account")

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
        response = self.client.post(url, data, "json")
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(public_id=self.user.public_id)
        mock_send_welcome_email.assert_called_once_with(args=(user.email,), countdown=2)
        self.assertEqual(user.person.first_name, params["first_name"])
        self.assertEqual(user.person.last_name, params["last_name"])
        self.assertEqual(user.person.email, self.user.email)

'''
