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

  /** Renewal rate @computed */
  renewal_rate: t.percent;

  /** Number of resident decisions (typically, due to expire leases) */
  resident_decisions: t.integer;

  /** Number of notices to vacate */
  vacation_notices: t.integer;

  /** Lease rate as a function of occupiable units @computed */
  rate: t.percent;

  /** Number of leased units at end of report period @computed */
  units: t.integer;
}

/** Occupancy -- the "physical" side of renting */
interface Occupancy {
  /** Number of units moved into during period */
  move_ins: t.integer;

  /** Number of units moved out of during period */
  move_outs: t.integer;

  /** Ratio of occupied to occupiable units @computed */
  rate: t.percent;

  /** Number of occupied units at end of report period @computed */
  units: t.integer;

  /** Number of occupiable units at the end of report period */
  occupiable: t.integer;
}

/** Marketing investment expense buckets */
export interface InvestmentExpenses {
  demand_creation: t.currency;
  leasing_enablement: t.currency;
  market_intelligence: t.currency;
  reputation_building: t.currency;
}

/** Per-category investment breakdown */
interface InvestmentCategory {
  /** The total spent across all buckets @computed */
  total: t.currency;

  /** The return on investment @computed */
  romi: t.integer;

  /** The estimated revenue gain as a function of monthly rent @computed */
  estimated_revenue_gain: t.currency;
}

interface InvestmentCategoryWithExpenses extends InvestmentCategory {
  /** Breakdown of marketing expenses into sub-buckets */
  expenses: InvestmentExpenses;
}

/** All marketing investment categories */
export interface Investment {
  /** Investment and returns for the acquisition funnel */
  acquisition: InvestmentCategoryWithExpenses;

  /** Investment and returns for the retention funnel */
  retention: InvestmentCategoryWithExpenses;

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
interface AcquisitionConversions<T> {
  /** USV > INQ conversion rate @computed */
  usv_inq: T;

  /** INQ > TOU conversion rate @computed */
  inq_tou: T;

  /** TOU > APP conversion rate @computed */
  tou_app: T;

  /** APP > EXE conversion rate @computed */
  app_exe: T;

  /** USV > EXE conversion rate @computed */
  usv_exe: T;
}

/** Acquisition funnel */
export interface AcquisitionFunnel {
  /** Absolute volumes in the acquisition funnel */
  volumes: AcquisitionCategories<t.integer>;

  /** Cost-pers in the acquisition funnel @computed */
  costs: AcquisitionCategories<t.currency>;

  /** Conversion rates in the acquisition funnel @computed */
  conversions: AcquisitionConversions<t.percent>;
}

/** Property-wide behavior */
export interface Property {
  /** The average rent, across all units, during this period */
  average_monthly_rent: t.currency;

  /** The lowest rent, across all units, during this period */
  lowest_monthly_rent: t.currency;

  /** The cost per exe vs the monthly average rent during this period */
  cost_per_exe_vs_rent: t.percent;

  /** Basic leasing information for the period */
  leasing: Leasing;

  /** Basic occupancy information for the period */
  occupancy: Occupancy;
}

/** A full property report */
export interface PropertyReport {
  /** Dates for the report */
  dates: t.TimeSpan;

  /** Property details for the report */
  property: Property;

  /** The acqusition funnel */
  funnel: AcquisitionFunnel;

  /** Investment expenses and outcomes, all categories */
  investment: Investment;
}

/** A full property report with 4-week funnel averages */
export interface PropertyReportWithFunnelAverages extends PropertyReport {
  /** Four-week details for the acquisition funnel */
  four_week_funnel_averages: AcquisitionCategories<t.integer>;
}

/** Desribes a single month of historical values for a baseline funnel */
interface FunnelHistoryMonth {
  /** The month, as an ISO 8601 string (like 2018-05) */
  month: t.date;

  /** Weekly volumes */
  weekly_volumes: AcquisitionCategories<t.integer[]>;

  /** Overall monthly volumes */
  monthly_volumes: AcquisitionCategories<t.integer>;

  /** Weekly conversion rates */
  weekly_conversions: AcquisitionConversions<t.percent[]>;

  /** Overall monthly conversion rates */
  monthly_conversions: AcquisitionConversions<t.percent>;

  /** Weekly costs */
  weekly_costs: AcquisitionCategories<t.currency[]>;

  /** Overall monthly costs */
  monthly_costs: AcquisitionCategories<t.currency>;
}

/** Describes historical values for a baseline funnel */
type FunnelHistory = FunnelHistoryMonth[];

/** A baseline report is a property report with further details */
export interface BaselineReport extends PropertyReportWithFunnelAverages {
  /** Property name */
  property_name: string;

  /** Funnel history */
  funnel_history: FunnelHistory;

  // TODO in the future:
  // funnel performance analysis (monthly and weekly)
  // funnel duration analysis
  // funnel duration insights
  // baseline comparison matrix
}
