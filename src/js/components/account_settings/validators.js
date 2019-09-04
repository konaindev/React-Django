import Yup from "../../yup";

const selectOptionsSchema = Yup.object().shape({
  label: Yup.string()
    .required()
    .max(20),
  value: Yup.string()
    .required()
    .max(20)
});

const profileSchema = Yup.object().shape({
  first_name: Yup.string()
    .required()
    .max(255),
  last_name: Yup.string()
    .required()
    .max(255),
  title: Yup.string().max(255),
  phone: Yup.string().max(11),
  phone_ext: Yup.string().max(11),
  company_name: Yup.string()
    .required()
    .max(255),
  company_role: Yup.array()
    .of(selectOptionsSchema)
    .required(),
  office_address: Yup.string()
    .required()
    .max(255),
  office_name: Yup.string()
    .required()
    .max(255),
  office_type: selectOptionsSchema.required()
});

export { profileSchema };
