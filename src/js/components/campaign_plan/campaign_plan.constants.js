import { objectFromEntries } from "../../utils/misc";

export const GENERIC_TABS_ORDERED = [
  ["reputation_building", "Reputation Building"],
  ["demand_creation", "Demand Creation"],
  ["leasing_enablement", "Leasing Enablement"],
  ["market_intelligence", "Marketing Intelligence"]
];
export const ALL_TABS_ORDERED = [
  ["overview", "Overview"],
  ...GENERIC_TABS_ORDERED
];

export const GENERIC_TABS = objectFromEntries(GENERIC_TABS_ORDERED);
export const ALL_TABS = objectFromEntries(ALL_TABS_ORDERED);

export const TACTIC_STATUSES = {
  "Not Started": "not-started",
  "In Progress": "in-progress",
  "Complete": "complete" // eslint-disable-line
};

export const COST_TYPES_PREFIX = {
  "Monthly": "mo",  // eslint-disable-line
  "Weekly": "week",  // eslint-disable-line
  "One-Time": ""
};
