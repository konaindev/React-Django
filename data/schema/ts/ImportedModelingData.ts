import * as t from "./types";
import { InvestmentExpenses } from "./BaselineReport";
import { ModelingOption } from "./ModelingOptions";

interface ImportedModelingTargets {
  start: t.date;
  end: t.date;

  /** from "Lease Up %" column */
  target_leased_rate: t.float;

  /** from "Apps" column */
  target_lease_applications: t.integer;

  /** from "EXE" column */
  target_leases_executed: t.integer;

  /** from "Notice to Renew" column */
  target_lease_renewal_notices: t.integer;

  /** from "Renewals" column */
  target_lease_renewals: t.integer;

  /** from "Notice to Vacate" column */
  target_lease_vacation_notices: t.integer;

  /** from "C/D" column */
  target_lease_cds: t.integer;

  /** from "Weekly Delta Leased Units" column */
  target_delta_leases: t.integer;

  /** from "Move Ins" column */
  target_move_ins: t.integer;

  /** from "Move Outs" column */
  target_move_outs: t.integer;

  /** from "Occupied Units" column */
  target_occupied_units: t.integer;

  /** from individual AQC [sic] columns */
  target_acq_expenses: InvestmentExpenses;

  /** from individual Ret columns */
  target_ret_expenses: InvestmentExpenses;

  /** summed from "AQC [sic] Reputation Building, AQC Demand Creation, AQC Leasing Enablemenet, AQC Market Intelligence" columns */
  target_acq_investment: t.currency;

  /** summed from "Ret Reputation Building, Ret Demand Creation, Ret Leasing Enablemenet, Ret Market Intelligence" columns */
  target_ret_investment: t.currency;

  /** from "USVs" column */
  target_usvs: t.integer;

  /** from "INQs" column */
  target_inquiries: t.integer;

  /** from "TOU" column */
  target_tours: t.integer;
}

export interface ImportedModelingData extends ModelingOption {
  targets: ImportedModelingTargets[];
}
