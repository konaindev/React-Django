import { project, report_links } from "../project_page/props";
import { funnel_history } from "../funnel_performance_analysis/FunnelProps";

export const competitors = [
  {
    dates: {
      start: "2017-01-03",
      end: "2018-05-07"
    },
    address: {
      street_address_1: "2284 W. Commodore Way, Suite 200",
      street_address_2: "",
      city: "Seattle",
      state: "WA",
      zip_code: "98199",
      country: "US",
      formatted_address: ""
    },
    property_name: "Two Lincoln Tower",
    property: {
      average_monthly_rent: "7278.00",
      lowest_monthly_rent: "7278.00",
      total_units: 200,
      cost_per_exe_vs_rent: 0.33586699642759,
      leasing: {
        change: 20,
        cds: 0,
        cd_rate: 0.0,
        renewal_notices: 0,
        renewals: 0,
        renewal_rate: 0,
        resident_decisions: 0,
        vacation_notices: 0,
        rate: 0.42201834862385323,
        units: 92
      },
      occupancy: {
        move_ins: 0,
        move_outs: 0,
        rate: 0.0,
        units: 0,
        occupiable: 218
      }
    },
    funnel: {
      volumes: {
        usv: 10786,
        inq: 487,
        tou: 269,
        app: 30,
        exe: 27
      },
      costs: {
        usv: "6.12",
        inq: "135.52",
        tou: "245.35",
        app: "2200.00",
        exe: "2444.44"
      },
      conversions: {
        usv_inq: 0.04515112182458743,
        inq_tou: 0.5523613963039015,
        tou_app: 0.11152416356877323,
        app_exe: 0.9,
        usv_exe: 0.002503244947153718
      }
    },
    investment: {
      acquisition: {
        total: "66000.00",
        romi: 26,
        estimated_revenue_gain: "1746720.00",
        expenses: {
          demand_creation: "46000.00",
          leasing_enablement: "0.00",
          market_intelligence: "0.00",
          reputation_building: "20000.00"
        }
      },
      retention: {
        total: "0.00",
        romi: 0,
        estimated_revenue_gain: "0.00",
        expenses: {
          demand_creation: "0.00",
          leasing_enablement: "0.00",
          market_intelligence: "0.00",
          reputation_building: "0.00"
        }
      },
      total: {
        total: "66000.00",
        romi: 26,
        estimated_revenue_gain: "1746720.00"
      }
    },
    targets: {
      property: {
        leasing: {
          rate: "0.900",
          units: "196"
        },
        occupancy: {
          occupiable: 218
        }
      },
      funnel: {
        volumes: {},
        costs: {},
        conversions: {}
      },
      investment: {
        acquisition: {
          expenses: {}
        },
        retention: {
          expenses: {}
        },
        total: {}
      }
    },
    four_week_funnel_averages: {
      usv: 615,
      inq: 28,
      tou: 15,
      app: 2,
      exe: 2
    },
    funnel_history: [
      {
        month: "2017-01",
        monthly_volumes: {
          usv: 792,
          inq: 36,
          tou: 21,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5833333333333334,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [22, 154, 154, 154, 154, 154],
          inq: [1, 7, 7, 7, 7, 7],
          tou: [1, 4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            1.0,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-02",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-03",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-04",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-05",
        monthly_volumes: {
          usv: 770,
          inq: 35,
          tou: 20,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154, 154],
          inq: [7, 7, 7, 7, 7],
          tou: [4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-06",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-07",
        monthly_volumes: {
          usv: 770,
          inq: 35,
          tou: 20,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154, 154],
          inq: [7, 7, 7, 7, 7],
          tou: [4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-08",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-09",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-10",
        monthly_volumes: {
          usv: 770,
          inq: 35,
          tou: 20,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154, 154],
          inq: [7, 7, 7, 7, 7],
          tou: [4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-11",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2017-12",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2018-01",
        monthly_volumes: {
          usv: 770,
          inq: 35,
          tou: 20,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154, 154],
          inq: [7, 7, 7, 7, 7],
          tou: [4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2018-02",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2018-03",
        monthly_volumes: {
          usv: 616,
          inq: 28,
          tou: 16,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154],
          inq: [7, 7, 7, 7],
          tou: [4, 4, 4, 4],
          app: [0, 0, 0, 0],
          exe: [0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0]
        }
      },
      {
        month: "2018-04",
        monthly_volumes: {
          usv: 770,
          inq: 35,
          tou: 20,
          app: 0,
          exe: 0
        },
        monthly_conversions: {
          usv_inq: 0.045454545454545456,
          inq_tou: 0.5714285714285714,
          tou_app: 0.0,
          app_exe: 0,
          usv_exe: 0.0
        },
        weekly_volumes: {
          usv: [154, 154, 154, 154, 154],
          inq: [7, 7, 7, 7, 7],
          tou: [4, 4, 4, 4, 4],
          app: [0, 0, 0, 0, 0],
          exe: [0, 0, 0, 0, 0]
        },
        weekly_conversions: {
          usv_inq: [
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456,
            0.045454545454545456
          ],
          inq_tou: [
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714,
            0.5714285714285714
          ],
          tou_app: [0.0, 0.0, 0.0, 0.0, 0.0],
          app_exe: [0, 0, 0, 0, 0],
          usv_exe: [0.0, 0.0, 0.0, 0.0, 0.0]
        }
      }
    ],
    whiskers: {},
    deltas: {}
  },
  {
    dates: {
      start: "2019-02-12",
      end: "2019-03-26"
    },
    address: {
      street_address_1: "2284 W. Commodore Way, Suite 200",
      street_address_2: "",
      city: "Seattle",
      state: "WA",
      zip_code: "98199",
      country: "US",
      formatted_address: ""
    },
    property_name: "BDX at Capital Village",
    property: {
      average_monthly_rent: "1948.00",
      lowest_monthly_rent: "1400.00",
      total_units: null,
      cost_per_exe_vs_rent: 0.10715,
      leasing: {
        change: 28,
        cds: 6,
        cd_rate: 0.16216216216216217,
        renewal_notices: 0,
        renewals: 0,
        renewal_rate: 0.0,
        resident_decisions: 2,
        vacation_notices: 2,
        rate: 0.7386934673366834,
        units: 147
      },
      occupancy: {
        move_ins: 31,
        move_outs: 2,
        rate: 0.7336683417085427,
        units: 146,
        occupiable: 199
      }
    },
    funnel: {
      volumes: {
        usv: 0,
        inq: 137,
        tou: 35,
        app: 37,
        exe: 31
      },
      costs: {
        usv: "0.00",
        inq: "33.94",
        tou: "132.87",
        app: "125.68",
        exe: "150.01"
      },
      conversions: {
        usv_inq: 0,
        inq_tou: 0.25547445255474455,
        tou_app: 1.0571428571428572,
        app_exe: 0.8378378378378378,
        usv_exe: 0
      }
    },
    investment: {
      acquisition: {
        total: "4650.30",
        romi: 141,
        estimated_revenue_gain: "654528.00",
        expenses: {
          demand_creation: "4650.30",
          leasing_enablement: "0.00",
          market_intelligence: "0.00",
          reputation_building: "0.00"
        }
      },
      retention: {
        total: "825.00",
        romi: 0,
        estimated_revenue_gain: "0.00",
        expenses: {
          demand_creation: "0.00",
          leasing_enablement: "825.00",
          market_intelligence: "0.00",
          reputation_building: "0.00"
        }
      },
      total: {
        total: "5475.30",
        romi: 120,
        estimated_revenue_gain: "654528.00"
      }
    },
    targets: {
      property: {
        leasing: {},
        occupancy: {
          occupiable: 199
        }
      },
      funnel: {
        volumes: {},
        costs: {},
        conversions: {}
      },
      investment: {
        acquisition: {
          expenses: {}
        },
        retention: {
          expenses: {}
        },
        total: {}
      }
    },
    four_week_funnel_averages: {
      usv: 0,
      inq: 93,
      tou: 15,
      app: 25,
      exe: 23
    },
    funnel_history: [
      {
        month: "2019-02",
        monthly_volumes: {
          usv: 0,
          inq: 67,
          tou: 10,
          app: 24,
          exe: 22
        },
        monthly_conversions: {
          usv_inq: 0,
          inq_tou: 0.14925373134328357,
          tou_app: 2.4,
          app_exe: 0.9166666666666666,
          usv_exe: 0
        },
        weekly_volumes: {
          usv: [0, 0, 0],
          inq: [36, 16, 15],
          tou: [3, 2, 5],
          app: [14, 6, 4],
          exe: [14, 5, 3]
        },
        weekly_conversions: {
          usv_inq: [0, 0, 0],
          inq_tou: [0.08333333333333333, 0.125, 0.3333333333333333],
          tou_app: [4.666666666666667, 3.0, 0.8],
          app_exe: [1.0, 0.8333333333333334, 0.75],
          usv_exe: [0, 0, 0]
        }
      },
      {
        month: "2019-03",
        monthly_volumes: {
          usv: 0,
          inq: 70,
          tou: 25,
          app: 13,
          exe: 9
        },
        monthly_conversions: {
          usv_inq: 0,
          inq_tou: 0.35714285714285715,
          tou_app: 0.52,
          app_exe: 0.6923076923076923,
          usv_exe: 0
        },
        weekly_volumes: {
          usv: [0, 0, 0, 0],
          inq: [23, 23, 21, 3],
          tou: [4, 10, 10, 1],
          app: [1, 3, 8, 1],
          exe: [1, 2, 5, 1]
        },
        weekly_conversions: {
          usv_inq: [0, 0, 0, 0],
          inq_tou: [
            0.17391304347826086,
            0.43478260869565216,
            0.47619047619047616,
            0.3333333333333333
          ],
          tou_app: [0.25, 0.3, 0.8, 1.0],
          app_exe: [1.0, 0.6666666666666666, 0.625, 1.0],
          usv_exe: [0, 0, 0, 0]
        }
      }
    ],
    whiskers: {},
    deltas: {}
  }
];

export const report = {
  dates: {
    start: "2017-07-24",
    end: "2018-07-23"
  },
  address: {
    street_address_1: "2284 W. Commodore Way, Suite 200",
    street_address_2: "",
    city: "Seattle",
    state: "WA",
    zip_code: "98199",
    country: "US",
    formatted_address: ""
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
  competitors,
  funnel_history
};

const current_report_link = report_links.baseline;

const share_info = {
  shared: true,
  share_url: `/projects/${project.public_id}/share/baseline/`
};

export default {
  project,
  report,
  report_links,
  current_report_link,
  share_info
};
