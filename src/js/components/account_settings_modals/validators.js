import Yup from "../../yup";

export const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
export const postRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
export const invalidZipMessage = "Please enter a valid zip code";
export const invalidPostMessage = "Please enter a valid post code";

export const streetRegex = /^\s*\S+(?:\s+\S+){2}/;
export const invalidStreetMessage = "Please enter a valid street address";

export const companySchema = Yup.object().shape({
  company: Yup.object({
    value: Yup.string()
      .max(255, "is too much length")
      .required()
      .label("Company")
  }).label("Company"),
  company_roles: Yup.array()
    .required()
    .label("Company role")
});

export const officeSchema = Yup.object().shape({
  office_street: Yup.string()
    .required()
    .max(255)
    .matches(streetRegex, {
      message: invalidStreetMessage
    })
    .label("Street Address"),
  office_city: Yup.string()
    .max(255)
    .label("City")
    .required(),
  office_country: Yup.object().required(),
  office_state: Yup.string()
    .max(255)
    .label("State")
    .when("office_country", {
      is: val => val.value == "USA",
      then: Yup.string().required()
    }),
  office_zip: Yup.string()
    .required()
    .max(255)
    .label(" ")
    .when("office_country", {
      is: val => val.value == "USA",
      then: Yup.string()
        .matches(zipRegex, {
          message: invalidZipMessage
        })
        .required()
        .label("Zip code")
    })
    .when("office_country", {
      is: val => val.value == "GBR",
      then: Yup.string()
        .matches(postRegex, {
          message: invalidPostMessage
        })
        .required()
        .label("Postcode")
    }),
  office_name: Yup.string()
    .required()
    .max(255)
    .label("Office name"),
  office_type: Yup.object()
    .required()
    .label("Office type")
});
