import * as Yup from "yup";

Yup.setLocale({
  mixed: {
    required: "${path} is required.",
    notType: "${path} must be ${type}."
  },
  string: { max: "${path} length must be at most ${max} characters." },
  number: { positive: "${path} must be a positive number." }
});

export default Yup;
