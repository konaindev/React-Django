import * as t from "./types";

/** A named link to a single available project report */
interface ReportLink {
  /** The relative link to the project report page */
  url: string;

  /** A human-readable description of this specific report; can be ignored. */
  description: string;
}

/** The common structure used in all report pages to define available reports. */
export interface ReportLinks {
  /** The available baseline report for this project, if any. */
  baseline: ReportLink | null;

  /** The available performance reports for this project, if any. */
  performance: ReportLink[] | null;

  /** The available total addressable market (TAM) report for this project, if any. */
  market: ReportLink | null;

  /** The available modeling report for this project, if any. */
  modeling: ReportLink | null;
}
