import Yup from "../../yup";

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
