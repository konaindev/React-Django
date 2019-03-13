import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { linkTo } from "@storybook/addon-links";

import CampaignInvestmentReport from "./index";

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

const BASELINE_REPORT = {
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

  // XXX extra stuff displayed directly in this section but is really
  // a different part of the report structure. feels like a mismatch?
  property: {
    leasing: {
      change: 36,
      renewals: 94
    }
  }
};

const PERFORMANCE_REPORT = {
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
  property: {
    leasing: {
      change: 9,
      renewals: 7
    }
  },

  targets: {
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
    },

    property: {
      leasing: {
        change: 11,
        renewals: 10
      }
    }
  },

  deltas: {
    property: {
      leasing: {
        renewals: 2
      }
    }
  },

  whiskers: WHISKERS
};

const NEGATIVE_PERFORMANCE_REPORT = {
  investment: {
    acquisition: {
      expenses: {
        demand_creation: "10000.00",
        leasing_enablement: "1000.00",
        market_intelligence: "2000.00",
        reputation_building: "1000.00"
      },
      total: "14000.00",
      romi: -14,
      estimated_revenue_gain: "-199000.00"
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
      estimated_revenue_gain: "-155100.00"
    },
    total: {
      total: "16000.00",
      romi: -22,
      estimated_revenue_gain: "-354000.00"
    }
  },
  property: {
    leasing: {
      change: -9,
      renewals: 7
    }
  },

  targets: {
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
    },

    property: {
      leasing: {
        change: 11,
        renewals: 10
      }
    }
  },

  deltas: {
    property: {
      leasing: {
        renewals: 2
      }
    }
  },

  whiskers: WHISKERS
};

const props_baseline = {
  report: BASELINE_REPORT
};

storiesOf("CampaignInvestmentReport", module).add("baseline", () => (
  <CampaignInvestmentReport {...props_baseline} />
));

const props_performance = {
  report: PERFORMANCE_REPORT
};

storiesOf("CampaignInvestmentReport", module).add("performance", () => (
  <CampaignInvestmentReport {...props_performance} />
));

const props_negative_performance = {
  report: NEGATIVE_PERFORMANCE_REPORT
};

storiesOf("CampaignInvestmentReport", module).add(
  "negative performance",
  () => <CampaignInvestmentReport {...props_negative_performance} />
);
