
import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import LeasingPerformanceReport from './index';

const BASELINE_REPORT = {
  "dates": {
    "start": "2017-07-24",
    "end": "2018-07-23"
  },
  "property_name": "Portland Multi-Family",
  "property": {
    "monthly_average_rent": "1847.00",
    "cost_per_exe_vs_rent": 0.54,
    "leasing": {
      "change": 36,
      "cds": 28,
      "cd_rate": 0.29,
      "renewal_notices": 94,
      "renewals": 94,
      "vacation_notices": 38,
      "rate": 0.74,
      "units": 192
    },
    "occupancy": {
      "move_ins": 72,
      "move_outs": 36,
      "rate": 0.71,
      "units": 185
    }
  },
  "funnel": {
    "volumes": {
      "usv": 19621,
      "inq": 785,
      "tou": 259,
      "app": 96,
      "exe": 68
    },
    "costs": {
      "usv": "3.47",
      "inq": "86.62",
      "tou": "262.00",
      "app": "708.00",
      "exe": "1000.00"
    },
    "conversions": {
      "usv_inq": 0.04,
      "inq_tou": 0.33,
      "tou_app": 0.37,
      "app_exe": 0.71,
      "usv_exe": 0.003
    }
  },
  "investment": {
    "acquisition": {
      "expenses": {
        "demand_creation": "48000.00",
        "leasing_enablement": "0.00",
        "market_intelligence": "0.00",
        "reputation_building": "20000.00"
      },
      "total": "68000.00",
      "romi": 10,
      "estimated_revenue_gain": "709200.00"
    },
    "retention": {
      "expenses": {
        "demand_creation": "0.00",
        "leasing_enablement": "6000.00",
        "market_intelligence": "0.00",
        "reputation_building": "0.00"
      },
      "total": "6000.00",
      "romi": 346,
      "estimated_revenue_gain": "2080000.00"
    },
    "total": {
      "total": "74000.00",
      "romi": 38,
      "estimated_revenue_gain": "2800000.00"
    }
  },
  "four_week_funnel_averages": {
    "usv": 1509,
    "inq": 60,
    "tou": 20,
    "app": 7,
    "exe": 5
  }
};

const props = {
  report: BASELINE_REPORT
};

storiesOf('LeasingPerformanceReport', module).add('default', () => <LeasingPerformanceReport {...props} />);
