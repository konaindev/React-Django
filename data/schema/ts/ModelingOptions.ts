import * as t from "./types";
import { PropertyReportWithFunnelAverages } from "./BaselineReport";

/** Defines a single potential modeling option under consideration. */
interface ModelingOption {
  /** A description of this option, like "Schedule Driven" */
  name: string;

  // CONSDIER: Modeling projects *appear* to follow the same essential
  // structure as a baseline report, so it probably makes sense just
  // to use this type. I wonder if the two will diverge down the road? -Dave
  /** Future projections for the modeling option */
  projections: PropertyReportWithFunnelAverages;
}

/** A collection of modeling options. */
export interface ModelingOptions {
  /** An ordered list of modeling options to consider */
  options: ModelingOption[];
}
