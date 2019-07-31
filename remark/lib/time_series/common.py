
from remark.lib.math import d_quant_currency, round_or_none

class BaseKPI:

    # Lease
    leases_ended = "leases_ended"
    leased_units_end = "leased_units_end"
    leased_units_start = "leased_units_start"
    lease_renewal_notices = "lease_renewal_notices"
    lease_renewals = "lease_renewals"
    lease_vacation_notices = "lease_vacation_notices"

    # Activity
    move_outs = "move_outs"
    move_ins = "move_ins"
    occupied_units_end = "occupied_units_end" # Point Metric
    occupied_units_start = "occupied_units_start" # Point Metric
    occupiable_units_start = "occupiable_units_start" # Point Metric

    # Cancellations & Denials
    lease_cds = "lease_cds"

    # Investment
    acq_reputation_building = "acq_reputation_building"
    acq_demand_creation = "acq_demand_creation"
    acq_leasing_enablement = "acq_leasing_enablement"
    acq_market_intelligence = "acq_market_intelligence"
    ret_reputation_building = "ret_reputation_building"
    ret_demand_creation = "ret_demand_creation"
    ret_leasing_enablement = "ret_leasing_enablement"
    ret_market_intelligence = "ret_market_intelligence"

    # Rent
    average_monthly_rent = "average_monthly_rent"
    lowest_monthly_rent = "lowest_monthly_rent"
    highest_monthly_rent = "highest_monthly_rent"

    # Funnel Volumes
    usvs = "usvs"
    inquiries = "inquiries"
    tours = "tours"
    lease_applications = "lease_applications"
    leases_executed = "leases_executed"


class KPI(BaseKPI):
    '''
    Helper class to provide KPI as statically checkable field names
    '''

    # Leasing
    delta_leases = "delta_leases"
    occupiable_units = "occupiable_units"
    leased_units = "leased_units"
    leased_rate = "leased_rate"
    renewal_rate = "renewal_rate"
    lease_cd_rate = "lease_cd_rate"
    resident_decisions = "resident_decisions"

    # Activity
    occupancy_rate = "occupancy_rate"
    occupied_units = "occupied_units"

    # Investment
    acq_investment = "acq_investment"
    ret_investment = "ret_investment"
    investment = "investment"

    # Revenue
    estimated_acq_revenue_gain = "estimated_acq_revenue_gain"
    estimated_ret_revenue_gain = "estimated_ret_revenue_gain"
    estimated_revenue_gain = "estimated_revenue_gain"

    # ROMI
    romi = "romi"
    ret_romi = "ret_romi"
    acq_romi = "acq_romi"

    # Rent
    exe_to_lowest_rent = "exe_to_lowest_rent"

    # Funnel Conversions
    usv_exe = "usv_exe"
    usv_inq = "usv_inq"
    inq_tou = "inq_tou"
    tou_app = "tou_app"
    app_exe = "app_exe"

    # Cost Pers
    usv_cost = "usv_cost"
    inq_cost = "inq_cost"
    tou_cost = "tou_cost"
    app_cost = "app_cost"
    exe_cost = "exe_cost"


class KPITitle:
    '''
    Helper class to provide KPI Titles as statically checkable field names
    '''

    @staticmethod
    def for_kpi(kpi_name):
        return getattr(KPITitle, kpi_name)

    # Lease
    leases_ended = "Leases Ended"
    leased_units_end = "Leased Units End"
    leased_units_start = "Leased Units Start"
    lease_renewal_notices = "Renewal Notices"
    lease_renewals = "Renewals"
    lease_vacation_notices = "Notices to Vacate"

    # Activity

    move_outs = "Move Outs"
    move_ins = "Move Ins"
    occupied_units_end = "Occupied Units End"  # Point Metric
    occupied_units_start = "Occupied Units Start"  # Point Metric
    occupiable_units_start = "Occupiable Units Start"  # Point Metric

    # Cancellations & Denials
    lease_cds = "Cancellation & Denial"

    # Investment
    acq_reputation_building = "Acquisition Reputation Building"
    acq_demand_creation = "Acquisition Demand Creation"
    acq_leasing_enablement = "Acquisition Leasing Enablement"
    acq_market_intelligence = "Acquisition Market Intelligence"
    ret_reputation_building = "Retention Reputation Building"
    ret_demand_creation = "Retention Demand Creation"
    ret_leasing_enablement = "Retention Leasing Enablement"
    ret_market_intelligence = "Retention Market Intelligence"

    # Rent
    average_monthly_rent = "Average Monthly Rent"
    lowest_monthly_rent = "Lowest Monthly Rent"
    highest_monthly_rent = "Highest Monthly Rent"

    # Funnel Volumes
    usvs = "Unique Site Visitors"
    inquiries = "Inquiries"
    tours = "Tours"
    lease_applications = "Lease Applications"
    leases_executed = "Lease Executions"

    ##########
    # Computed
    ##########

    # Leasing
    delta_leases = "Delta Leases"
    occupiable_units = "Occupiable Units"
    leased_units = "Leased Units"
    leased_rate = "Leased Rate"
    renewal_rate = "Retention Rate"
    lease_cd_rate = "Cancellation & Denial Rate"
    resident_decisions = "Resident Decisions"

    # Activity
    occupancy_rate = "Occupied Rate"
    occupied_units = "Occupied Units"

    # Investment
    acq_investment = "Aquisition Investment"
    ret_investment = "Retention Investment"
    investment = "Investment"

    # Revenue
    estimated_acq_revenue_gain = "Est. Acquisition Revenue Gain"
    estimated_ret_revenue_gain = "Est. Retention Revenue Gain"
    estimated_revenue_gain = "Est. Revenue Gain"

    # ROMI
    romi = "ROMI"
    ret_romi = "Retention ROMI"
    acq_romi = "Acquisition ROMI"

    # Rent
    exe_to_lowest_rent = "Cost per EXE / LMR"

    # Funnel Conversions
    usv_exe = "USV > EXE"
    usv_inq = "USV > INQ"
    inq_tou = "INQ > TOU"
    tou_app = "TOU > APP"
    app_exe = "APP > EXE"

    # Cost Pers
    usv_cost = "Cost per USV"
    inq_cost = "Cost per INQ"
    tou_cost = "Cost per Tour"
    app_cost = "Cost per App"
    exe_cost = "Cost per EXE"


FORMAT_TYPE_CURRENCY = "currency"
FORMAT_TYPE_FLOAT = "float"
FORMAT_TYPE_INTEGER = "integer"


def noop(value):
    return value


FORMAT_TYPE = {
    FORMAT_TYPE_CURRENCY: d_quant_currency,
    FORMAT_TYPE_FLOAT: noop,
    FORMAT_TYPE_INTEGER: round_or_none
}


class KPIFormat:

    @staticmethod
    def apply(kpi_name, value):
        format_type = getattr(KPIFormat, kpi_name)
        return FORMAT_TYPE[format_type](value)

    # Lease
    leases_ended = FORMAT_TYPE_INTEGER
    leased_units_end = FORMAT_TYPE_INTEGER
    leased_units_start = FORMAT_TYPE_INTEGER
    lease_renewal_notices = FORMAT_TYPE_INTEGER
    lease_renewals = FORMAT_TYPE_INTEGER
    lease_vacation_notices = FORMAT_TYPE_INTEGER

    # Activity

    move_outs = FORMAT_TYPE_INTEGER
    move_ins = FORMAT_TYPE_INTEGER
    occupied_units_end = FORMAT_TYPE_INTEGER
    occupied_units_start = FORMAT_TYPE_INTEGER
    occupiable_units_start = FORMAT_TYPE_INTEGER

    # Cancellations & Denials
    lease_cds = FORMAT_TYPE_INTEGER

    # Investment
    acq_reputation_building = FORMAT_TYPE_CURRENCY
    acq_demand_creation = FORMAT_TYPE_CURRENCY
    acq_leasing_enablement = FORMAT_TYPE_CURRENCY
    acq_market_intelligence = FORMAT_TYPE_CURRENCY
    ret_reputation_building = FORMAT_TYPE_CURRENCY
    ret_demand_creation = FORMAT_TYPE_CURRENCY
    ret_leasing_enablement = FORMAT_TYPE_CURRENCY
    ret_market_intelligence = FORMAT_TYPE_CURRENCY

    # Rent
    average_monthly_rent = FORMAT_TYPE_CURRENCY
    lowest_monthly_rent = FORMAT_TYPE_CURRENCY
    highest_monthly_rent = FORMAT_TYPE_CURRENCY

    # Funnel Volumes
    usvs = FORMAT_TYPE_INTEGER
    inquiries = FORMAT_TYPE_INTEGER
    tours = FORMAT_TYPE_INTEGER
    lease_applications = FORMAT_TYPE_INTEGER
    leases_executed = FORMAT_TYPE_INTEGER

    ##########
    # Computed
    ##########

    # Leasing
    delta_leases = FORMAT_TYPE_INTEGER
    occupiable_units = FORMAT_TYPE_INTEGER
    leased_units = FORMAT_TYPE_INTEGER
    leased_rate = FORMAT_TYPE_FLOAT
    renewal_rate = FORMAT_TYPE_FLOAT
    lease_cd_rate = FORMAT_TYPE_FLOAT
    resident_decisions = FORMAT_TYPE_INTEGER

    # Activity
    occupancy_rate = FORMAT_TYPE_FLOAT
    occupied_units = FORMAT_TYPE_INTEGER

    # Investment
    acq_investment = FORMAT_TYPE_CURRENCY
    ret_investment = FORMAT_TYPE_CURRENCY
    investment = FORMAT_TYPE_CURRENCY

    # Revenue
    estimated_acq_revenue_gain = FORMAT_TYPE_CURRENCY
    estimated_ret_revenue_gain = FORMAT_TYPE_CURRENCY
    estimated_revenue_gain = FORMAT_TYPE_CURRENCY

    # ROMI
    romi = FORMAT_TYPE_INTEGER
    ret_romi = FORMAT_TYPE_INTEGER
    acq_romi = FORMAT_TYPE_INTEGER

    # Rent
    exe_to_lowest_rent = FORMAT_TYPE_FLOAT

    # Funnel Conversions
    usv_exe = FORMAT_TYPE_FLOAT
    usv_inq = FORMAT_TYPE_FLOAT
    inq_tou = FORMAT_TYPE_FLOAT
    tou_app = FORMAT_TYPE_FLOAT
    app_exe = FORMAT_TYPE_FLOAT

    # Cost Pers
    usv_cost = FORMAT_TYPE_CURRENCY
    inq_cost = FORMAT_TYPE_CURRENCY
    tou_cost = FORMAT_TYPE_CURRENCY
    app_cost = FORMAT_TYPE_CURRENCY
    exe_cost = FORMAT_TYPE_CURRENCY






