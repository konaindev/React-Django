import * as t from "./types";

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

/** Breakdown of targets across funnels for a single investment category */
interface CampaignPlanTargetInvestmentCategory {
  acquisition: t.currency;
  retention: t.currency;
  total: t.currency;
}

/** Breakdown of targets across funnels for all investment categories */
interface CampaignPlanTargetInvestments {
  reputation_building: CampaignPlanTargetInvestmentCategory;
  demand_creation: CampaignPlanTargetInvestmentCategory;
  leasing_enablement: CampaignPlanTargetInvestmentCategory;
  market_intelligence: CampaignPlanTargetInvestmentCategory;
  total: CampaignPlanTargetInvestmentCategory;
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

  /** Target investments */
  target_investments: CampaignPlanTargetInvestments;
}

/** Allowable schedule statuses */
enum Status {
  not_started = "Not Started",
  in_progress = "In Progress",
  complete = "Complete"
}

/** Known cost types */
enum CostType {
  one_time = "One-Time",
  monthly = "Monthly",
  weekly = "Weekly"
}

/** Audience types */
enum Audience {
  acquisition = "Acquisition",
  retention = "Retention"
}

interface Tactic {
  /** The name of the tactic, ('Brand Strategy') */
  name: string;

  /** The target audience (if applicable) */
  audience: Audience | null;

  /** Details about the tactic (shown in tooltip, typically) */
  tooltip: string | null;

  /** The scheduled date */
  schedule: string | null;

  /** The current schedule status */
  status: Status;

  /** Notes about the tactic (arbitrary markdown) */
  notes: t.markdown | null;

  /** The base cost for the tactic */
  base_cost: t.currency;

  /** The cost type */
  cost_type: CostType;

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
