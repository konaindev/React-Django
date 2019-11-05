export const reportLinksAll = {
  baseline: {
    url: "/projects/pro_example/baseline/",
    description: "Baseline Period (Jan 01 2017 - May 07 2018)"
  },
  performance: [
    {
      url: "/projects/pro_example/performance/last-week/",
      description: "Last Week (Dec 24 2018 - Dec 31 2018)"
    }
  ],
  modeling: {
    url: "/projects/pro_example/modeling/",
    description: "Modeling"
  },
  campaign_plan: {
    url: "/projects/pro_example/campaign_plan/",
    description: "Campaign Plan"
  },
  market: {
    url: "/projects/pro_example/market/",
    description: "Total Addressable Market"
  }
};

export const reportLinksPartial = {
  ...reportLinksAll,
  modeling: null,
  campaign_plan: null,
  market: null
};

export const currentReportType = "baseline";

export default { currentReportType, reportLinks: reportLinksAll };
