import datetime
import decimal
import unittest

from remark.crm.models import Business
from remark.geo.models import Address
from remark.projects.models import (
    Project,
    Fund,
    TargetPeriod,
    Period,
    Property,
    LeaseStage,
)
from remark.users.models import Account

from .lease_rate_against_model import LeaseRateAgainstModel


class LeaseRateAgainstModelTestCase(unittest.TestCase):
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
            name="property 1",
            average_monthly_rent=decimal.Decimal("1948"),
            lowest_monthly_rent=decimal.Decimal("1400"),
            geo_address=address,
            total_units=220,
        )
        project = Project.objects.create(
            name="project 1",
            baseline_start=datetime.date(year=2019, month=5, day=11),
            baseline_end=datetime.date(year=2019, month=5, day=18),
            account=account,
            asset_manager=asset_manager,
            property_manager=property_manager,
            property_owner=property_owner,
            fund=fund,
            property=property,
        )
        stage = LeaseStage.objects.get(short_name="performance")
        start1 = datetime.date(year=2019, month=6, day=11)
        end1 = datetime.date(year=2019, month=6, day=18)
        TargetPeriod.objects.create(
            project=project,
            start=start1,
            end=end1,
            target_leased_rate=decimal.Decimal("0.940"),
            target_occupied_units=190,
            target_move_ins=6,
            target_move_outs=2,
            target_lease_applications=7,
            target_leases_executed=6,
            target_lease_renewal_notices=3,
            target_lease_renewals=0,
            target_lease_vacation_notices=2,
            target_lease_cds=1,
            target_delta_leases=4,
            target_acq_investment=decimal.Decimal("1998.43"),
            target_ret_investment=decimal.Decimal("790.00"),
            target_usvs=480,
            target_inquiries=35,
            target_tours=13,
        )
        Period.objects.create(
            project=project,
            lease_stage=stage,
            start=start1,
            end=end1,
            leased_units_start=172,
            leases_ended=0,
            leases_executed=4,
            occupiable_units_start=199,
            occupied_units_start=164,
            move_ins=5,
            move_outs=0,
            lease_applications=5,
            lease_renewal_notices=1,
            lease_renewals=0,
            lease_vacation_notices=5,
            lease_cds=1,
            usvs=414,
            inquiries=36,
            tours=14,
            leased_units_end=179,
            occupied_units_end=169,
        )

        start2 = datetime.date(year=2019, month=6, day=19)
        end2 = datetime.date(year=2019, month=6, day=26)
        TargetPeriod.objects.create(
            project=project,
            start=start2,
            end=end2,
            target_leased_rate=decimal.Decimal("0.95"),
            target_occupied_units=190,
            target_move_ins=6,
            target_move_outs=2,
            target_lease_applications=7,
            target_leases_executed=6,
            target_lease_renewal_notices=3,
            target_lease_renewals=0,
            target_lease_vacation_notices=2,
            target_lease_cds=1,
            target_delta_leases=4,
            target_acq_investment=decimal.Decimal("1998.43"),
            target_ret_investment=decimal.Decimal("790.00"),
            target_usvs=480,
            target_inquiries=35,
            target_tours=13,
        )
        Period.objects.create(
            project=project,
            lease_stage=stage,
            start=start2,
            end=end2,
            leased_units_start=172,
            leases_ended=0,
            leases_executed=4,
            occupiable_units_start=199,
            occupied_units_start=164,
            move_ins=5,
            move_outs=0,
            lease_applications=5,
            lease_renewal_notices=1,
            lease_renewals=0,
            lease_vacation_notices=5,
            lease_cds=1,
            usvs=414,
            inquiries=36,
            tours=14,
            leased_units_end=176,
            occupied_units_end=169,
        )

        self.project = project
        self.start1 = start1
        self.end1 = end1
        self.end2 = end2

    def test_one_period(self):
        lease_rate_against_model = LeaseRateAgainstModel(1)
        name, text = lease_rate_against_model.evaluate(
            self.project.public_id, self.start1, self.end1
        )
        expected_name = ["Leased Rate against Model"]
        expected_text = f"Property is 90% Leased against period target of 94%," \
                        f" assessed as On Track."
        self.assertCountEqual(name, expected_name)
        self.assertEqual(text, expected_text)

    def test_multi_period(self):
        lease_rate_against_model = LeaseRateAgainstModel(1)
        name, text = lease_rate_against_model.evaluate(
            self.project.public_id, self.start1, self.end2
        )
        expected_name = ["Leased Rate against Model"]
        expected_text = f"Property is 88% Leased against period target of 94%," \
                        f" assessed as At Risk."
        self.assertCountEqual(name, expected_name)
        self.assertEqual(text, expected_text)

    def test_without_period(self):
        lease_rate_against_model = LeaseRateAgainstModel(1)
        result = lease_rate_against_model.evaluate(
            self.project.public_id,
            datetime.date(year=2019, month=5, day=19),
            datetime.date(year=2019, month=5, day=26)
        )
        self.assertEqual(result, None)
