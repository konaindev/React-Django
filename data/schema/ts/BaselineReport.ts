import * as t from "./types";

/** Marketing investment expense buckets */
interface InvestmentExpenses {
  demand_creation: t.currency;
  leasing_enablement: t.currency;
  market_intelligence: t.currency;
  reputation_building: t.currency;
}

/** Investment outcomes */
interface InvestmentOutcomes {
  /** The total spent across all buckets */
  total: t.currency;

  /** The return on investment */
  romi: t.integer;

  /** The estimated revenue gain as a function of monthly rent  */
  estimated_revenue_gain: t.currency;
}

/** Overall investment picture */
interface Investment {
  /** Breakdown of money spent on marketing */
  expenses: InvestmentExpenses;

  /** Breakdown of investment outcomes. */
  outcomes: InvestmentOutcomes;
}

/** A full baseline report */
export interface BaselineReport {
  /** Investment and returns for the acquisition funnel */
  acquisition: Investment;

  /** Investment and returns for the retention funnel */
  retention: Investment;

  /** Total investment and returns across all funnels */
  investment: Investment;
}
