const office_options = [
  { label: "Global", value: 1 },
  { label: "National", value: 2 },
  { label: "Regional", value: 3 },
  { label: "Other", value: 4 }
];

const office_countries = [
  { label: "United States of America", value: "USA" },
  { label: "United Kingdom", value: "GBR" }
];

const us_state_list = [
  { label: "Washington", value: "Washington" },
  { label: "New York", value: "New York" }
];

const gb_county_list = [
  { label: "London", value: "London" },
  { label: "Aberdeen", value: "Aberdeen" }
];

export const props = {
  office_options,
  office_countries,
  us_state_list,
  gb_county_list
};
