import * as t from "./types";
import { PropertyReportWithFunnelAverages } from "./BaselineReport";

/** Defines a single potential modeling option under consideration. */
interface ModelingOption extends PropertyReportWithFunnelAverages {
  /** A description of this option, like "Schedule Driven" */
  name: string;
}

/** A collection of modeling options. */
export interface ModelingOptions {
  /** The property name under consideration */
  property_name: string;

  /** An ordered list of modeling options to consider */
  options: ModelingOption[];
}
