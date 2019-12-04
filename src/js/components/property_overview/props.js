import _omit from "lodash/omit";

const project = {
  public_id: "pro_xujf7pnznggt5dny",
  name: "El Cortez",
  address_str: "3130 N 7th Ave, Phoenix, AZ 85013, USA",
  building_class: "A",
  year_built: 2012,
  year_renovated: 2015,
  total_units: 156,
  property_type: "Multifamily - Standard",
  property_style: "Garden",
  url: "https://www.liveatelcortez.com/",
  custom_tags: ["Tag 1", "Tag 2", "Tag 3"],
  property_owner: "Pennybacker Capital",
  asset_manager: "Pennybacker Capital",
  property_manager: "Investor Property Services",
  developer: "Developer",
  is_admin: true,
  is_member: false
};

const projectWithoutSite = _omit(project, ["url"]);
const projectWithoutTags = _omit(project, ["custom_tags"]);
const projectWithoutTiles = _omit(project, [
  "property_owner",
  "asset_manager",
  "property_manager",
  "developer",
  "building_class",
  "year_built",
  "year_renovated",
  "total_units",
  "property_type",
  "property_style"
]);
const projectWithPartialTiles = _omit(project, [
  "developer",
  "building_class",
  "total_units",
  "property_style"
]);

const buildingImageURL = "https://i.imgur.com/UEH4gfU.jpg";

export default {
  project,
  buildingImageURL,
  projectWithoutSite,
  projectWithoutTags,
  projectWithoutTiles,
  projectWithPartialTiles
};
