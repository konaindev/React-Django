export const marketAnalysis = {
  location: "Portland, OR",
  estimated_population: {
    center: {
      type: "Point",
      coordinates: [45.52, -122.68194444]
    },
    population: 120448,
    radius: 3.1,
    units: "mi"
  },
  rent_to_income: {
    categories: [
      {
        name: "Low",
        low: 0.0,
        high: 0.12
      },
      {
        name: "Moderately Low",
        low: 0.12,
        high: 0.24
      },
      {
        name: "Target",
        low: 0.24,
        high: 0.35
      },
      {
        name: "Moderately High",
        low: 0.35,
        high: 0.45
      },
      {
        name: "High",
        low: 0.45,
        high: 0.55
      }
    ],
    incomes: [
      "50000.00",
      "100000.00",
      "200000.00",
      "300000.00",
      "400000.00",
      "500000.00"
    ],
    rental_rates: [
      "1000.00",
      "2000.00",
      "3000.00",
      "4000.00",
      "5000.00",
      "6000.00"
    ],
    data: [
      [0.24, 0.48, null, null, null, null],
      [0.12, 0.24, 0.36, 0.48, null, null],
      [0.06, 0.12, 0.18, 0.24, 0.3, 0.36],
      [0.04, 0.08, 0.12, 0.16, 0.2, 0.24],
      [0.03, 0.06, 0.09, 0.12, 0.15, 0.18],
      [0.02, 0.05, 0.07, 0.1, 0.12, 0.14]
    ]
  },
  segments: [
    {
      age_group: "18-24",
      market_size: 2794,
      segment_population: 10369,
      usv: 3561,
      growth: -0.011,
      future_size: 2703,
      income_groups: [
        {
          income: "50000.00",
          group_population: 3452,
          home_owners: {
            total: 231,
            family: 114,
            nonfamily: 117
          },
          renters: {
            total: 3311,
            family: 517,
            nonfamily: 2794
          },
          active_populations: ["renters.nonfamily"],
          market_size: 2794
        },
        {
          income: "75000.00",
          group_population: 3188,
          home_owners: {
            total: 249,
            family: 123,
            nonfamily: 126
          },
          renters: {
            total: 2940,
            family: 459,
            nonfamily: 2481
          },
          market_size: 2481,
          active_populations: ["renters.nonfamily"]
        },
        {
          income: "100000.00",
          group_population: 1587,
          home_owners: {
            total: 164,
            family: 81,
            nonfamily: 83
          },
          renters: {
            total: 1423,
            family: 83,
            nonfamily: 1201
          },
          market_size: 1201,
          active_populations: ["renters.nonfamily"]
        }
      ]
    },
    {
      age_group: "25-34",
      market_size: 9376,
      segment_population: 32219,
      usv: 5949,
      growth: 0.037,
      future_size: 10456,
      income_groups: [
        {
          income: "50000.00",
          group_population: 13829,
          home_owners: {
            total: 2865,
            family: 1331,
            nonfamily: 1534
          },
          renters: {
            total: 10964,
            family: 1588,
            nonfamily: 9376
          },
          active_populations: ["renters.nonfamily"],
          market_size: 9376
        },
        {
          income: "75000.00",
          group_population: 7710,
          home_owners: {
            total: 1896,
            family: 880,
            nonfamily: 1016
          },
          renters: {
            total: 5814,
            family: 842,
            nonfamily: 4972
          },
          market_size: 4972,
          active_populations: ["renters.nonfamily"]
        },
        {
          income: "100000.00",
          group_population: 4728,
          home_owners: {
            total: 1475,
            family: 685,
            nonfamily: 790
          },
          renters: {
            total: 3253,
            family: 471,
            nonfamily: 2782
          },
          market_size: 2782,
          active_populations: ["renters.nonfamily"]
        }
      ]
    },
    {
      age_group: "35-44",
      market_size: 3670,
      segment_population: 20033,
      usv: 4226,
      growth: 0.047,
      future_size: 4212,
      income_groups: [
        {
          income: "50000.00",
          group_population: 11031,
          home_owners: {
            total: 6300,
            family: 4308,
            nonfamily: 1992
          },
          renters: {
            total: 4731,
            family: 1061,
            nonfamily: 3670
          },
          active_populations: ["renters.nonfamily"],
          market_size: 3670
        },
        {
          income: "75000.00",
          group_population: 6892,
          home_owners: {
            total: 4363,
            family: 2983,
            nonfamily: 1380
          },
          renters: {
            total: 2529,
            family: 567,
            nonfamily: 1962
          },
          market_size: 1962,
          active_populations: ["renters.nonfamily"]
        },
        {
          income: "100000.00",
          group_population: 4406,
          home_owners: {
            total: 3204,
            family: 2191,
            nonfamily: 1013
          },
          renters: {
            total: 1202,
            family: 270,
            nonfamily: 932
          },
          market_size: 932,
          active_populations: ["renters.nonfamily"]
        }
      ]
    },
    {
      age_group: "45-54",
      market_size: 3621,
      segment_population: 14257,
      usv: 2973,
      growth: 0.005,
      future_size: 3676,
      income_groups: [
        {
          income: "50000.00",
          group_population: 7829,
          home_owners: {
            total: 5336,
            family: 3649,
            nonfamily: 1687
          },
          renters: {
            total: 2493,
            family: 559,
            nonfamily: 1934
          },
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"],
          market_size: 3621
        },
        {
          income: "75000.00",
          group_population: 5040,
          home_owners: {
            total: 3713,
            family: 2539,
            nonfamily: 1174
          },
          renters: {
            total: 1327,
            family: 298,
            nonfamily: 1029
          },
          market_size: 2203,
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"]
        },
        {
          income: "100000.00",
          group_population: 3322,
          home_owners: {
            total: 2714,
            family: 1856,
            nonfamily: 858
          },
          renters: {
            total: 608,
            family: 136,
            nonfamily: 472
          },
          market_size: 1330,
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"]
        }
      ]
    },
    {
      age_group: "55-64",
      market_size: 3567,
      segment_population: 14782,
      usv: 2253,
      growth: 0.027,
      future_size: 3864,
      income_groups: [
        {
          income: "50000.00",
          group_population: 7607,
          home_owners: {
            total: 5077,
            family: 3472,
            nonfamily: 1605
          },
          renters: {
            total: 2530,
            family: 568,
            nonfamily: 1962
          },
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"],
          market_size: 3567
        },
        {
          income: "75000.00",
          group_population: 5040,
          home_owners: {
            total: 3577,
            family: 2446,
            nonfamily: 1131
          },
          renters: {
            total: 1363,
            family: 306,
            nonfamily: 1057
          },
          market_size: 2188,
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"]
        },
        {
          income: "100000.00",
          group_population: 3264,
          home_owners: {
            total: 2632,
            family: 1800,
            nonfamily: 832
          },
          renters: {
            total: 632,
            family: 142,
            nonfamily: 490
          },
          market_size: 1322,
          active_populations: ["home_owners.nonfamily", "renters.nonfamily"]
        }
      ]
    },
    {
      age_group: "65+",
      market_size: 7312,
      segment_population: 15979,
      usv: 659,
      growth: 0.0397,
      future_size: 8218,
      income_groups: [
        {
          income: "50000.00",
          group_population: 7312,
          home_owners: {
            total: 4626,
            family: 2476,
            nonfamily: 2150
          },
          renters: {
            total: 2686,
            family: 457,
            nonfamily: 2229
          },
          active_populations: [
            "home_owners.family",
            "home_owners.nonfamily",
            "renters.family",
            "renters.nonfamily"
          ],
          market_size: 7312
        },
        {
          income: "75000.00",
          group_population: 6048,
          home_owners: {
            total: 4484,
            family: 2400,
            nonfamily: 2084
          },
          renters: {
            total: 1564,
            family: 266,
            nonfamily: 1298
          },
          market_size: 6048,
          active_populations: [
            "home_owners.family",
            "home_owners.nonfamily",
            "renters.family",
            "renters.nonfamily"
          ]
        },
        {
          income: "100000.00",
          group_population: 3340,
          home_owners: {
            total: 1947,
            family: 1042,
            nonfamily: 905
          },
          renters: {
            total: 906,
            family: 237,
            nonfamily: 1156
          },
          market_size: 3340,
          active_populations: [
            "home_owners.family",
            "home_owners.nonfamily",
            "renters.family",
            "renters.nonfamily"
          ]
        }
      ]
    }
  ],
  future_year: 2022,
  total: {
    segment_population: 120448,
    market_size: 30340,
    usv: 19621,
    future_size: 33129
  },
  average: {
    age: 34,
    growth: 0.024
  }
};

export default marketAnalysis;
