import {
  configuredFormatCurrency,
  configuredFormatNumber,
  configuredFormatPercent
} from "./formatters";

const KPI_FORMAT = {
  // Investment
  acq_reputation_building: configuredFormatCurrency(),
  acq_demand_creation: configuredFormatCurrency(),
  acq_leasing_enablement: configuredFormatCurrency(),
  acq_market_intelligence: configuredFormatCurrency(),
  ret_reputation_building: configuredFormatCurrency(),
  ret_demand_creation: configuredFormatCurrency(),
  ret_leasing_enablement: configuredFormatCurrency(),
  ret_market_intelligence: configuredFormatCurrency(),

  // Funnel Volumes
  usvs: configuredFormatNumber(),
  inquiries: configuredFormatNumber(),
  tours: configuredFormatNumber(),
  lease_applications: configuredFormatNumber(),
  leases_executed: configuredFormatNumber(),

  // Leasing
  occupiable_units: configuredFormatNumber(),
  leased_units: configuredFormatNumber(),
  leased_rate: configuredFormatPercent(),
  renewal_rate: configuredFormatPercent(),
  lease_cd_rate: configuredFormatPercent(),
  lease_renewal_notices: configuredFormatNumber(),
  lease_renewals: configuredFormatNumber(),
  lease_vacation_notices: configuredFormatNumber(),

  // Activity
  move_outs: configuredFormatNumber(),
  move_ins: configuredFormatNumber(),
  occupancy_rate: configuredFormatPercent(),
  occupied_units: configuredFormatNumber(),

  // Investment
  acq_investment: configuredFormatCurrency(),
  ret_investment: configuredFormatCurrency(),
  investment: configuredFormatCurrency(),

  // Revenue
  estimated_acq_revenue_gain: configuredFormatCurrency(),
  estimated_ret_revenue_gain: configuredFormatCurrency(),
  estimated_revenue_gain: configuredFormatCurrency(),

  // ROMI
  romi: configuredFormatNumber(),
  ret_romi: configuredFormatNumber(),
  acq_romi: configuredFormatNumber(),

  // Rent
  exe_to_lowest_rent: configuredFormatPercent(),

  // Funnel Conversions
  usv_exe: configuredFormatPercent(),
  usv_inq: configuredFormatPercent(),
  inq_tou: configuredFormatPercent(),
  tou_app: configuredFormatPercent(),
  app_exe: configuredFormatPercent(),

  // Cost Pers
  usv_cost: configuredFormatCurrency(),
  inq_cost: configuredFormatCurrency(),
  tou_cost: configuredFormatCurrency(),
  app_cost: configuredFormatCurrency(),
  exe_cost: configuredFormatCurrency()
};

export function formatKPI(name, value) {
  if (!KPI_FORMAT[name]) {
    throw new Error("Key provided to formatKPI is invalid");
  }
  return KPI_FORMAT[name](value);
}
