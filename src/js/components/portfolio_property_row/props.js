export const props = {
  type: "individual",
  name: "Tara",
  address: "San Antonio, TX 78209",
  image_url:
    "https://www.hillsdale.edu/wp-content/uploads/2016/05/Monument-Valley-800x800.jpg",
  kpi_order: ["lease_rate", "occupancy_rate", "cd_rate", "renewal_rate"],
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
};
