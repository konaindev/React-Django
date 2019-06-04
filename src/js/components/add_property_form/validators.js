import * as Yup from "yup";

export const propertySchema = Yup.object().shape({
  zipcode: Yup.number().integer()
});
