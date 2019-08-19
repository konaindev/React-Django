import Yup from "../../yup";

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
  company: Yup.object()
    .required()
    .shape({
      label: Yup.string().max(255, "is too much length"),
      value: Yup.string().max(255, "is too much length")
    })
    .label(" "),
  company_role: Yup.array()
    .required()
    .of(
      Yup.object({
        label: Yup.string().max(255, "is too much length"),
        value: Yup.string().max(255, "is too much length")
      })
    )
    .label(" "),
  office_address: Yup.string()
    .required()
    .max(255, "is too much length")
    .label(" "),
  office_name: Yup.string()
    .required()
    .max(255, "is too much length")
    .label(" "),
  office_type: Yup.object()
    .shape({
      label: Yup.string().max(255, "is too much length"),
      value: Yup.string().max(255, "is too much length")
    })
    .required()
    .label(" "),
  terms: Yup.boolean()
    .oneOf([true])
    .required()
    .label(" ")
});
