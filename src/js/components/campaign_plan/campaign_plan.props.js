export default {
  overview: {
    theme: "Variable by audience, market, and asset",
    target_segments: [
      {
        ordinal: "Primary",
        description: "Young Professionals (25-34)"
      },
      {
        ordinal: "Secondary",
        description: "Young Entrepreneurs (25-34)"
      },
      {
        ordinal: "Tertiary",
        description: "Young Couples (35-40)"
      },
      {
        ordinal: "Quarternary",
        description: "Established Singles (35-44)"
      }
    ],
    goal: "Achieve 95% lease-up by 6/30/2019",
    objectives: [
      {
        title: "Reputation Building",
        description:
          "Grow reach and shape perceptions\n* Attract 11,979 USV\n* Attract 1,000 social followers\n* Add 1,100 contacts to property database (email list)"
      },
      {
        title: "Demand Creation",
        description:
          "Generate INQs and USVs:\n* Convert 6% of USVs to INQs\n* Attract 696 Inquires (calls, emails, walk-ins, chats, texts)\n* Conduct 270 tours (at 40% INQ>Tour conversion rate)"
      },
      {
        title: "Leasing Enablement",
        description:
          "Equip leasing team with effective processes and tools that delight\n* Provide highly responsive process for handling INQ and Tours\n* Capture 97 signed leases"
      },
      {
        title: "Marketing Intelligence",
        description:
          "Capture resident and prospect data:\n* Capture prospect data on website\n* Capture resident data about satisfaction and retention"
      }
    ],
    assumptions:
      "* Asset contains 260 units\n* 20% C&D rate\n* Model based on predictions generated in Sept. 2018",
    schedule: "Campaign begins in Feb. 2019 and finishes in July 2019",
    target_investments: {
      reputation_building: {
        total: "20000.00",
        acquisition: "15000.00",
        retention: "5000.00"
      },
      demand_creation: {
        total: "15000.00",
        acquisition: "5000.00",
        retention: "10000.00"
      },
      leasing_enablement: {
        total: "20000.00",
        acquisition: "10000.00",
        retention: "10000.00"
      },
      market_intelligence: {
        total: "20500.00",
        acquisition: "20000.00",
        retention: "500.00"
      },
      total: {
        total: "75500.00",
        acquisition: "50000.00",
        retention: "25500.00"
      }
    }
  },
  reputation_building: {
    tactics: [
      {
        name: "Brand Strategy",
        audience: "Acquisition",
        tooltip: null,
        schedule: "2019-01-20",
        status: "Complete",
        notes: null,
        base_cost: "15000.00",
        cost_type: "One-Time",
        total_cost: "15000.00"
      },
      {
        name: "Messaging Matrix",
        audience: "Retention",
        tooltip: null,
        schedule: "2019-02-01",
        status: "Complete",
        notes: null,
        base_cost: "5000.00",
        cost_type: "One-Time",
        total_cost: "5000.00"
      },
      {
        name: "Website Enhancements",
        audience: null,
        tooltip: null,
        schedule: "2019-02-01",
        status: "In Progress",
        notes: null,
        base_cost: "5000.00",
        cost_type: "One-Time",
        total_cost: "5000.00"
      },
      {
        name: "Beach Lifestyle Photoshoot",
        audience: null,
        tooltip: null,
        schedule: "2019-02-15",
        status: "Not Started",
        notes: null,
        base_cost: "10000.00",
        cost_type: "One-Time",
        total_cost: "10000.00"
      }
    ]
  },
  demand_creation: {
    tactics: [
      {
        name: "Paid Search Advertising",
        audience: "Acquisition",
        tooltip: "Google Search Ads",
        schedule: "2019-07-02",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 1000,
          inq: 0
        },
        costs: {
          usv: "5.00",
          inq: null
        }
      },
      {
        name: "Paid Social Advertising",
        audience: "Retention",
        tooltip: null,
        schedule: "2019-07-03",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 1000,
          inq: 0
        },
        costs: {
          usv: "5.00",
          inq: null
        }
      },
      {
        name: "Retargeted Display Advertising",
        audience: null,
        tooltip: null,
        schedule: "2019-07-04",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 1000,
          inq: 0
        },
        costs: {
          usv: "5.00",
          inq: null
        }
      },
      {
        name: "Display Advertising",
        audience: null,
        tooltip: null,
        schedule: "2019-07-05",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 1000,
          inq: 0
        },
        costs: {
          usv: "5.00",
          inq: null
        }
      },
      {
        name: "Apartments.com Advertising",
        audience: null,
        tooltip: null,
        schedule: "2019-07-06",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 1000,
          inq: 0
        },
        costs: {
          usv: "5.00",
          inq: null
        }
      },
      {
        name: "Zillow.com Advertising",
        audience: null,
        tooltip: null,
        schedule: "2019-07-07",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 500,
          inq: 100
        },
        costs: {
          usv: "10.00",
          inq: "50.00"
        }
      },
      {
        name: "ApartmentList.com Advertising",
        audience: null,
        tooltip: null,
        schedule: "2019-07-08",
        status: "In Progress",
        notes: null,
        base_cost: "1000.00",
        cost_type: "Monthly",
        total_cost: "5000.00",
        volumes: {
          usv: 500,
          inq: 100
        },
        costs: {
          usv: "10.00",
          inq: "50.00"
        }
      },
      {
        name: "Website Live Chat Implementation",
        audience: null,
        tooltip: null,
        schedule: "2019-02-22",
        status: "Complete",
        notes: null,
        base_cost: "2000.00",
        cost_type: "One-Time",
        total_cost: "2000.00",
        volumes: {
          usv: 0,
          inq: 0
        },
        costs: {
          usv: null,
          inq: null
        }
      },
      {
        name: "Website Live Chat Service",
        audience: null,
        tooltip: "Sustain or improve USV>INQ rate",
        schedule: "2019-07-08",
        status: "In Progress",
        notes: null,
        base_cost: "200.00",
        cost_type: "Monthly",
        total_cost: "1000.00",
        volumes: {
          usv: 0,
          inq: 0
        },
        costs: {
          usv: null,
          inq: null
        }
      }
    ]
  },
  leasing_enablement: {
    tactics: [
      {
        name: "Brochure Redesign & Print",
        audience: "Acquisition",
        tooltip: null,
        schedule: "2019-02-01",
        status: "Complete",
        notes: null,
        base_cost: "10000.00",
        cost_type: "One-Time",
        total_cost: "10000.00"
      },
      {
        name: "Tour Souvenirs",
        audience: "Retention",
        tooltip: null,
        schedule: "2019-02-15",
        status: "Complete",
        notes: null,
        base_cost: "10000.00",
        cost_type: "One-Time",
        total_cost: "10000.00"
      },
      {
        name: "Wayfinding Signage",
        audience: null,
        tooltip: null,
        schedule: "2019-05-01",
        status: "In Progress",
        notes: null,
        base_cost: "15000.00",
        cost_type: "One-Time",
        total_cost: "15000.00"
      }
    ]
  },
  market_intelligence: {
    tactics: [
      {
        name: "Remarkably",
        audience: "Acquisition",
        tooltip: "Baseline, Modeling, and Campaign Plan",
        schedule: "2019-01-01",
        status: "Complete",
        notes: "Outsourced/Hard costs only",
        base_cost: "4000.00",
        cost_type: "Monthly",
        total_cost: "20000.00"
      },
      {
        name: "Google and Social Analytics",
        audience: "Retention",
        tooltip:
          "Tactical, deep-dive website traffic and social follower engagement data and insights",
        schedule: "2019-06-30",
        status: "In Progress",
        notes: "Implementing monitoring, tracking, and reporting",
        base_cost: "500.00",
        cost_type: "Monthly",
        total_cost: "2500.00"
      }
    ]
  }
};
