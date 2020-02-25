import datetime
import decimal

from remark.projects.models import TargetPeriod, Period, LeaseStage


def create_periods(
    project,
    start=datetime.date(year=2019, month=6, day=7),
    end=datetime.date(year=2019, month=6, day=14),
    stage="performance",
    target_period_params=None,
    period_params=None,
):
    default_target_period_params = {
        "start": start,
        "end": end,
        "target_leased_rate": decimal.Decimal("0.940"),
        "target_acq_investment": decimal.Decimal("1998.43"),
        "target_ret_investment": decimal.Decimal("790.00"),
        "target_move_ins": 6,
        "target_move_outs": 2,
        "target_lease_applications": 7,
        "target_leases_executed": 6,
        "target_lease_renewal_notices": 3,
        "target_lease_renewals": 0,
        "target_lease_vacation_notices": 2,
        "target_lease_cds": 1,
        "target_delta_leases": 4,
        "target_usvs": 480,
        "target_inquiries": 35,
        "target_tours": 13,
        "target_occupied_units": 150,
    }
    if target_period_params is not None:
        default_target_period_params.update(target_period_params)

    default_period_params = {
        "start": start,
        "end": end,
        "leased_units_start": 172,
        "leases_ended": 0,
        "leases_executed": 4,
        "occupiable_units_start": 199,
        "occupied_units_start": 164,
        "move_ins": 5,
        "move_outs": 0,
        "lease_applications": 5,
        "lease_renewal_notices": 1,
        "lease_renewals": 0,
        "lease_vacation_notices": 5,
        "lease_cds": 1,
        "usvs": 414,
        "inquiries": 36,
        "tours": 14,
        "leased_units_end": 179,
    }
    if period_params is not None:
        default_period_params.update(period_params)

    if type(stage) is str:
        stage = LeaseStage.objects.get(short_name=stage)

    target_period = TargetPeriod.objects.create(
        project=project, **default_target_period_params
    )
    period = Period.objects.create(
        project=project, lease_stage=stage, **default_period_params
    )
    return target_period, period


def generate_weekly_periods(count, project, end, period_data=lambda i: {}):
    for i in range(count):
        start = end - datetime.timedelta(weeks=1)
        create_periods(project, start=start, end=end, period_params=period_data(i))
        end = start
