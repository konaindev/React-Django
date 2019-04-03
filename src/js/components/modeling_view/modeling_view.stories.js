import React from "react";
import { storiesOf } from "@storybook/react";

import ModelingView from "./index";

export const props = {
  property_name: "Portland Multi Family",
  options: [
    {
      name: "Schedule Driven",
      dates: {
        start: "2018-07-23",
        end: "2018-12-17"
      },
      property: {
        average_monthly_rent: "1847.00",
        lowest_monthly_rent: "1847.00",
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
    },

    {
      name: "Investment Driven",
      dates: {
        start: "2018-07-23",
        end: "2019-05-27"
      },
      property: {
        average_monthly_rent: "1847.00",
        lowest_monthly_rent: "1847.00",
        cost_per_exe_vs_rent: 0.72,
        leasing: {
          change: 55,
          cds: 25,
          cd_rate: 0.2,
          renewal_notices: 112,
          renewals: 129,
          renewal_rate: 0.7,
          resident_decisions: 160,
          vacation_notices: 48,
          rate: 0.95,
          units: 247,
          ended: 46
        },
        occupancy: {
          move_ins: 191,
          move_outs: 46,
          rate: 0.93,
          units: 242,
          occupiable: 260
        }
      },
      funnel: {
        volumes: {
          usv: 21396,
          inq: 1070,
          tou: 396,
          app: 127,
          exe: 101
        },
        costs: {
          usv: "4.89",
          inq: "81.48",
          tou: "227.00",
          app: "899.00",
          exe: "1333.00"
        },
        conversions: {
          usv_inq: 0.05,
          inq_tou: 0.37,
          tou_app: 0.32,
          app_exe: 0.8,
          usv_exe: 0.005
        }
      },
      four_week_funnel_averages: {
        usv: 1945,
        inq: 96,
        tou: 36,
        app: 12,
        exe: 8
      },
      investment: {
        acquisition: {
          expenses: {
            demand_creation: "68000.00",
            leasing_enablement: "30000.00",
            market_intelligence: "24000.00",
            reputation_building: "20000.00"
          },
          total: "142000.00",
          romi: 8,
          estimated_revenue_gain: "1200000.00"
        },
        retention: {
          expenses: {
            demand_creation: "0.00",
            leasing_enablement: "6000.00",
            market_intelligence: "0.00",
            reputation_building: "0.00"
          },
          total: "6000.00",
          romi: 483,
          estimated_revenue_gain: "2900000.00"
        },
        total: {
          total: "148000.00",
          romi: 28,
          estimated_revenue_gain: "4100000.00"
        }
      }
    },

    {
      name: "Run Rate",
      dates: {
        start: "2018-07-13",
        end: "2020-11-16"
      },
      property: {
        average_monthly_rent: "1847.00",
        lowest_monthly_rent: "1847.00",
        cost_per_exe_vs_rent: 0.48,
        leasing: {
          change: 55,
          cds: 78,
          cd_rate: 0.29,
          renewal_notices: 374,
          renewals: 374,
          renewal_rate: 0.71,
          resident_decisions: 528,
          vacation_notices: 154,
          rate: 0.95,
          units: 247
        },
        occupancy: {
          move_ins: 188,
          move_outs: 137,
          rate: 0.93,
          units: 242,
          occupiable: 260
        }
      },
      funnel: {
        volumes: {
          usv: 54256,
          inq: 2170,
          tou: 716,
          app: 265,
          exe: 188
        },
        costs: {
          usv: "3.09",
          inq: "56.96",
          tou: "233.00",
          app: "628.00",
          exe: "886.00"
        },
        conversions: {
          usv_inq: 0.04,
          inq_tou: 0.33,
          tou_app: 0.37,
          app_exe: 0.71,
          usv_exe: 0.003
        }
      },
      four_week_funnel_averages: {
        usv: 2009,
        inq: 80,
        tou: 27,
        app: 10,
        exe: 7
      },
      investment: {
        acquisition: {
          expenses: {
            demand_creation: "110000.00",
            leasing_enablement: "0.00",
            market_intelligence: "0.00",
            reputation_building: "45000.00"
          },
          total: "155000.00",
          romi: 8,
          estimated_revenue_gain: "1200000.00"
        },
        retention: {
          expenses: {
            demand_creation: "0.00",
            leasing_enablement: "13500.00",
            market_intelligence: "0.00",
            reputation_building: "0.00"
          },
          total: "13500.00",
          romi: 1372,
          estimated_revenue_gain: "8200000.00"
        },
        total: {
          total: "168500.00",
          romi: 56,
          estimated_revenue_gain: "9400000.00"
        }
      }
    }
  ]
};

storiesOf("ModelingView", module).add("default", () => (
  <ModelingView {...props} />
));
