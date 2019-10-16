import datetime
import decimal
import os.path
import json
import random
import string

from django.contrib.auth.models import Group
from django.test import TestCase
from django.urls import reverse
from openpyxl import load_workbook
from io import BytesIO
from unittest import mock

from remark.crm.models import Business
from remark.geo.models import Address
from remark.users.models import Account, User
from remark.lib.metrics import BareMultiPeriod
from .models import Fund, LeaseStage, Period, Project, Property, TargetPeriod
from .reports.periods import ComputedPeriod
from .reports.performance import PerformanceReport
from .export import export_periods_to_csv, export_periods_to_excel


def create_project(project_name="project 1"):
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
        name="Test Property Owner", is_property_owner=True
    )
    fund = Fund.objects.create(account=account, name="Test Fund")
    property = Property.objects.create(
        name="property 1",
        average_monthly_rent=decimal.Decimal("0"),
        lowest_monthly_rent=decimal.Decimal("0"),
        geo_address=address,
    )
    group = Group.objects.create(name=f"{project_name} view group")
    project = Project.objects.create(
        name=project_name,
        baseline_start=datetime.date(year=2018, month=11, day=19),
        baseline_end=datetime.date(year=2018, month=12, day=26),
        account=account,
        asset_manager=asset_manager,
        property_manager=property_manager,
        property_owner=property_owner,
        fund=fund,
        property=property,
        view_group=group,
    )
    return project, group


class DefaultComputedPeriodTestCase(TestCase):
    """
    Test that all computed properties on a default Period instance
    return sane values.
    """

    def setUp(self):
        project, _ = create_project()
        stage = LeaseStage.objects.get(short_name="performance")
        raw_period = Period.objects.create(
            project=project,
            lease_stage=stage,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            leased_units_start=0,
            occupiable_units_start=0,
            occupied_units_start=0,
        )
        raw_target_period = TargetPeriod.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
        )
        multiperiod = BareMultiPeriod.from_periods([raw_period, raw_target_period])
        period = multiperiod.get_cumulative_period()
        self.period = ComputedPeriod(period)

    def test_delta_leases(self):
        self.assertEqual(self.period.delta_leases, 0)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 0)

    def test_leased_rate(self):
        self.assertEqual(self.period.leased_rate, 0)

    def test_renewal_rate(self):
        self.assertEqual(self.period.renewal_rate, 0)

    def test_lease_cd_rate(self):
        self.assertEqual(self.period.lease_cd_rate, 0)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, None)

    def test_occupied_units(self):
        self.assertEqual(self.period.occupied_units, 0)

    def test_occupancy_rate(self):
        self.assertEqual(self.period.occupancy_rate, 0)

    def test_acq_investment(self):
        self.assertEqual(self.period.acq_investment, 0)

    def test_ret_investment(self):
        self.assertEqual(self.period.ret_investment, 0)

    def test_investment(self):
        self.assertEqual(self.period.investment, 0)

    def test_estimated_acq_revenue_gain(self):
        self.assertEqual(self.period.estimated_acq_revenue_gain, 0)

    def test_estimated_ret_revenue_gain(self):
        self.assertEqual(self.period.estimated_ret_revenue_gain, 0)

    def test_acq_romi(self):
        self.assertEqual(self.period.acq_romi, 0)

    def test_ret_romi(self):
        self.assertEqual(self.period.ret_romi, 0)

    def test_romi(self):
        self.assertEqual(self.period.romi, 0)

    def test_target_investment(self):
        self.assertEqual(self.period.target_investment, None)

    def test_target_estimated_acq_revenue_gain(self):
        self.assertEqual(self.period.target_estimated_acq_revenue_gain, None)

    def test_target_estimated_ret_revenue_gain(self):
        self.assertEqual(self.period.target_estimated_ret_revenue_gain, None)

    def test_target_acq_romi(self):
        self.assertEqual(self.period.target_acq_romi, None)

    def test_target_ret_romi(self):
        self.assertEqual(self.period.target_ret_romi, None)

    def test_target_romi(self):
        self.assertEqual(self.period.target_romi, None)

    def test_usv_inq_perc(self):
        self.assertEqual(self.period.usv_inq_perc, 0)

    def test_inq_tou_perc(self):
        self.assertEqual(self.period.inq_tou_perc, 0)

    def test_tou_app_perc(self):
        self.assertEqual(self.period.tou_app_perc, 0)

    def test_app_exe_perc(self):
        self.assertEqual(self.period.app_exe_perc, 0)

    def test_usv_exe_perc(self):
        self.assertEqual(self.period.usv_exe_perc, 0)

    def test_target_usv_inq_perc(self):
        self.assertEqual(self.period.target_usv_inq_perc, None)

    def test_target_inq_tou_perc(self):
        self.assertEqual(self.period.target_inq_tou_perc, None)

    def test_target_tou_app_perc(self):
        self.assertEqual(self.period.target_tou_app_perc, None)

    def test_target_app_exe_perc(self):
        self.assertEqual(self.period.target_app_exe_perc, None)

    def test_target_usv_exe_perc(self):
        self.assertEqual(self.period.target_usv_exe_perc, None)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, 0)

    def test_cost_per_inq(self):
        self.assertEqual(self.period.cost_per_inq, 0)

    def test_cost_per_tou(self):
        self.assertEqual(self.period.cost_per_tou, 0)

    def test_cost_per_app(self):
        self.assertEqual(self.period.cost_per_app, 0)

    def test_cost_per_exe(self):
        self.assertEqual(self.period.cost_per_exe, 0)

    def test_target_cost_per_usv(self):
        self.assertEqual(self.period.target_cost_per_usv, None)

    def test_target_cost_per_inq(self):
        self.assertEqual(self.period.target_cost_per_inq, None)

    def test_target_cost_per_tou(self):
        self.assertEqual(self.period.target_cost_per_tou, None)

    def test_target_cost_per_app(self):
        self.assertEqual(self.period.target_cost_per_app, None)

    def test_target_cost_per_exe(self):
        self.assertEqual(self.period.target_cost_per_exe, None)


class DefaultReportTestCase(TestCase):
    def setUp(self):
        project, _ = create_project()
        stage = LeaseStage.objects.get(short_name="performance")
        raw_period = Period.objects.create(
            project=project,
            lease_stage=stage,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            leased_units_start=0,
            occupiable_units_start=0,
            occupied_units_start=0,
        )
        raw_target_period = TargetPeriod.objects.create(
            project=project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
        )
        multiperiod = BareMultiPeriod.from_periods([raw_period, raw_target_period])
        period = multiperiod.get_cumulative_period()
        self.report = PerformanceReport(project, period)

    def test_report_jsonable(self):
        from django.core.serializers.json import DjangoJSONEncoder

        jsonable = self.report.to_jsonable()
        json_string = DjangoJSONEncoder().encode(jsonable)
        self.assertTrue(json_string)

    def test_report_jsonable_is_schema_valid(self):
        import json
        import jsonschema
        from django.core.serializers.json import DjangoJSONEncoder

        schema_location = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "./PerformanceReport.schema.json",
        )

        with open(schema_location, "rt") as schema_file:
            schema = json.load(schema_file)

        jsonable = self.report.to_jsonable()
        json_string = DjangoJSONEncoder().encode(jsonable)
        decoded_jsonable = json.loads(json_string)
        jsonschema.validate(instance=decoded_jsonable, schema=schema)


class LincolnTowerPeriodTestCase(TestCase):
    """Test an example Lincoln Tower period model with computed properties."""

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
        asset_manager = Business.objects.create(
            name="Test Asset Manager", is_asset_manager=True
        )
        property_manager = Business.objects.create(
            name="Test Property Manager", is_property_manager=True
        )
        property_owner = Business.objects.create(
            name="Test Property Owner", is_property_owner=True
        )
        fund = Fund.objects.create(account=account, name="Test Fund")
        property = Property.objects.create(
            name="test",
            total_units=220,
            average_monthly_rent=decimal.Decimal("7278"),
            lowest_monthly_rent=decimal.Decimal("7278"),
            geo_address=address,
        )
        self.project = Project.objects.create(
            name="test",
            baseline_start=datetime.date(year=2018, month=11, day=19),
            baseline_end=datetime.date(year=2018, month=12, day=26),
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
            property=property,
        )
        stage = LeaseStage.objects.get(short_name="performance")
        self.raw_period = Period.objects.create(
            project=self.project,
            lease_stage=stage,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            occupiable_units_start=218,
            occupied_units_start=218,
            leases_ended=3,
            lease_renewal_notices=0,
            acq_reputation_building=decimal.Decimal("28000"),
            acq_demand_creation=decimal.Decimal("21000"),
            acq_leasing_enablement=decimal.Decimal("11000"),
            acq_market_intelligence=decimal.Decimal("7000"),
        )

        self.raw_target_period = TargetPeriod.objects.create(
            project=self.project,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            target_leased_rate=decimal.Decimal("0.9"),
        )

        self.raw_multiperiod = BareMultiPeriod.from_periods(
            [self.raw_period, self.raw_target_period]
        )
        self.raw_cumulative = self.raw_multiperiod.get_cumulative_period()
        self.period = ComputedPeriod(self.raw_cumulative)

    def test_delta_leases(self):
        self.assertEqual(self.period.delta_leases, 3)

    def test_leased_units(self):
        self.assertEqual(self.period.leased_units, 107)

    def test_target_leased_units(self):
        self.assertEqual(self.period.target_leased_units, 196)

    def test_total_units(self):
        # total_units should be pulled from ref property
        self.assertEqual(self.period.total_units, 220)

    def test_leased_rate(self):
        self.assertEqual(round(self.period.leased_rate, 4), 0.4864)

    def test_occupancy_rate(self):
        self.assertEqual(round(self.period.occupancy_rate, 4), 0.9909)

    def test_usv_inq_perc(self):
        self.assertEqual(self.period.usv_inq_perc, 0.012481644640234948)

    def test_inq_tou_perc(self):
        self.assertEqual(self.period.inq_tou_perc, 0.7254901960784313)

    def test_tou_app_perc(self):
        self.assertEqual(self.period.tou_app_perc, 0.21621621621621623)

    def test_app_exe_perc(self):
        self.assertEqual(self.period.app_exe_perc, 0.75)

    def test_investment(self):
        self.assertEqual(self.period.investment, decimal.Decimal("67000"))

    def test_acq_investment(self):
        self.assertEqual(self.period.acq_investment, decimal.Decimal("67000"))

    def test_acq_investment_without_leasing(self):
        self.assertEqual(
            self.period.acq_investment_without_leasing, decimal.Decimal("56000")
        )

    def test_estimated_revenue_gain(self):
        self.assertEqual(self.period.estimated_revenue_gain, decimal.Decimal("262008"))

    def test_romi(self):
        self.assertEqual(self.period.romi, 4)

    def test_cost_per_usv(self):
        self.assertEqual(self.period.cost_per_usv, decimal.Decimal("13.71"))

    def test_cost_per_inq(self):
        self.assertEqual(self.period.cost_per_inq, decimal.Decimal("1098.04"))

    def test_cost_per_tou(self):
        self.assertEqual(self.period.cost_per_tou, decimal.Decimal("1810.81"))

    def test_cost_per_app(self):
        self.assertEqual(self.period.cost_per_app, decimal.Decimal("8375.00"))

    def test_cost_per_exe(self):
        self.assertEqual(self.period.cost_per_exe, decimal.Decimal("11166.67"))

    def test_report_jsonable(self):
        # CONSIDER moving this to a separate location
        report = PerformanceReport(self.project, self.raw_cumulative)
        self.assertTrue(report.to_jsonable())


from .signals import model_percent, get_ctd_top_kpis, sort_kpis, get_ctd_rest


class PerformanceEmailSignalTestCase(TestCase):
    """Test an example performace creation."""

    def setUp(self):
        pass

    def generate_mp_json(self, selectors, value, target):
        tl_values = {}
        values = tl_values
        tl_targets = {}
        targets = tl_targets
        for x in range(len(selectors)):
            if x >= len(selectors) - 1:
                values[selectors[x]] = value
                targets[selectors[x]] = target
            else:
                values[selectors[x]] = {}
                values = values[selectors[x]]
                targets[selectors[x]] = {}
                targets = targets[selectors[x]]
        tl_values["targets"] = tl_targets
        return tl_values

    def test_model_percent_equal(self):
        selectors = ["property", "leasing", "rate"]
        target = 0.80
        value = 0.80
        json_report = self.generate_mp_json(selectors, value, target)
        result = model_percent("lease_rate", json_report)
        self.assertEqual(result, 1.0)

    def test_model_percent_less(self):
        selectors = ["property", "leasing", "rate"]
        target = 0.80
        value = 0.40
        json_report = self.generate_mp_json(selectors, value, target)
        result = model_percent("lease_rate", json_report)
        self.assertEqual(result, 0.5)

    def test_model_percent_greater(self):
        selectors = ["property", "leasing", "rate"]
        target = 0.80
        value = 0.90
        json_report = self.generate_mp_json(selectors, value, target)
        result = model_percent("lease_rate", json_report)
        self.assertEqual(result, 1.125)

    def test_model_percent_move_outs_less(self):
        selectors = ["property", "occupancy", "move_outs"]
        target = 10
        value = 12
        json_report = self.generate_mp_json(selectors, value, target)
        result = model_percent("move_outs", json_report)
        self.assertEqual(result, 10 / 12)

    def test_model_percent_move_outs_greater(self):
        selectors = ["property", "occupancy", "move_outs"]
        target = 10
        value = 8
        json_report = self.generate_mp_json(selectors, value, target)
        result = model_percent("move_outs", json_report)
        self.assertEqual(result, 1.25)

    def test_get_ctd_top_kpis(self):
        ctd_model_percent = {"move_ins": 1.0, "move_outs": 0.6}
        ctd_sorted = sort_kpis(ctd_model_percent)
        result = get_ctd_top_kpis(ctd_model_percent, ctd_sorted)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0], "move_ins")

    def test_get_ctd_top_kpis_full_set(self):
        ctd_model_percent = {
            "move_ins": 1.0,
            "usv": 1.20,
            "inq": 1.40,
            "move_outs": 0.6,
        }
        ctd_sorted = sort_kpis(ctd_model_percent)
        result = get_ctd_top_kpis(ctd_model_percent, ctd_sorted)
        self.assertEqual(len(result), 3)
        self.assertEqual(result[0], "inq")
        self.assertEqual(result[1], "usv")
        self.assertEqual(result[2], "move_ins")

    def test_get_ctd_top_kpis_empty_set(self):
        ctd_model_percent = {
            "move_ins": 0.85,
            "usv": 0.20,
            "inq": 0.40,
            "move_outs": 0.6,
        }
        ctd_sorted = sort_kpis(ctd_model_percent)
        result = get_ctd_top_kpis(ctd_model_percent, ctd_sorted)
        self.assertEqual(len(result), 0)

    def test_get_ctd_rest(self):
        ctd_model_percent = {
            "move_ins": 0.95,
            "usv": 0.20,
            "inq": 0.40,
            "move_outs": 0.8,
        }
        ctd_sorted = sort_kpis(ctd_model_percent)
        risk, low = get_ctd_rest(ctd_model_percent, ctd_sorted)
        self.assertEqual(len(risk), 1)
        self.assertEqual(risk[0], "move_outs")
        self.assertEqual(len(low), 2)
        self.assertEqual(low[0], "usv")
        self.assertEqual(low[1], "inq")


class ExportTestCase(TestCase):
    def setUp(self):
        project, _ = create_project()
        stage = LeaseStage.objects.get(short_name="performance")
        raw_period = Period.objects.create(
            project=project,
            lease_stage=stage,
            start=datetime.date(year=2018, month=12, day=19),
            end=datetime.date(year=2018, month=12, day=26),
            leased_units_start=104,
            usvs=4086,
            inquiries=51,
            tours=37,
            lease_applications=8,
            leases_executed=6,
            occupiable_units_start=218,
            occupied_units_start=218,
            leases_ended=3,
            lease_renewal_notices=0,
            acq_reputation_building=decimal.Decimal("28000"),
            acq_demand_creation=decimal.Decimal("21000"),
            acq_leasing_enablement=decimal.Decimal("11000"),
            acq_market_intelligence=decimal.Decimal("7000.0"),
        )
        self.project = project
        self.period = raw_period

    def test_export_periods_to_csv(self):
        periods_ids = [self.period.id]
        response = export_periods_to_csv(periods_ids, self.project.public_id)
        csv_str = response.content.decode("utf-8")
        result = (
            "lease_stage,start,end,includes_remarkably_effect,"
            "leased_units_start,leases_ended,lease_applications,"
            "leases_executed,lease_cds,lease_renewal_notices,"
            "lease_renewals,lease_vacation_notices,"
            "occupiable_units_start,occupied_units_start,move_ins,"
            "move_outs,acq_reputation_building,acq_demand_creation,"
            "acq_leasing_enablement,acq_market_intelligence,"
            "ret_reputation_building,ret_demand_creation,"
            "ret_leasing_enablement,ret_market_intelligence,usvs,"
            "inquiries,tours"
            "\r\nImprove Performance,2018-12-19,2018-12-26,True,104,"
            "3,8,6,0,0,0,0,218,218,0,0,28000.00,21000.00,11000.00,"
            "7000.00,0.00,0.00,0.00,0.00,4086,51,37\r\n"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(csv_str, result)

    def test_export_periods_to_excel(self):
        response = export_periods_to_excel(self.project.public_id)
        self.assertEqual(response.status_code, 200)

        response_wb = load_workbook(BytesIO(response.content))
        response_ws = response_wb["periods"]

        wb = load_workbook(filename="remark/projects/tests/periods.xlsx")
        ws_periods = wb["periods"]
        for row in range(1, response_ws.max_row + 1):
            for col in range(1, response_ws.max_column + 1):
                self.assertEqual(
                    ws_periods.cell(row=row, column=col).value,
                    response_ws.cell(row=row, column=col).value,
                )


def mocked_geocode(location):
    mock_obj = mock.MagicMock()
    mock_obj.formatted_address = "2284 W Commodore Way #200, Seattle, WA 98199, USA"
    mock_obj.street_address = "2284 W Commodore Way"
    mock_obj.city = "Seattle"
    mock_obj.state = "WA"
    mock_obj.zip5 = "98199"
    mock_obj.country = "US"
    mock_obj.geocode_json = {}
    return mock_obj


class OnboardingWorkflowTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            email="admin@remarkably.io", password="adminpassword"
        )
        project, _ = create_project()
        self.client.login(email="admin@remarkably.io", password="adminpassword")
        self.project = project

    @mock.patch("remark.users.views.geocode", side_effect=mocked_geocode)
    @mock.patch("remark.projects.views.send_invite_email")
    def test_invite_new_user(self, mock_send_email, _):
        url = reverse("add_members")
        params = {
            "projects": [{"property_id": self.project.public_id}],
            "members": [
                {
                    "label": "new.user@gmail.com",
                    "value": "new.user@gmail.com",
                    "__isNew__": True,
                }
            ],
        }
        response = self.client.post(url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        public_id = data["projects"][0]["members"][0]["user_id"]
        email = data["projects"][0]["members"][0]["email"]
        user = User.objects.get(public_id=public_id)
        self.assertEqual(email, user.email)
        self.assertFalse(user.password)
        mock_send_email.apply_async.assert_called()

        self.client.logout()
        url = reverse("create_password", kwargs={"hash": public_id})
        params = {"password": "new_user_password"}
        response = self.client.post(url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        redirect_url = reverse("complete_account")
        self.assertEqual(data["redirect_url"], redirect_url)
        user = User.objects.get(public_id=public_id)
        user.check_password(params["password"])
        self.assertTrue(user.check_password(params["password"]))

        params = {
            "first_name": "First Name",
            "last_name": "Last Name",
            "title": "Title",
            "company": "Company Name",
            "company_role": ["owner"],
            "office_address": "2284 W. Commodore Way, Suite 200",
            "office_name": "Office Name",
            "office_type": 3,
            "terms": True,
        }
        response = self.client.post(redirect_url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        user = User.objects.get(public_id=public_id)
        crm_persons = user.person_set.all()
        self.assertTrue(len(crm_persons) == 1)
        self.assertTrue(crm_persons[0].office.address)

        project = Project.objects.get(public_id=self.project.public_id)
        project_users = project.view_group.user_set.all()
        self.assertEqual(project_users[0].public_id, user.public_id)


class AutocompleteMemberTestCase(TestCase):
    @staticmethod
    def add_users_to_group(users, group):
        for user in users:
            group.user_set.add(user)

    @staticmethod
    def generate_users(start=0, end=5):
        users = []
        for i in range(start, end):
            email = f"user{i}@test.local"
            user = User.objects.create_user(email=email, password="password")
            users.append(user)
        return users

    def setUp(self):
        user = User.objects.create_user(
            email="admin@remarkably.io", password="adminpassword"
        )
        project, group = create_project()
        users = AutocompleteMemberTestCase.generate_users(0, 5)
        AutocompleteMemberTestCase.add_users_to_group(users, group)
        self.client.login(email="admin@remarkably.io", password="adminpassword")
        self.user = user
        self.group = group
        self.users = users
        self.url = reverse("members")

    def test_without_projects(self):
        params = {"value": ""}
        response = self.client.post(self.url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["members"], [])

    def test_with_project(self):
        self.group.user_set.add(self.user)
        params = {"value": ""}
        response = self.client.post(self.url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        users = [u.get_icon_dict() for u in self.users]
        self.assertCountEqual(data["members"], users)

    def test_many_projects(self):
        self.group.user_set.add(self.user)
        _, group = create_project("project 2")
        users = AutocompleteMemberTestCase.generate_users(5, 10)
        AutocompleteMemberTestCase.add_users_to_group(users, group)
        params = {"value": ""}
        response = self.client.post(self.url, json.dumps(params), "json")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        users = [u.get_icon_dict() for u in self.users]
        self.assertCountEqual(data["members"], users)
