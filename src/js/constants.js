export const COUNTRY_FIELDS = {
  USA: {
    full_name: "United States of America",
    short_name: "USA",
    iso2: "US",
    address_fields: {
      city: "city",
      state: "state",
      zip: "zipcode"
    },
    phone_code: "1"
  },
  GBR: {
    full_name: "United Kingdom",
    short_name: "GBR",
    iso2: "GB",
    address_fields: {
      city: "postal town",
      state: "county",
      zip: "postcode"
    },
    phone_code: "44"
  }
};

export const COUNTRY_CODE_REGEX = /^[0-9]{1,4}$/;

export const TYPING_TIMEOUT = 300;
