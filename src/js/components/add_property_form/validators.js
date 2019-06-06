import Yup from "../../yup";

const zipLengthMsg = "${path} must have 5 digits";

export const propertySchema = Yup.object().shape({
  property_name: Yup.string()
    .required()
    .max(255)
    .label('"Name"'),
  address: Yup.string()
    .required()
    .max(255)
    .label('"Address 1"'),
  address2: Yup.string()
    .required()
    .max(255)
    .label('"Address 2"'),
  city: Yup.string()
    .required()
    .max(128)
    .label('"City"'),
  state: Yup.string()
    .required()
    .label('"State"'),
  zipcode: Yup.number()
    .required()
    .positive()
    .integer()
    .test("length-is-5", zipLengthMsg, value =>
      value ? value.toString().length === 5 : false
    )
    .label('"Zipcode"'),
  package: Yup.mixed()
    .required()
    .label('"Package"')
});
