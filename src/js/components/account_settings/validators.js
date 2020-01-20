import Yup from "../../yup";
import { COUNTRY_CODE_REGEX } from "../../constants";

export const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // Bytes in 3MB

const usPhoneRegex = /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/;
const genericPhoneRegex = /^(?=.*[0-9])[- +()0-9]{8,15}$/;
const invalidPhoneMessage = "${path} should match format (XXX) XXX-XXXX";

const securitySchema = Yup.object().shape({
  email: Yup.string()
    .max(255)
    .email()
    .label("Email"),
  old_password: Yup.string()
    .when("password", {
      is: password => !!password,
      then: Yup.string().required(),
      otherwise: Yup.string()
    })
    .label("Current password"),
  password: Yup.string().label("Password"),
  confirm_password: Yup.string()
    .when("password", (password, schema) => {
      if (password) {
        return Yup.string()
          .required()
          .oneOf([Yup.ref("password"), null]);
      }
      return schema;
    })
    .label("Confirm password")
});

const userSchema = Yup.object().shape({
  avatar: Yup.mixed().test(
    "maxFileSize",
    "Profile image size is over the 3MB limit.",
    file => !file || file.size <= MAX_AVATAR_SIZE
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
  phone_country_code: Yup.string().matches(COUNTRY_CODE_REGEX, {
    message: "Invalid country code",
    excludeEmptyString: true
  }),
  phone: Yup.string()
    .when(["phone_country_code", "office_country"], {
      is: (phone_country_code, office_country) => {
        return (
          phone_country_code == "1" ||
          (office_country.value == "USA" && phone_country_code == undefined)
        );
      },
      then: Yup.string().matches(usPhoneRegex, {
        message: invalidPhoneMessage,
        excludeEmptyString: true
      }),
      otherwise: Yup.string().matches(genericPhoneRegex, {
        message: "Invalid Phone number",
        excludeEmptyString: true
      })
    })
    .label("Phone number"),
  phone_ext: Yup.string().label("Phone ext")
});

export { userSchema, securitySchema };
