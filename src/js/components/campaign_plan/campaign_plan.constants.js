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

export const TACTIC_STATUSES = ["Not Started", "In Progress", "Complete"];

export const AVG_COST_SUFFIX = {
  monthly: "mo",
  weekly: "week"
};
