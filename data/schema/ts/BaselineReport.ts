import * as t from "./types";

/** Leasing -- the "logical" side of renting */
interface Leasing {
  /** Net change in number of leases during this period @computed */
  change: t.integer;

  /** Number of cancellations AND denials */
  cds: t.integer;

  /** Cancellations/denials as percentage of lease application @computed */
  cd_rate: t.percent;

  /** Number of new notices to renew */
  renewal_notices: t.integer;

  /** Number of renewals actually effected in timeframe  */
  renewals: t.integer;

  /** Number of notices to vacate */
  vacation_notices: t.integer;

  /** Lease rate as a function of occupiable units @computed */
  rate: t.percent;

  /** Number of leased units at start of report period */
  units_start: t.integer;

  /** Number of leased units at end of report period @computed */
  units: t.integer;

  /** Number of leases that will expire soon (XXX what even is this?) */
  due_to_expire: t.integer;

  /** Number of leases ended during report period */
  ended: t.integer;
}

/** Occupancy -- the "physical" side of renting */
interface Occupancy {
  /** Number of units moved into during period */
  move_ins: t.integer;

  /** Number of units moved out of during period */
  move_outs: t.integer;

  /** Ratio of occupied to occupiable units @computed */
  rate: t.percent;

  /** Number of occupiable units at start of report period */
  units_start: t.integer;

  /** Number of occupiable units at end of report period @computed */
  units: t.integer;
}

/** Marketing investment expense buckets */
interface InvestmentExpenses {
  demand_creation: t.currency;
  leasing_enablement: t.currency;
  market_intelligence: t.currency;
  reputation_building: t.currency;
}

/** Per-category investment breakdown */
interface InvestmentCategory {
  /** Breakdown of money spent on marketing */
  expenses: InvestmentExpenses;

  /** The total spent across all buckets @computed */
  total: t.currency;

  /** The return on investment @computed */
  romi: t.integer;

  /** The estimated revenue gain as a function of monthly rent @computed */
  estimated_revenue_gain: t.currency;
}

/** All marketing investment categories */
export interface Investment {
  /** Investment and returns for the acquisition funnel */
  acquisition: InvestmentCategory;

  /** Investment and returns for the retention funnel */
  retention: InvestmentCategory;

  /** Total investment and returns across all funnels @computed */
  total: InvestmentCategory;
}

/** Acquisition funnel categories */
interface AcquisitionCategories<T> {
  /** Unique site visitors */
  usv: T;

  /** Inquiries */
  inq: T;

  /** Tours */
  tou: T;

  /** Lease applications */
  app: T;

  /** Lease executions */
  exe: T;
}

/** Acquisition conversions */
interface AcquisitionConversions {
  /** USV > INQ conversion percentage @computed */
  usv_inq: t.percent;

  /** INQ > TOU conversion percentage @computed */
  inq_tou: t.percent;

  /** TOU > APP conversion percentage @computed */
  tou_app: t.percent;

  /** APP > EXE conversion percentage @computed */
  app_exe: t.percent;

  /** USV > EXE conversion percentage @computed */
  usv_exe: t.percent;
}

/** Acquisition funnel */
export interface AcquisitionFunnel {
  /** Absolute volumes in the acquisition funnel */
  volumes: AcquisitionCategories<t.integer>;

  /** Cost-pers in the acquisition funnel @computed */
  costs: AcquisitionCategories<t.currency>;

  /** Conversion rates in the acquisition funnel @computed */
  conversions: AcquisitionConversions;
}

/** Property-wide behavior */
export interface Property {
  /** The average rent, across all units, during this period */
  monthly_average_rent: t.currency;

  /** The cost per exe vs the monthly average rent during this period */
  cost_per_exe_vs_rent: t.percent;

  /** Basic leasing information for the period */
  leasing: Leasing;

  /** Basic occupancy information for the period */
  occupancy: Occupancy;
}

/** A full baseline report */
export interface BaselineReport {
  /** Dates for the report */
  dates: t.TimeSpan;

  /** Property name */
  property_name: string;

  /** Property details for the report */
  property: Property;

  /** The acqusition funnel */
  funnel: AcquisitionFunnel;

  /** Investment expenses and outcomes, all categories */
  investment: Investment;
}
