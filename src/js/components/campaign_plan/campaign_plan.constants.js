export const genericTabsInOrder = [
  ["reputation_building", "Reputation Building"],
  ["demand_creation", "Demand Creation"],
  ["leasing_enablement", "Leasing Enablement"],
  ["market_intelligence", "Marketing Intelligence"]
];
export const allTabsInOrder = [["overview", "Overview"], ...genericTabsInOrder];

export const GENERIC_TABS = Object.fromEntries(genericTabsInOrder);
export const ALL_TABS = Object.fromEntries(allTabsInOrder);

export const TACTIC_STATUSES = {
  not_started: "Not Started",
  in_progress: "In Progress",
  complete: "Complete"
};

export const AVG_COST_SUFFIX = {
  monthly: "mo",
  weekly: "week"
};
