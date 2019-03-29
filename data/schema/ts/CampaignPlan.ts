import * as t from "./types";
import { InvestmentExpenses } from "./BaselineReport";

interface TargetSegment {
  /** A description of ordered importance ('primary', 'tertiary') */
  ordinal: string;

  /** A description of the segment ('Young Professionals') */
  description: string;
}

interface Objective {
  /** The primary title for the objective ('Reputation Building') */
  title: string;

  /** A detailed description, in markdown */
  description: t.markdown;
}

interface Overview {
  /** The overall campaign theme ('Variable by audience and segment') */
  theme: string;

  /** The target segments, in order from most important to least */
  target_segments: TargetSegment[];

  /** The overall campaign goal ('achieve lease-up') */
  goal: string;

  /** Campaign objectives */
  objectives: Objective[];

  /** Campaign assumptions */
  assumptions: t.markdown;

  /** Description of the schedule ('Begins in late may 2019') */
  schedule: string;

  /** Target investment, total */
  target: t.currency;

  /** Target investment, per-tactic */
  target_investment: InvestmentExpenses;
}

export interface CampaignPlan {
  overview: Overview;
}
