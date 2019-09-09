import Yup from "../yup";

const emailSchema = Yup.string()
  .email()
  .required();

export function isValidEmail(email) {
  return emailSchema.isValidSync(email);
}
