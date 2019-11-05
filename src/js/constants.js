export const COUNTRY_FIELDS = {
  USA: {
    full_name: "United States of America",
    short_name: "USA",
    address_fields: {
      city: "city",
      state: "state",
      zip: "zip code"
    },
    phone_code: "1"
  },
  GBR: {
    full_name: "United Kingdom",
    short_name: "GBR",
    address_fields: {
      city: "postal town",
      state: "county",
      zip: "postcode"
    },
    phone_code: "44"
  }
};

export const COUNTRY_CODE_REGEX = /^[0-9]{1,4}$/;
