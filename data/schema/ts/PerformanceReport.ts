import * as t from "./types";
import {
  PropertyReport,
  Property,
  AcquisitionFunnel,
  Investment
} from "./BaselineReport";

/** Target structure for a performance report */
interface PerformanceTargets {
  /** Target values for the property */
  property: t.Targets<Property>;

  /** Target values for the marketing acquisition funnel */
  funnel: t.Targets<AcquisitionFunnel>;

  /** Target values for marketing investments and outcomes */
  investment: t.Targets<Investment>;
}

/** Target structure for performance deltas */
interface PerformanceDeltas {
  property?: t.Deltas<Property>;

  funnel?: t.Deltas<AcquisitionFunnel>;

  investment?: t.Deltas<Investment>;
}

/** A whisker series with arbitrary x axis */
type WhiskerSeries = (t.currency | t.percent | t.integer)[];
type NullableWhiskerSeries = WhiskerSeries | null;

/** Whisker plots for the baseline */
interface WhiskerPlots {
  /** A series for lease rate over time @computed */
  leased_rate: NullableWhiskerSeries;

  /** A series for retention percentage over time @computed */
  renewal_rate: NullableWhiskerSeries;

  /** A series for occupancy percentage over time @computed */
  occupancy_rate: NullableWhiskerSeries;

  /** A series for capaign investment over time @computed */
  investment: NullableWhiskerSeries;

  /** A series for usv > exe percentage over time @computed */
  usv_exe: NullableWhiskerSeries;

  /** A series for cancellation/denial rate over time @computed */
  lease_cd_rate: NullableWhiskerSeries;

  /** A series for costs vs rent rate over time @computed */
  cost_per_exe_vs_rent: NullableWhiskerSeries;
}

/** A full performance report */
export interface PerformanceReport extends PropertyReport {
  /** Nullable target values for the report */
  targets: PerformanceTargets;

  /** Delta values for the report against a report of the previous timeframe @computed */
  deltas?: PerformanceDeltas;

  /** Whisker plots, all categories */
  whiskers: WhiskerPlots;
}
