import {
  props as tableProps,
  partialKPIs as tablePartialKPIs,
  withoutKPIs as tableWithoutKPIs
} from "../portfolio_table/props";
import { props as userProps } from "../user_menu/props";

export const props = {
  share_info: {
    shared: true,
    share_url: "http://app.remarkably.com/",
    update_endpoint: "/projects/pro_example/update/"
  },

  selected_kpi_bundle: "leasing_performance",

  kpi_bundles: [
    {
      name: "Leasing Performance",
      value: "leasing_performance"
    },
    {
      name: "Conversion Rates",
      value: "conversion_rates"
    },
    {
      name: "Retention Performance",
      value: "retention_performance"
    }
  ],

  date_selection: {
    preset: "custom",
    start_date: "2019-04-15",
    end_date: "2019-04-22"
  },

  kpi_order: tableProps.kpi_order,

  highlight_kpis: [
    {
      health: 0,
      name: "usv_inq",
      label: "USV → INQ",
      target: "0.07",
      value: "0.05"
    },
    {
      health: 1,
      name: "inq_tou",
      label: "INQ → TOU",
      target: "0.25",
      value: "0.2"
    },
    {
      health: 2,
      name: "tou_app",
      label: "TOU → APP",
      target: "0.5",
      value: "0.6"
    }
  ],

  table_data: tableProps.properties,

  user: userProps,
  display_average: "1"
};

export const withoutKPIs = {
  ...props,
  table_data: tableWithoutKPIs.properties,

  highlight_kpis: [
    {
      health: -1,
      name: "usv_inq",
      label: "USV → INQ"
    },
    {
      health: -1,
      name: "inq_tou",
      label: "INQ → TOU"
    },
    {
      health: -1,
      name: "tou_app",
      label: "TOU → APP"
    }
  ]
};

export const partialKPIs = {
  ...props,
  table_data: tablePartialKPIs.properties,

  highlight_kpis: [
    {
      health: 0,
      name: "usv_inq",
      label: "USV → INQ"
    },
    {
      health: 1,
      name: "inq_tou",
      label: "INQ → TOU",
      target: "0.25",
      value: "0.2"
    },
    {
      health: 0,
      name: "tou_app",
      label: "TOU → APP",
      value: "0.6"
    }
  ]
};
