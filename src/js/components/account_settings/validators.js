import Yup from "../../yup";

const phoneRegex = /^[0-9]{10}$/;
const invalidPhoneMessage =
  "Phone number must be numbers in format XXXXXXXXXX.";
const maxAvatarSize = 3 * 1024 * 1024; // Bytes in 3MB

const selectOptionsSchema = Yup.object().shape({
  label: Yup.string()
    .required()
    .max(20),
  value: Yup.string()
    .required()
    .max(20)
});

const profileSchema = Yup.object().shape({
  avatar_size: Yup.number().max(
    maxAvatarSize,
    "Profile image size is over the 3MB limit."
  ),
  avatar_url: Yup.string(),
  first_name: Yup.string()
    .required()
    .max(255),
  last_name: Yup.string()
    .required()
    .max(255),
  title: Yup.string().max(255),
  phone: Yup.string().matches(phoneRegex, {
    message: invalidPhoneMessage,
    excludeEmptyString: true
  }),
  phone_ext: Yup.string().matches(phoneRegex, {
    message: invalidPhoneMessage,
    excludeEmptyString: true
  }),
  company_name: Yup.string()
    .required()
    .max(255),
  company_role: Yup.array().required(),
  office_address: Yup.string()
    .required()
    .max(255),
  office_name: Yup.string()
    .required()
    .max(255),
  office_type: selectOptionsSchema.required()
});

export { profileSchema };
