import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import AcquisitionFunnelReport from "./index";

const BASELINE_REPORT = {
  // the funnel itself
  funnel: {
    volumes: {
      usv: 19621,
      inq: 785,
      tou: 259,
      app: 96,
      exe: 68
    },
    costs: {
      usv: "3.47",
      inq: "86.62",
      tou: "262.00",
      app: "708.00",
      exe: "1000.00"
    },
    conversions: {
      usv_inq: 0.04,
      inq_tou: 0.33,
      tou_app: 0.37,
      app_exe: 0.71,
      usv_exe: 0.003
    }
  },

  // XXX extra stuff displayed directly under the words "ACQUISITION FUNNEL"
  // but that probably shouldn't be part of this react component?
  property: {
    cost_per_exe_vs_rent: 0.54,
    leasing: {
      cd_rate: 0.29
    }
  }
};

const PERFORMANCE_REPORT = {
  funnel: {
    volumes: {
      usv: 3008,
      inq: 150,
      tou: 57,
      app: 16,
      exe: 13
    },
    costs: {
      usv: "4.32",
      inq: "86.67",
      tou: "246.00",
      app: "875.00",
      exe: "1077.44"
    },
    conversions: {
      usv_inq: 0.05,
      inq_tou: 0.38,
      tou_app: 0.28,
      app_exe: 0.8,
      usv_exe: 0.004
    }
  },
  property: {
    cost_per_exe_vs_rent: 0.58,
    leasing: {
      cd_rate: 0.2
    }
  },
  targets: {
    funnel: {
      volumes: {
        usv: 2136,
        inq: 128,
        tou: 52,
        app: 19,
        exe: 16
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
    property: {
      cost_per_exe_vs_rent: 1.03,
      leasing: {
        cd_rate: 0.2
      }
    }
  },
  deltas: {
    funnel: {
      volumes: {
        usv: 423,
        inq: -19,
        tou: 2,
        app: -2,
        exe: -1
      },
      costs: {
        usv: "1.67",
        inq: "24.76",
        tou: "-120.00",
        app: "-202.00",
        exe: "-539.00"
      },
      conversions: {
        usv_inq: -0.01,
        inq_tou: 0.01,
        tou_app: -0.02,
        app_exe: 0.02,
        usv_exe: -0.001
      }
    },
    property: {
      cost_per_exe_vs_rent: -0.2,
      leasing: {
        cd_rate: 0.03
      }
    }
  }
};

const props_baseline = {
  report: BASELINE_REPORT
};

storiesOf("AcquisitionFunnelReport", module).add("baseline", () => (
  <AcquisitionFunnelReport {...props_baseline} />
));

const props_performance = {
  report: PERFORMANCE_REPORT
};

storiesOf("AcquisitionFunnelReport", module).add("performance", () => (
  <AcquisitionFunnelReport {...props_performance} />
));
