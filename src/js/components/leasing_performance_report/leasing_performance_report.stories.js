import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import LeasingPerformanceReport from "./index";

// dummy data
const WHISKERS = {
  leased_rate: [
    0.42660550458715596,
    0.43577981651376146,
    0.45871559633027525,
    0.46788990825688076,
    0.47706422018348627,
    0.48623853211009177,
    0.47706422018348627,
    0.4908256880733945
  ],
  renewal_rate: [0, 0, 0, 0, 0, 0, 0, 0],
  occupancy_rate: [0, 0, 0, 0, 0, 0, 0, 0],
  investment: [
    "72423.68000000000000000000000",
    "57905.99428571428571428571429",
    "59330.05857142857142857142857",
    "59031.11285714285714285714285",
    "49871.65428571428571428571429",
    "52305.25142857142857142857143",
    "47768.74571428571428571428571",
    "38481.32000000000000000000000"
  ],
  usv_exe: [
    0,
    0.0002840909090909091,
    0.0018527095877721167,
    0.0012353304508956147,
    0.0014962593516209476,
    0.001051801209571391,
    0.0007228044813877846,
    0.0017927572606669057
  ],
  lease_cd_rate: [0, 0, 0, 0, 0, 0, 0, 0],
  cost_per_exe_vs_rent: [
    0,
    7.95630530365485,
    1.0189969771915361,
    1.3518164330860127,
    1.1420637537785105,
    1.7966900247320692,
    3.281721626820555,
    1.0574690849134378
  ]
};

export const BASELINE_REPORT = {
  property: {
    average_monthly_rent: "1847.00",
    cost_per_exe_vs_rent: 0.54,
    total_units: 201,
    leasing: {
      change: 36,
      cds: 28,
      cd_rate: 0.29,
      renewal_notices: 94,
      renewals: 94,
      renewal_rate: 0.71,
      resident_decisions: 132,
      vacation_notices: 38,
      rate: 0.74,
      units: 192
    },
    occupancy: {
      move_ins: 72,
      move_outs: 36,
      rate: 0.71,
      units: 185,
      occupiable: 260
    }
  },
  funnel: {
    volumes: {
      usv: 19621,
      inq: 785,
      tou: 259,
      app: 96,
      exe: 68
    }
  }
};

export const PERFORMANCE_REPORT = {
  property: {
    average_monthly_rent: "1856.00",
    cost_per_exe_vs_rent: 0.58,
    total_units: 201,
    leasing: {
      change: 9,
      cds: 3,
      cd_rate: 0.2,
      renewal_notices: 7,
      renewals: 7,
      renewal_rate: 0.6,
      resident_decisions: 11,
      vacation_notices: 5,
      rate: 0.87,
      units: 227
    },
    occupancy: {
      move_ins: 13,
      move_outs: 4,
      rate: 0.85,
      units: 220,
      occupiable: 260
    }
  },
  funnel: {
    volumes: {
      usv: 3008,
      inq: 150,
      tou: 57,
      app: 16,
      exe: 13
    }
  },

  targets: {
    property: {
      average_monthly_rent: "7278.00",
      cost_per_exe_vs_rent: 1.03,
      leasing: {
        change: 11,
        cds: 4,
        cd_rate: 0.2,
        renewal_notices: 6,
        renewals: 10,
        renewal_rate: 0.63,
        vacation_notices: 3,
        rate: 0.95
      },
      occupancy: {
        move_ins: 15,
        move_outs: 3,
        rate: 0.93
      }
    },
    funnel: {
      volumes: {
        usv: 2136,
        inq: 128,
        tou: 52,
        app: 19,
        exe: 16
      }
    }
  },

  deltas: {
    property: {
      cost_per_exe_vs_rent: -0.2,
      leasing: {
        cds: -1,
        cd_rate: 0.03,
        renewal_notices: 2,
        renewals: 2,
        vacation_notices: -1,
        rate: 0.02
      },
      occupancy: {
        move_ins: 0,
        move_outs: 1,
        rate: 0.04
      }
    },
    funnel: {
      volumes: {
        usv: 423,
        inq: -19,
        tou: 2,
        app: -2,
        exe: -1
      }
    }
  },

  whiskers: WHISKERS
};

const props_baseline = {
  report: BASELINE_REPORT
};

storiesOf("LeasingPerformanceReport", module).add("baseline", () => (
  <LeasingPerformanceReport {...props_baseline} />
));

const props_performance = {
  report: PERFORMANCE_REPORT
};

storiesOf("LeasingPerformanceReport", module).add("performance", () => (
  <LeasingPerformanceReport {...props_performance} />
));

const props_section_items = {
  sectionItems: <div>"I AM SECTION ITEMS"</div>,
  ...props_performance
};

storiesOf("LeasingPerformanceReport", module).add("with section items", () => (
  <LeasingPerformanceReport {...props_section_items} />
));
