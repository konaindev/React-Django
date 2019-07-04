export const props = {
  share_info: {
    shared: true,
    share_url: "http://app.remarkably.com/",
    update_endpoint: "/projects/pro_example/update/"
  },
  selected_kpi_bundle: "leasing_performance",
  kpi_bundles: [
    {
      name: "Leasing Performance",
      value: "leasing_performance"
    },
    {
      name: "Conversion Rates",
      value: "conversion_rates"
    },
    {
      name: "Retention Performance",
      value: "retention_performance"
    }
  ],

  date_selection: {
    preset: "custom",
    start_date: "2019-04-15",
    end_date: "2019-04-22"
  },

  kpi_order: [
    {
      label: "Lease Rate",
      value: "lease_rate"
    },
    {
      label: "Occupancy Rate",
      value: "occupancy_rate"
    },
    {
      label: "CD Rate",
      value: "cd_rate"
    },
    {
      label: "Renewal Rate",
      value: "renewal_rate"
    }
  ],

  highlight_kpis: [
    {
      health: 0,
      name: "usv_inq",
      label: "USV → INQ",
      target: "0.07",
      value: "0.05"
    },
    {
      health: 1,
      name: "inq_tou",
      label: "INQ → TOU",
      target: "0.25",
      value: "0.2"
    },
    {
      health: 2,
      name: "tou_app",
      label: "TOU → APP",
      target: "0.5",
      value: "0.6"
    }
  ],

  table_data: [
    {
      type: "group",
      name: "West",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      kpis: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      },
      properties: [
        {
          name: "Building A",
          address: "San Antonio, TX 78207",
          image_url:
            "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
          health: 2,
          kpis: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          }
        },
        {
          name: "Building B",
          address: "San Antonio, TX 78208",
          image_url:
            "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
          health: 1,
          kpis: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          }
        },
        {
          name: "Building C",
          address: "San Antonio, TX 78209",
          image_url:
            "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
          health: 0,
          kpis: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            lease_rate: 0.9,
            occupancy_rate: 0.8,
            cd_rate: 0.1,
            renewal_rate: 0.5
          }
        }
      ]
    },
    {
      type: "individual",
      name: "Remarkably National",
      address: "San Antonio, TX 34524",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      health: 2,
      kpis: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      }
    },
    {
      type: "individual",
      name: "Portfolio Average",
      address: "San Antonio, TX 242",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      health: 1,
      kpis: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        lease_rate: 0.9,
        occupancy_rate: 0.8,
        cd_rate: 0.1,
        renewal_rate: 0.5
      }
    }
  ]
};
