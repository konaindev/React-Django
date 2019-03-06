import React from "react";
import { storiesOf } from "@storybook/react";

import ModelingView from "./index";

const props = {
  report: {
    name: "Schedule Driven",
    dates: {
      start: "2018-07-23",
      end: "2018-12-17"
    },
    property: {
      monthly_average_rent: "1847.00",
      cost_per_exe_vs_rent: 1.03,
      leasing: {
        change: 55,
        cds: 19,
        cd_rate: 0.2,
        renewal_notices: 30,
        renewals: 64,
        renewal_rate: 0.63,
        resident_decisions: 48,
        vacation_notices: 18,
        rate: 0.95,
        units: 247
      },
      occupancy: {
        move_ins: 80,
        move_outs: 20,
        rate: 0.93,
        units: 242,
        occupiable: 260
      }
    },
    funnel: {
      volumes: {
        usv: 11209,
        inq: 673,
        tou: 269,
        app: 97,
        exe: 77
      },
      costs: {
        usv: "9.90",
        inq: "165.00",
        tou: "413.00",
        app: "1515.00",
        exe: "1909.00"
      },
      conversions: {
        usv_inq: 0.06,
        inq_tou: 0.4,
        tou_app: 0.36,
        app_exe: 0.8,
        usv_exe: 0.007
      }
    },
    four_week_funnel_averages: {
      usv: 2136,
      inq: 128,
      tou: 52,
      app: 19,
      exe: 16
    },
    investment: {
      acquisition: {
        expenses: {
          demand_creation: "76000.00",
          leasing_enablement: "35000.00",
          market_intelligence: "24000.00",
          reputation_building: "35000.00"
        },
        total: "171000.00",
        romi: 7,
        estimated_revenue_gain: "1200000.00"
      },
      retention: {
        expenses: {
          demand_creation: "0.00",
          leasing_enablement: "10000.00",
          market_intelligence: "0.00",
          reputation_building: "0.00"
        },
        total: "10000.00",
        romi: 142,
        estimated_revenue_gain: "1400000.00"
      },
      total: {
        total: "181000.00",
        romi: 14,
        estimated_revenue_gain: "2600000.00"
      }
    }
  }
};

storiesOf("ModelingView", module).add("default", () => (
  <ModelingView {...props} />
));
