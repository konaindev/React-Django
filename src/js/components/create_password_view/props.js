const rules = [
  {
    label: "Be at least 8 characters",
    key: "length"
  },
  {
    label: "Contain alphabetic characters",
    key: "characters"
  },
  {
    label: "Not match personal information",
    key: "personal"
  },
  {
    label: "Not be a commonly used password",
    key: "used"
  }
];

const validate = values => {
  return new Promise(res => {
    let errors = {};
    if (!values || values.length < 8) {
      errors.length = true;
    }
    setTimeout(() => res(errors));
  });
};

export const props = {
  rules,
  validate
};
