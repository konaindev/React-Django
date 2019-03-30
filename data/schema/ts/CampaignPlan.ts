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

/** Allowable schedule statuses */
enum ScheduleStatus {
  not_started = "not_started",
  in_progress = "in_progress",
  complete = "complete"
}

/** Known cost categories */
enum CostCategory {
  one_time = "one_time",
  monthly = "monthly"
}

interface Tactic {
  /** The name of the tactic, ('Brand Strategy') */
  name: string;

  /** Details about the tactic (shown in tooltip, typically) */
  tooltip: string | null;

  /** The scheduled date */
  schedule: t.date;

  /** The current schedule status */
  status: ScheduleStatus;

  /** Notes about the tactic (arbitrary markdown) */
  notes: t.markdown | null;

  /** The base cost for the tactic */
  base_cost: t.currency;

  /** The cost category */
  cost_category: CostCategory;

  /** Total cost @computed */
  total_cost: t.currency;
}

interface DemandCreationTargets<T> {
  /** Unique site visitors */
  usv: T;

  /** Inquiries */
  inq: T;
}

interface DemandCreationTactic extends Tactic {
  /** Campaign plan target volumes for demand creation */
  volumes: DemandCreationTargets<t.integer>;

  /** Campaign plan target costs for demand creation */
  costs: DemandCreationTargets<t.currency | null>;
}

interface CampaignCategory {
  /** List of tactics for this category */
  tactics: Tactic[];
}

interface ReputationBuilding extends CampaignCategory {}

interface DemandCreation extends CampaignCategory {
  tactics: DemandCreationTactic[];
}

interface LeasingEnablement extends CampaignCategory {}

interface MarketIntelligence extends CampaignCategory {}

export interface CampaignPlan {
  overview: Overview;
  reputation_building: ReputationBuilding;
  demand_creation: DemandCreation;
  leasing_enablement: LeasingEnablement;
  market_intelligence: MarketIntelligence;
}
