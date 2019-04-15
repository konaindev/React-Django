import { objectFromEntries } from "../../utils/misc";

export const genericTabsSortedList = [
  ["reputation_building", "Reputation Building"],
  ["demand_creation", "Demand Creation"],
  ["leasing_enablement", "Leasing Enablement"],
  ["market_intelligence", "Marketing Intelligence"]
];
export const allTabsSortedList = [ // eslint-disable-line
  ["overview", "Overview"],
  ...genericTabsSortedList
];

export const genericTabsMap = objectFromEntries(genericTabsSortedList);

// tactic => status
export const tacticStatusList = ["Not Started", "In Progress", "Complete"];
export const getTacticStatusClass = status => {
  let classes = {};
  classes["Not Started"] = "not-started";
  classes["In Progress"] = "in-progress";
  classes["Complete"] = "complete";

  return classes[status] || "";
};

// tactic => cost_type
export const costTypeList = ["Monthly", "Weekly", "One-Time"];
export const getCostTypeLabel = type => {
  let labels = {};
  labels["Monthly"] = "mo";
  labels["Weekly"] = "week";

  return labels[type] || "";
};
