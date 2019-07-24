


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
    average_rent = "average_rent"
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
    lease_rate = "lease_rate"
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
        return getattr(KPITitles, kpi_name)

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
    occupied_units_end = "occupied_units_end"  # Point Metric
    occupied_units_start = "occupied_units_start"  # Point Metric
    occupiable_units_start = "occupiable_units_start"  # Point Metric

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
    average_rent = "average_rent"
    lowest_monthly_rent = "lowest_monthly_rent"
    highest_monthly_rent = "highest_monthly_rent"

    # Funnel Volumes
    usvs = "usvs"
    inquiries = "inquiries"
    tours = "tours"
    lease_applications = "lease_applications"
    leases_executed = "leases_executed"

    ##########
    # Computed
    ##########

    # Leasing
    delta_leases = "delta_leases"
    occupiable_units = "occupiable_units"
    leased_units = "leased_units"
    lease_rate = "lease_rate"
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







