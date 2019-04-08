import * as t from "./types";

/** A single intermediate period structure used by the BaselinePerf excel spreadsheet importer */
interface ImportedPeriod {
  start: t.date;
  end: t.date;
  leased_units_start: t.integer;
  leases_ended: t.integer;
  lease_applications: t.integer;
  leases_executed: t.integer;
  lease_cds: t.integer;
  lease_renewal_notices: t.integer;
  lease_renewals: t.integer;
  lease_vacation_notices: t.integer;
  occupiable_units_start: t.integer;
  occupied_units_start: t.integer;
  move_ins: t.integer;
  move_outs: t.integer;
  acq_reputation_building: t.currency;
  acq_demand_creation: t.currency;
  acq_leasing_enablement: t.currency;
  acq_market_intelligence: t.currency;
  ret_reputation_building: t.currency;
  ret_demand_creation: t.currency;
  ret_leasing_enablement: t.currency;
  ret_market_intelligence: t.currency;
  usvs: t.integer;
  inquiries: t.integer;
  tours: t.integer;
}

/** The intermediate import structure used by the BaselinePerf excel spreadsheet importer */
export interface ImportedBaselinePerfData {
  baseline_start_date: t.date;
  baseline_end_date: t.date;
  periods: ImportedPeriod[];
}
