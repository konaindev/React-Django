export const props = {
  kpi_order: [
    {
      label: "Lease Rate",
      value: "leased_rate"
    },
    {
      label: "Occupancy Rate",
      value: "occupancy_rate"
    },
    {
      label: "CD Rate",
      value: "lease_cd_rate"
    },
    {
      label: "Renewal Rate",
      value: "renewal_rate"
    }
  ],
  properties: [
    {
      type: "group",
      name: "West",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      kpis: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      },
      properties: [
        {
          name: "Building A",
          address: "San Antonio, TX 78207",
          image_url:
            "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
          health: 0,
          kpis: {
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
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
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
            renewal_rate: 0.5
          }
        },
        {
          name: "Building C",
          address: "San Antonio, TX 78209",
          image_url:
            "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
          health: 2,
          kpis: {
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
            renewal_rate: 0.5
          },
          targets: {
            leased_rate: 0.9,
            occupancy_rate: 0.8,
            lease_cd_rate: 0.1,
            renewal_rate: 0.5
          }
        }
      ]
    },
    {
      type: "individual",
      name: "Building D",
      address: "San Antonio, TX 78207",
      image_url:
        "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg",
      health: 2,
      kpis: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      }
    },
    {
      type: "group",
      name: "Remarkably National",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      kpis: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      }
    },
    {
      type: "group",
      name: "Portfolio Average",
      image_url:
        "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
      properties: 11,
      kpis: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      },
      targets: {
        leased_rate: 0.9,
        occupancy_rate: 0.8,
        lease_cd_rate: 0.1,
        renewal_rate: 0.5
      }
    }
  ]
};
