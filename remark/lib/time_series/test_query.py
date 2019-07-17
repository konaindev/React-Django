from django.test import TestCase

from .query import select

from remark.projects.models import Period


class QueryDescriptionTestCase(TestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def testSelect(self):
        base_query = Period.objects.filter()
