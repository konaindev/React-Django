import PropTypes from "prop-types";

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
  avatar_url: "",
  first_name: "Phillip",
  last_name: "McPhillipson",
  title: "Founder",
  phone: "",
  phone_ext: "",
  company: "Glacier Associates",
  company_role: [
    { label: "Owner", value: "owner" },
    { label: "Asset Manager", value: "asset" },
    { label: "Property Manager", value: "property" }
  ],
  office_address: "1730 Minor Avenue, Lansing, MI",
  office_name: "Michigan",
  office_type: { label: "Regional", value: "regional" }
};

export const props = { rules, person };
