import PropTypes from "prop-types";

export const props = {
  office_types: [
    { label: "Global", value: "global" },
    { label: "National", value: "national" },
    { label: "Regional", value: "regional" },
    { label: "Other", value: "other" }
  ],
  company_roles: [
    { label: "Owner", value: "owner" },
    { label: "Developer", value: "developer" },
    { label: "Asset Manager", value: "asset_manager" },
    { label: "Property Manager", value: "property_manager" },
    { label: "JV / Investor", value: "investor" },
    { label: "Vendor / Consultant", value: "vendor" }
  ],
  office_countries: [
    { label: "United States of America", value: "USA" },
    { label: "United Kingdom", value: "GBR" }
  ],
  office_addresses: [
    {
      value: "Columbia Tower",
      street: "111 Columbia Street",
      city: "Seattle",
      state: "WA"
    },
    {
      value: "1800 Ocean Front Walk, Venice, CA 90291, USA",
      street: "1800 Ocean Front Walk",
      city: "Los Angeles",
      state: "CA"
    },
    {
      value: "2284 W Commodore Way, Seattle, WA 98199, USA",
      street: "2284 W Commodore Way",
      city: "Seattle",
      state: "WA"
    },
    {
      value: "305 Harrison St, Seattle, WA 98109, USA",
      street: "305 Harrison St",
      city: "Seattle",
      state: "WA"
    },
    {
      value: "6460 Ramirez Mesa Dr, Malibu, CA 90265, USA",
      street: "6460 Ramirez Mesa Dr",
      city: "Malibu",
      state: "CA"
    },
    {
      value: "1800 Ocean Front Walk, Venice, CA 90291, USA",
      street: "1800 Ocean Front Walk",
      city: "Los Angeles",
      state: "CA"
    },
    {
      value: "1202 W Thomas Rd, Phoenix, AZ 85013, USA",
      street: "1202 W Thomas Rd",
      city: "Phoenix",
      state: "AZ"
    }
  ]
};
