import os

from copy import copy
from django.core import mail
from django.test import TestCase
from django.urls import reverse

from remark.geo.models import Address
from remark.users.models import Account, User

from .models import ProductInquiry


'''
class AddProductInquiryTestCase(TestCase):
    test_data = {
        "property_name": "name",
        "product_type": "accelerate",
        "street_address_1": "2284 W. Commodore Way, Suite 200",
        "city": "Seattle",
        "state": "WA",
        "zip_code": "98199",
    }

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

        self.url = reverse("new_product_inquiry")
        self.current_dir = os.path.dirname(os.path.abspath(__file__))
        self.file_path = os.path.join(self.current_dir, "test_files/star.png")

    def test_with_correct_data(self):
        data = copy(self.test_data)
        self.client.login(email="test@test.com", password="testpassword")
        with open(self.file_path, "rb") as image:
            data["building_photo"] = image
            r = self.client.post(self.url, data)

        self.assertEqual(200, r.status_code)

        product_list = ProductInquiry.objects.all()
        self.assertEqual(1, len(product_list))

        product = product_list[0]
        self.assertEqual(self.user, product.user)
        self.assertEqual(data["property_name"], product.property_name)
        self.assertEqual(data["product_type"], product.product_type)
        self.assertIsNotNone(product.building_photo)

        address = product.address
        self.assertEqual(data["street_address_1"], address.street_address_1)
        self.assertEqual(data["city"], address.city)
        self.assertEqual(data["state"], address.state)
        self.assertEqual(data["zip_code"], address.zip_code)
        self.assertEqual("US", address.country)

        self.assertEqual(1, len(mail.outbox))

    def test_with_empty_data(self):
        self.client.login(email="test@test.com", password="testpassword")
        r = self.client.post(self.url, {})
        self.assertEqual(400, r.status_code)

    def test_with_anonymous_user(self):
        data = copy(self.test_data)
        r = self.client.post(self.url, data)
        self.assertEqual(302, r.status_code)

'''
