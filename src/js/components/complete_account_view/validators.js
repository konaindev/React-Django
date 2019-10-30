import Yup from "../../yup";
import {
  zipRegex,
  postRegex,
  invalidZipMessage,
  invalidPostMessage,
  streetRegex,
  invalidStreetMessage
} from "../account_settings/validators";

export const propertySchema = Yup.object().shape({
  first_name: Yup.string()
    .required()
    .max(255, "is too much length")
    .label(" "),
  last_name: Yup.string()
    .required()
    .max(255, "is too much length")
    .label(" "),
  title: Yup.string()
    .max(255, "is too much length")
    .label(" "),
  company: Yup.object({
    value: Yup.string()
      .max(255, "is too much length")
      .required()
      .label(" ")
  }).label(" "),
  company_role: Yup.array()
    .required()
    .of(
      Yup.object({
        label: Yup.string().max(255, "is too much length"),
        value: Yup.string().max(255, "is too much length")
      })
    )
    .label(" "),
  // office_address: Yup.object({
  //   value: Yup.string()
  //     .max(255, "is too much length")
  //     .required()
  //     .label(" ")
  // }).label(" "),
  office_street: Yup.string()
    .required()
    .max(255, "if too long")
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
    .label(" ")
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
      then: Yup.string().matches(zipRegex, {
        message: invalidZipMessage
      })
    })
    .when("office_country", {
      is: val => val.value == "GB",
      then: Yup.string().matches(postRegex, {
        message: invalidPostMessage
      })
    }),
  office_name: Yup.string()
    .required()
    .max(255, "is too much length")
    .label(" "),
  office_type: Yup.object({
    value: Yup.number()
      .required()
      .label(" ")
  }).label(" "),
  terms: Yup.boolean()
    .oneOf([true])
    .required()
    .label(" ")
});
