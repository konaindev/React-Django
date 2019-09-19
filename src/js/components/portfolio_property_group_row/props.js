export const props = {
  type: "group",
  name: "West",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["leased_rate", "occupancy_rate", "lease_cd_rate", "renewal_rate"],
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
      address: "San Antonio, TX 1",
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
      address: "San Antonio, TX 2",
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
      address: "San Antonio, TX 3",
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
};

export const withoutKPIs = {
  type: "group",
  name: "West",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["leased_rate", "occupancy_rate", "lease_cd_rate", "renewal_rate"],
  properties: [
    {
      name: "Building A",
      address: "San Antonio, TX 1",
      health: -1,
      image_url:
        "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg"
    },
    {
      name: "Building B",
      address: "San Antonio, TX 2",
      health: -1,
      image_url:
        "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg"
    },
    {
      name: "Building C",
      address: "San Antonio, TX 3",
      health: -1,
      image_url:
        "https://www.inquirer.com/resizer/olBwbov37jGKpl6IaoiTBYCQ-n4=/1400x932/smart/arc-anglerfish-arc2-prod-pmn.s3.amazonaws.com/public/FTMY2CQIHJEO3HSRUCOXCWDNH4.jpg"
    }
  ]
};
