export const project = {
  public_id: "pro_example",
  name: "Portland Multi Family",
  building_image: [
    "https://i.imgur.com/UEH4gfU.jpg",
    "https://i.imgur.com/UEH4gfU.jpg",
    "https://i.imgur.com/UEH4gfU.jpg",
  ],
  health: 2,
  update_endpoint: "/projects/pro_example/update/"
};

export const user = {
  email: "test@remarkably.io",
  user_id: "1234556960",
  account_id: "5678899",
  account_name: "Remarkably Client",
  profile_image_url:
    "https://storage.googleapis.com/tracker-avatar-production/a11569ffecab2b5564c0cbfa5e5f283a_3140620_96.png",
  logout_url: "/user/logout",
  account_url: "/user/1234556960"
};

// see data/schemas/ts/ReportLinks.ts and data/examples/ReportLinks.json
export const report_links = {
  baseline: {
    url: "/projects/pro_example/baseline/",
    description: "Baseline Period (Jan 01 2017 - May 07 2018)"
  },
  performance: [
    {
      url: "/projects/pro_example/performance/last-week/",
      description: "Last Week (Dec 24 2018 - Dec 31 2018)"
    },
    {
      url: "/projects/pro_example/performance/last-two-weeks/",
      description: "Last Two Weeks (Dec 17 2018 - Dec 31 2018)"
    },
    {
      url: "/projects/pro_example/performance/last-four-weeks/",
      description: "Last Four Weeks (Dec 03 2018 - Dec 31 2018)"
    },
    {
      url: "/projects/pro_example/performance/campaign/",
      description: "Campaign To Date (May 07 2018 - Dec 31 2018)"
    },
    {
      url: "/projects/pro_example/report/2018-05-07,2018-05-14/",
      description: "May 07 2018 - May 14 2018"
    },
    {
      url: "/projects/pro_example/report/2018-05-14,2018-05-21/",
      description: "May 14 2018 - May 21 2018"
    },
    {
      url: "/projects/pro_example/report/2018-05-21,2018-05-28/",
      description: "May 21 2018 - May 28 2018"
    },
    {
      url: "/projects/pro_example/report/2018-05-28,2018-06-04/",
      description: "May 28 2018 - Jun 04 2018"
    },
    {
      url: "/projects/pro_example/report/2018-06-04,2018-06-11/",
      description: "Jun 04 2018 - Jun 11 2018"
    },
    {
      url: "/projects/pro_example/report/2018-06-11,2018-06-18/",
      description: "Jun 11 2018 - Jun 18 2018"
    },
    {
      url: "/projects/pro_example/report/2018-06-18,2018-06-25/",
      description: "Jun 18 2018 - Jun 25 2018"
    }
  ],
  modeling: null,
  market: {
    url: "/projects/pro_example/market/",
    description: "Total Addressable Market"
  }
};

export const props = { project, report_links, user };
