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

const company_roles = [
  { label: "Owner", value: "owner" },
  { label: "Developer", value: "developer" },
  { label: "Asset Manager", value: "asset_manager" },
  { label: "Property Manager", value: "property_manager" }
];

const office_options = [
  { label: "Global", value: 1 },
  { label: "National", value: 2 },
  { label: "Regional", value: 3 },
  { label: "Other", value: 4 }
];

const profile = {
  avatar_url:
    "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg",
  first_name: "Phillip",
  last_name: "McPhillipson",
  title: "Founder",
  phone: "",
  phone_ext: "",
  company_name: "Glacier Associates",
  company_roles: ["owner", "asset", "property"],
  office_address: "1730 Minor Avenue, Lansing, MI",
  office_name: "Michigan",
  office_type: 3
};

export const props = {
  rules,
  profile,
  user,
  company_roles,
  office_options,
  itemsOrder
};
