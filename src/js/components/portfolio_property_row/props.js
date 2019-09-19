export const props = {
  type: "individual",
  name: "Tara",
  address: "San Antonio, TX 78209",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["leased_rate", "occupancy_rate", "lease_cd_rate", "renewal_rate"],
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
};

export const withoutKPIs = {
  type: "individual",
  name: "Tara",
  address: "San Antonio, TX 78209",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["leased_rate", "occupancy_rate", "lease_cd_rate", "renewal_rate"],
  health: 2
};

export const partialKPIs = {
  type: "individual",
  name: "Tara",
  address: "San Antonio, TX 78209",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["leased_rate", "occupancy_rate", "lease_cd_rate", "renewal_rate"],
  health: 2,
  kpis: {
    leased_rate: 0.9,
    lease_cd_rate: 0.1
  },
  targets: {
    leased_rate: 0.9,
    lease_cd_rate: 0.1
  }
};
