import { project, report_links } from "../project_page/props";
import { funnel_history } from "../funnel_performance_analysis/FunnelProps";

export const report = {
  dates: {
    start: "2017-07-24",
    end: "2018-07-23"
  },
  property_name: "Portland Multi-Family",
  property: {
    average_monthly_rent: "1847.00",
    lowest_monthly_rent: "1847.00",
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
  investment: {
    acquisition: {
      expenses: {
        demand_creation: "48000.00",
        leasing_enablement: "0.00",
        market_intelligence: "0.00",
        reputation_building: "20000.00"
      },
      total: "68000.00",
      romi: 10,
      estimated_revenue_gain: "709200.00"
    },
    retention: {
      expenses: {
        demand_creation: "0.00",
        leasing_enablement: "6000.00",
        market_intelligence: "0.00",
        reputation_building: "0.00"
      },
      total: "6000.00",
      romi: 346,
      estimated_revenue_gain: "2080000.00"
    },
    total: {
      total: "74000.00",
      romi: 38,
      estimated_revenue_gain: "2800000.00"
    }
  },
  four_week_funnel_averages: {
    usv: 1509,
    inq: 60,
    tou: 20,
    app: 7,
    exe: 5
  },
  funnel_history
};

const current_report_link = report_links.baseline;

const share_info = {
  shared: true,
  share_url: `/projects/${project.public_id}/share/baseline/`,
  update_action: "shared_reports"
};

export default {
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
