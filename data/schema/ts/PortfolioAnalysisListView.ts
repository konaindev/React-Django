import * as t from "./types";

interface ShareInfo {
  /** Is Portfolio analysis shared */
  shared: boolean;

  /** Public url to portfolio analysis */
  share_url: string;

  /** URL for updating share state */
  update_endpoint: string; 
}

interface KpiBundle {
  /** Kpi name */
  name: string;

  /** Kpi key */
  value: string;
}

interface DateRange {
  // Preset time period
  preset: "custom" | "custom" | "last_week" | "last_two_weeks" | "last_four_weeks" | "year_to_date"

  // provides the start date of the time period
  start_date: t.date;

  // provides the end date of the time period
  end_date: t.date;
}

interface KpiOrder {
  /** Kpi label */
  label: string,

  /** Kpi key */
  value: string;
}

interface KpiHighlight {
    /**
    Health of property
    2 - on track
    1 - at risk
    0 - off track
    */
    health: 0 | 1 | 2;

    /** KPI name */
    name: string;
    
    /** KPI label */
    label: string;
    
    /** KPI target value */
    target: t.percent | t.decimal;

    /** KPI value */
    value: t.percent | t.decimal;
}

interface Property {
  /** Property Group name */
  name: string;

  /** The relative link to the property image */
  image_url: string;

  kpis: {
    lease_rate: t.float;
    occupancy_rate: t.float;
    cd_rate: t.float;
    renewal_rate: t.float;
  };

  targets: {
    lease_rate: t.float;
    occupancy_rate: t.float;
    cd_rate: t.float;
    renewal_rate: t.float;
  };
}
interface SingleProperty extends Property {
  /** Property adderss */
  address: string;

   /**
   Health of property
   2 - on track
   1 - at risk
   0 - off track
   */
  health: 0 | 1 | 2;
}

interface GroupProperty extends Property {
    /** Property type */
    type: "group";

    /** List of properties */
    properties: Array<SingleProperty>;
}

interface IndividualProperty extends SingleProperty {
  /** Property type */
  type: "individual";
}

export interface PortfolioAnalysisListView {
  /**  */
  share_info: ShareInfo;

  /** Selected kpi, value from kpi_bundles */
  selected_kpi_bundle: string;

  /** Kpi list for portfolio analysis */
  kpi_bundles: Array<KpiBundle>;

  /** A date range. */
  date_selection: DateRange;

  /** List of KPIs in the proper order. */
  kpi_order: Array<KpiOrder>

  /** List of list of highlight KPIs. */
  highlight_kpis: Array<KpiHighlight>

  /** List of Properties. */
  table_data: Array<GroupProperty | IndividualProperty>;
}
