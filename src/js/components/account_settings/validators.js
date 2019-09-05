import Yup from "../../yup";

const phoneRegex = /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/;
const invalidPhoneMessage = "${path} should match the format (xxx) xxx-xxxx";
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
    .max(255)
    .label("First name"),
  last_name: Yup.string()
    .required()
    .max(255)
    .label("Last name"),
  title: Yup.string()
    .max(255)
    .label("Title"),
  phone: Yup.string()
    .matches(phoneRegex, {
      message: invalidPhoneMessage,
      excludeEmptyString: true
    })
    .label("Phone number"),
  phone_ext: Yup.string()
    .matches(phoneRegex, {
      message: invalidPhoneMessage,
      excludeEmptyString: true
    })
    .label("Phone number"),
  company_name: Yup.string()
    .required()
    .max(255)
    .label("Company name"),
  company_role: Yup.array()
    .required()
    .label("Company role"),
  office_address: Yup.string()
    .required()
    .max(255)
    .label("Office address"),
  office_name: Yup.string()
    .required()
    .max(255)
    .label("Office name"),
  office_type: selectOptionsSchema.required().label("Office type")
});

export { profileSchema };
