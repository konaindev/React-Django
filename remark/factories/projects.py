import datetime
import decimal

from django.contrib.auth.models import Group

from remark.crm.models import Business
from remark.factories.geo import create_address
from remark.geo.models import Address
from remark.projects.models import Project, Fund, Property
from remark.users.models import Account, User


def create_project(
    project_name="Test project 1",
    baseline_start=datetime.date(year=2018, month=4, day=1),
    baseline_end=datetime.date(year=2019, month=3, day=29),
    account=None,
    asset_manager=None,
    property_manager=None,
    property_owner=None,
    fund=None,
    project_property=None,
    address=None,
    **kwargs,
):
    if address is None:
        address = create_address()

    if account is None:
        account = Account.objects.create(
            company_name="test", address=address, account_type=4
        )

    if asset_manager is None:
        asset_manager = Business.objects.create(
            name="Test Asset Manager", is_asset_manager=True
        )

    if property_manager is None:
        property_manager = Business.objects.create(
            name="Test Property Manager", is_property_manager=True
        )

    if property_owner is None:
        property_owner = Business.objects.create(
            name="Test Property Owner", is_property_owner=True
        )

    if fund is None:
        fund = Fund.objects.create(account=account, name="Test Fund")

    if project_property is None:
        project_property = Property.objects.create(
            name="property 1",
            average_monthly_rent=decimal.Decimal("1948"),
            lowest_monthly_rent=decimal.Decimal("1400"),
            geo_address=address,
            total_units=220,
        )

    project = Project.objects.create(
        name=project_name,
        baseline_start=baseline_start,
        baseline_end=baseline_end,
        account=account,
        asset_manager=asset_manager,
        property_manager=property_manager,
        property_owner=property_owner,
        fund=fund,
        property=project_property,
        **kwargs,
    )
    return project


def create_project_with_user(
    project_name="Test project 1", email="test@remarkably.io", **kwargs
):
    group = Group.objects.create(name=f"{project_name} view group")
    user, _ = User.objects.get_or_create(email=email)
    group.user_set.add(user)
    project = create_project(project_name, view_group=group, **kwargs)
    return project, user


def create_project_property(name="property 1", address=None, **kwargs):
    if address is None:
        address = create_address()

    params = {
        "name": name,
        "average_monthly_rent": decimal.Decimal("1948"),
        "lowest_monthly_rent": decimal.Decimal("1400"),
        "geo_address": address,
        "total_units": 220,
        **kwargs,
    }

    return Property.objects.create(**params)
