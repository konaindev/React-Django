import { project, report_links } from "../project_page/props";

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

const report = {
  dates: {
    start: "2018-09-24",
    end: "2018-10-22"
  },
  property_name: "Portland Multi Family",
  property: {
    lowest_monthly_rent: "1856.90",
    average_monthly_rent: "1856.90",
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
  investment: {
    acquisition: {
      expenses: {
        demand_creation: "10000.00",
        leasing_enablement: "1000.00",
        market_intelligence: "2000.00",
        reputation_building: "1000.00"
      },
      total: "14000.00",
      romi: 14,
      estimated_revenue_gain: "199000.00"
    },
    retention: {
      expenses: {
        demand_creation: "0.00",
        leasing_enablement: "2000.00",
        market_intelligence: "0.00",
        reputation_building: "0.00"
      },
      total: "2000.00",
      romi: 78,
      estimated_revenue_gain: "155100.00"
    },
    total: {
      total: "16000.00",
      romi: 22,
      estimated_revenue_gain: "354000.00"
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
    investment: {
      acquisition: {
        total: "15000.00",
        romi: 7,
        estimated_revenue_gain: "228500.00"
      },
      retention: {
        total: "2000.00",
        romi: 142,
        estimated_revenue_gain: "266600.00"
      },
      total: {
        total: "17000.00",
        romi: 14,
        estimated_revenue_gain: "495200.00"
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
        renewal_rate: 0,
        renewals: 2,
        vacation_notices: -1,
        rate: 0.000499
      },
      occupancy: {
        move_ins: 0,
        move_outs: 1,
        rate: 0.04
      }
    },
    investment: {
      total: {
        total: "-1400.00"
      }
    },
    funnel: {
      volumes: {
        usv: 423,
        inq: -19,
        tou: 2,
        app: -2,
        exe: -1
      },
      costs: {
        usv: "0.049",
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
    }
  },
  whiskers: WHISKERS
};

const current_report_link = {
  url: "/projects/pro_example/performance/last-four-weeks/",
  description: "Last Four Weeks (Dec 03 2018 - Dec 31 2018)"
};
const share_info = {
  shared: false,
  share_url: `/projects/${
    project.public_id
  }/share/performance/last-four-weeks/`,
  update_action: "shared_reports"
};

export default {
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
