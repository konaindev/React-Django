import Yup from "../../yup";

export const MAX_AVATAR_SIZE = 3 * 1024 * 1024; // Bytes in 3MB

const phoneRegex = /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/;
const invalidPhoneMessage = "${path} should match format (XXX) XXX-XXXX";

export const zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
export const postRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
export const invalidZipMessage = "Please enter a valid zip code";
export const invalidPostMessage = "Please enter a valid post code";

export const streetRegex = /^\s*\S+(?:\s+\S+){2}/;
export const invalidStreetMessage = "Please enter a valid street address";

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

const profileSchema = Yup.object().shape({
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
  company: Yup.string()
    .required()
    .max(255)
    .label("Company"),
  company_roles: Yup.array()
    .required()
    .label("Company role"),
  office_street: Yup.string()
    .required()
    .max(255)
    .matches(streetRegex, {
      message: invalidStreetMessage
    })
    .label("Office address"),
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
    .label("Zip")
    .when("office_country", {
      is: val => val.value == "USA",
      then: Yup.string().matches(zipRegex, {
        message: invalidZipMessage
      })
    })
    .when("office_country", {
      is: val => val.value == "GBR",
      then: Yup.string().matches(postRegex, {
        message: invalidPostMessage
      })
    }),
  office_name: Yup.string()
    .required()
    .max(255)
    .label("Office name"),
  office_type: Yup.object()
    .required()
    .label("Office type")
});

export { profileSchema, securitySchema };
