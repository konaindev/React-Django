from decimal import Decimal
import datetime

from django.test import TestCase

from .strategy import get_base_kpis_for_group, get_targets_for_group, get_base_kpis_for_project, get_targets_for_project
from remark.lib.time_series.common import KPI

# Property Aggregate Data (Used to test grouped KPIs)
P1 = {'leased_units_start': 398, 'leased_units_end': 406, 'leases_ended': 99, 'lease_applications': 160,
      'leases_executed': 108, 'lease_cds': 48, 'lease_renewal_notices': 179, 'lease_renewals': 187,
      'lease_vacation_notices': 114, 'occupiable_units_start': 471, 'occupied_units_start': 426,
      'occupied_units_end': 428, 'move_ins': 102, 'move_outs': 100, 'acq_reputation_building': Decimal('0.00'),
      'acq_demand_creation': Decimal('24810.10'), 'acq_leasing_enablement': Decimal('0.00'),
      'acq_market_intelligence': Decimal('0.00'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('11288.12'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('0.00'), 'usvs': 14333, 'inquiries': 860, 'tours': 433, 'total_units': 471,
      'average_monthly_rent': Decimal('838.7500000000000058487734716'),
      'lowest_monthly_rent': Decimal('545.0000000000000038003952810'),
      'highest_monthly_rent': Decimal('1315.000000000000009169761091'), 'start': datetime.date(2019, 1, 1),
      'end': datetime.date(2019, 7, 30)}

P2 = {'leased_units_start': 30, 'leased_units_end': 28, 'leases_ended': 2, 'lease_applications': 0,
      'leases_executed': 0, 'lease_cds': 0, 'lease_renewal_notices': 0, 'lease_renewals': 0,
      'lease_vacation_notices': 1, 'occupiable_units_start': 34, 'occupied_units_start': 32, 'occupied_units_end': 30,
      'move_ins': 0, 'move_outs': 2, 'acq_reputation_building': Decimal('3212.50'),
      'acq_demand_creation': Decimal('2484.00'), 'acq_leasing_enablement': Decimal('1120.00'),
      'acq_market_intelligence': Decimal('153.00'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('0.00'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('153.00'), 'usvs': 0, 'inquiries': 3, 'tours': 0, 'total_units': 34,
      'average_monthly_rent': Decimal('880.0000000000000014734631216'),
      'lowest_monthly_rent': Decimal('880.0000000000000014734631216'),
      'highest_monthly_rent': Decimal('880.0000000000000014734631216'), 'start': datetime.date(2019, 1, 1),
      'end': datetime.date(2019, 7, 30)}

P3 = {'leased_units_start': 209, 'leased_units_end': 211, 'leases_ended': 2, 'lease_applications': 5,
      'leases_executed': 4, 'lease_cds': 2, 'lease_renewal_notices': 0, 'lease_renewals': 0,
      'lease_vacation_notices': 4, 'occupiable_units_start': 234, 'occupied_units_start': 209,
      'occupied_units_end': 209, 'move_ins': 2, 'move_outs': 2, 'acq_reputation_building': Decimal('3212.50'),
      'acq_demand_creation': Decimal('3234.00'), 'acq_leasing_enablement': Decimal('1120.00'),
      'acq_market_intelligence': Decimal('526.50'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('0.00'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('526.50'), 'usvs': 0, 'inquiries': 19, 'tours': 9, 'total_units': 234,
      'average_monthly_rent': Decimal('880.0000000000000000000000000'),
      'lowest_monthly_rent': Decimal('880.0000000000000000000000000'),
      'highest_monthly_rent': Decimal('1155.000000000000000000000000'), 'start': datetime.date(2019, 1, 1),
      'end': datetime.date(2019, 7, 30)}

# Period Data for a Property. Used to test aggregating to larger periods of time.
T1 = {'leased_units_start': 398, 'leased_units_end': 402, 'leases_ended': 17, 'lease_applications': 32,
      'leases_executed': 21, 'lease_cds': 11, 'lease_renewal_notices': 29, 'lease_renewals': 30,
      'lease_vacation_notices': 16, 'occupiable_units_start': 471, 'occupied_units_start': 426,
      'occupied_units_end': 428, 'move_ins': 19, 'move_outs': 17, 'acq_reputation_building': Decimal('0.00'),
      'acq_demand_creation': Decimal('3903.89'), 'acq_leasing_enablement': Decimal('0.00'),
      'acq_market_intelligence': Decimal('0.00'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('2123.96'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('0.00'), 'usvs': 2396, 'inquiries': 97, 'tours': 79, 'total_units': 471,
      'average_monthly_rent': Decimal('838.75'), 'lowest_monthly_rent': Decimal('545.00'),
      'highest_monthly_rent': Decimal('1315.00'), 'start': datetime.date(2019, 1, 1), 'end': datetime.date(2019, 2, 1)}

T2 = {'leased_units_start': 402, 'leased_units_end': 399, 'leases_ended': 18, 'lease_applications': 26,
      'leases_executed': 15, 'lease_cds': 6, 'lease_renewal_notices': 21, 'lease_renewals': 25,
      'lease_vacation_notices': 22, 'occupiable_units_start': 471, 'occupied_units_start': 428,
      'occupied_units_end': 425, 'move_ins': 15, 'move_outs': 18, 'acq_reputation_building': Decimal('0.00'),
      'acq_demand_creation': Decimal('5151.95'), 'acq_leasing_enablement': Decimal('0.00'),
      'acq_market_intelligence': Decimal('0.00'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('39.00'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('0.00'), 'usvs': 2450, 'inquiries': 175, 'tours': 73, 'total_units': 471,
      'average_monthly_rent': Decimal('838.75'), 'lowest_monthly_rent': Decimal('545.00'),
      'highest_monthly_rent': Decimal('1315.00'), 'start': datetime.date(2019, 2, 1), 'end': datetime.date(2019, 3, 1)}

T3 = {'leased_units_start': 399, 'leased_units_end': 402, 'leases_ended': 13, 'lease_applications': 28,
      'leases_executed': 16, 'lease_cds': 15, 'lease_renewal_notices': 50, 'lease_renewals': 44,
      'lease_vacation_notices': 20, 'occupiable_units_start': 471, 'occupied_units_start': 425,
      'occupied_units_end': 427, 'move_ins': 15, 'move_outs': 13, 'acq_reputation_building': Decimal('0.00'),
      'acq_demand_creation': Decimal('5139.06'), 'acq_leasing_enablement': Decimal('0.00'),
      'acq_market_intelligence': Decimal('0.00'), 'ret_reputation_building': Decimal('0.00'),
      'ret_demand_creation': Decimal('4325.16'), 'ret_leasing_enablement': Decimal('0.00'),
      'ret_market_intelligence': Decimal('0.00'), 'usvs': 2779, 'inquiries': 177, 'tours': 69, 'total_units': 471,
      'average_monthly_rent': Decimal('838.75'), 'lowest_monthly_rent': Decimal('545.00'),
      'highest_monthly_rent': Decimal('1315.00'), 'start': datetime.date(2019, 3, 1), 'end': datetime.date(2019, 3, 29)}

TARGET1 = {'start': datetime.date(2019, 3, 30), 'end': datetime.date(2019, 4, 6), 'leased_rate': Decimal('0.867'),
           'lease_applications': 5, 'leases_executed': 3, 'lease_renewal_notices': 5, 'lease_renewals': 5,
           'lease_vacation_notices': 2, 'lease_cds': 1, 'delta_leases': 0, 'move_ins': 0, 'move_outs': 2,
           'occupied_units': 424, 'acq_investment': Decimal('967.65'), 'ret_investment': Decimal('524.52'), 'usvs': 279,
           'inquiries': 23, 'tours': 13}

TARGET2 = {'start': datetime.date(2019, 4, 6), 'end': datetime.date(2019, 4, 13), 'leased_rate': Decimal('0.870'),
           'lease_applications': 5, 'leases_executed': 4, 'lease_renewal_notices': 5, 'lease_renewals': 5,
           'lease_vacation_notices': 2, 'lease_cds': 1, 'delta_leases': 1, 'move_ins': 0, 'move_outs': 2,
           'occupied_units': 421, 'acq_investment': Decimal('967.65'), 'ret_investment': Decimal('524.52'), 'usvs': 279,
           'inquiries': 24, 'tours': 13}

TARGET3 = {'start': datetime.date(2019, 4, 13), 'end': datetime.date(2019, 4, 20), 'leased_rate': Decimal('0.870'),
           'lease_applications': 5, 'leases_executed': 3, 'lease_renewal_notices': 5, 'lease_renewals': 5,
           'lease_vacation_notices': 2, 'lease_cds': 1, 'delta_leases': 0, 'move_ins': 0, 'move_outs': 2,
           'occupied_units': 418, 'acq_investment': Decimal('967.65'), 'ret_investment': Decimal('524.52'), 'usvs': 279,
           'inquiries': 24, 'tours': 14}


class GroupKPITestCase(TestCase):
    def setUp(self):
        self.start = datetime.date(2019, 1, 1)
        self.end = datetime.date(2019, 7, 30)
        self.result = get_base_kpis_for_group([P1, P2, P3], self.start, self.end)

    def tearDown(self) -> None:
        pass

    def testResultExists(self):
        self.assertIsNotNone(self.result)

    def testAcqDemandCreation(self):
        expected = P1[KPI.acq_demand_creation] + P2[KPI.acq_demand_creation] + P3[KPI.acq_demand_creation]
        self.assertEqual(self.result[KPI.acq_demand_creation], expected)

    def testAverageMonthlyRent(self):
        total_units = Decimal(P1[KPI.leased_units_end]) + Decimal(P2[KPI.leased_units_end]) + Decimal(P3[KPI.leased_units_end])
        p1_value = P1[KPI.average_monthly_rent] * (Decimal(P1[KPI.leased_units_end]) / total_units)
        p2_value = P2[KPI.average_monthly_rent] * (Decimal(P2[KPI.leased_units_end]) / total_units)
        p3_value = P3[KPI.average_monthly_rent] * (Decimal(P3[KPI.leased_units_end]) / total_units)
        expected = p1_value + p2_value + p3_value

        self.assertEqual(self.result[KPI.average_monthly_rent], expected)


class GroupKPIAverageTestCase(TestCase):
    def setUp(self):
        self.start = datetime.date(2019, 1, 1)
        self.end = datetime.date(2019, 7, 30)
        self.result = get_base_kpis_for_group([P1, P2, P3], self.start, self.end, True)

    def testResultExists(self):
        self.assertIsNotNone(self.result)

    def testOccupiableUnitsStart(self):
        expected = P3[KPI.occupiable_units_start]
        self.assertEqual(self.result[KPI.occupiable_units_start], expected)


class PropertyKPITestCase(TestCase):
    def setUp(self):
        self.start = datetime.date(2019, 1, 1)
        self.end = datetime.date(2019, 3, 29)
        self.result = get_base_kpis_for_project([T1, T2, T3], self.start, self.end, skip_select=True)

    def tearDown(self) -> None:
        pass

    def testResultExists(self):
        self.assertIsNotNone(self.result)

    def testAcqDemandCreation(self):
        expected = T1[KPI.acq_demand_creation] + T2[KPI.acq_demand_creation] + T3[KPI.acq_demand_creation]
        self.assertEqual(self.result[KPI.acq_demand_creation], expected)

    def testMonthlyAverage(self):
        expected = T3[KPI.average_monthly_rent]
        self.assertEqual(self.result[KPI.average_monthly_rent], expected)

    def testLeasedUnitsStart(self):
        expected = T1[KPI.leased_units_start]
        self.assertEqual(self.result[KPI.leased_units_start], expected)


class PropertyTargetTestCase(TestCase):
    def setUp(self):
        self.start = datetime.date(2019, 3, 30)
        self.end = datetime.date(2019, 4, 20)
        self.result = get_targets_for_project([TARGET1, TARGET2, TARGET3], self.start, self.end, skip_select=True)

    def tearDown(self) -> None:
        pass

    def testResultExists(self):
        self.assertIsNotNone(self.result)

    def testOccupiedUnits(self):
        expected = TARGET3[KPI.occupied_units]
        self.assertEqual(self.result[KPI.occupied_units], expected)


class GroupTargetAverageTestCase(TestCase):
    def setUp(self):
        self.start = datetime.date(2019, 3, 30)
        self.end = datetime.date(2019, 4, 20)
        self.result = get_targets_for_group([TARGET1, TARGET2, TARGET3], self.start, self.end, average=True)

    def testOccupiedUnits(self):
        expected = TARGET2[KPI.occupied_units]
        self.assertEqual(self.result[KPI.occupied_units], expected)
