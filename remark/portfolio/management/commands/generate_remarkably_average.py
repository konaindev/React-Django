import djclick as click
import decimal

from operator import mul, sub, truediv, add
from graphkit import compose, operation

from remark.portfolio.models import RemarkablyPortfolioAveragePeriod
from remark.projects.models import Project
from remark.projects.reports.performance import PerformanceReport
from remark.projects.reports.periods import ComputedPeriod


class FakePeriod:
    def __init__(self, start, end, values):
        self.values = values
        self.start = start
        self.end = end

    def get_value(self, name):
        return self.values[name]

    def get_values(self):
        return self.values

    def get_start(self):
        return self.start

    def get_end(self):
        return self.end


def add(attribute_name, properties):
    result = 0
    for property in properties:
        value = property[attribute_name]
        if value is not None:
            result += value
    return result


def proportional_avg(attribute_name, properties):
    total_units = add("total_units", properties)
    result = 0
    for property in properties:
        value = property[attribute_name]
        if value is not None:
            property_units = property["total_units"]
            percent_of_total = property_units / total_units if property_units is not None else 0
            if isinstance(value, decimal.Decimal):
                result += value * decimal.Decimal(percent_of_total)
            else:
                result += value * percent_of_total
    return result


SHAPE = {
   'leased_units_start': add,
   'leased_units_end': add,
   'leases_ended': add,
   'lease_applications': add,
   'leases_executed': add,
   'lease_cds': add,
   'lease_renewal_notices': add,
   'lease_renewals': add,
   'lease_vacation_notices': add,
   'occupiable_units_start': add,
   'occupied_units_start': add,
   'occupied_units_end': add,
   'move_ins': add,
   'move_outs': add,
   'acq_reputation_building': add,
   'acq_demand_creation': add,
   'acq_leasing_enablement': add,
   'acq_market_intelligence': add,
   'ret_reputation_building': add,
   'ret_demand_creation': add,
   'ret_leasing_enablement': add,
   'ret_market_intelligence': add,
   'usvs': add,
   'inquiries': add,
   'tours': add,
   'total_units': add,
   'target_lease_applications': add,
   'target_leases_executed': add,
   'target_lease_renewal_notices': add,
   'target_lease_renewals': add,
   'target_lease_vacation_notices': add,
   'target_lease_cds': add,
   'target_delta_leases': add,
   'target_move_ins': add,
   'target_move_outs': add,
   'target_occupied_units': add,
   'target_acq_investment': add,
   'target_ret_investment': add,
   'target_usvs': add,
   'target_inquiries': add,
   'target_tours': add,
   'target_leased_rate' : proportional_avg,
   'average_monthly_rent' : proportional_avg,
   'lowest_monthly_rent' : proportional_avg,
   'highest_monthly_rent' : proportional_avg
   #'acq_investment': add,
   #'delta_leases': add,
   #'investment': add,
   #'leased_units': add,
   #'occupiable_units':add,
   #'occupied_units':add,
   #'resident_decisions': add,
   #'ret_investment':add,
   #'target_investment': add,
   #'target_lease_cd_rate': proportional_avg,
   #'target_leased_units': add,
   #'target_occupiable_units': add,
   #'target_renewal_rate': proportional_avg,
   #'target_resident_decisions': add,
}

@click.command()
@click.argument("start", required=True, type=click.DateTime(formats=("%d/%m/%Y",)))
@click.argument("end", required=True, type=click.DateTime(formats=("%d/%m/%Y",)))
def command(start, end):
    _command(start, end)

def _command(start, end):
    start = start.date()
    end = end.date()

    # First check if the start and end period overlap with existing averages
    if RemarkablyPortfolioAveragePeriod.objects.filter(start=start).filter(end=end).count() > 0:
        print(f"There is already a RMB Portfolio Average for the given time period {start} - {end}")
        return

    # Iterate over all the projects to be included in the average
    reports = []
    for project in Project.objects.all():
        if PerformanceReport.has_dates(project, start, end):
            report = PerformanceReport.for_dates(project, start, end)
            raw_values = report.period.get_values()
            raw_values["project_name"] = project.name
            reports.append(raw_values)

    # Generate the aggregate total
    result = {
        "start": start,
        "end": end,
    }
    for attribute in SHAPE.keys():
        fun = SHAPE[attribute]
        result[attribute] = fun(attribute, reports)

    # Pat self on back
    computed_period = ComputedPeriod(FakePeriod(start, end, result))
    result = computed_period.get_values()

    average_period = RemarkablyPortfolioAveragePeriod()
    for attribute in result.keys():
        if hasattr(average_period, attribute):
            setattr(average_period, attribute, result[attribute])

    average_period.save()

    return average_period
