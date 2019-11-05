import {
  baselineReport,
  baselineReportWithoutCompetitors,
  baselineReportWithOneCompetitor
} from "../common_report/props";

export const props = { report: baselineReport };
export const no_competitor_props = { report: baselineReportWithOneCompetitor };
export const one_competitor_props = {
  report: baselineReportWithoutCompetitors
};
