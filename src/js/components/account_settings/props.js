const user = {
  account_id: 1,
  account_name: "Remarkably",
  account_settings_url: "/users/account-settings",
  email: "test@psl.com",
  logout_url: "/users/logout/",
  user_id: "usr_jjzpeyfeshzpaha5"
};

const itemsOrder = ["profile", "lock", "email"];

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

const person = {
  avatar_url:
    "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
  first_name: "Phillip",
  last_name: "McPhillipson",
  title: "Founder",
  phone: "",
  phone_ext: "",
  company_name: "Glacier Associates",
  company_role: [
    { label: "Owner", value: "owner" },
    { label: "Asset Manager", value: "asset" },
    { label: "Property Manager", value: "property" }
  ],
  office_address: "1730 Minor Avenue, Lansing, MI",
  office_name: "Michigan",
  office_type: { label: "Regional", value: "regional" }
};

export const props = { rules, person, user, itemsOrder };
