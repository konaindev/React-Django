import React from "react";

import { storiesOf } from "@storybook/react";

import CompanyModal from "./index";
import { companyData, companyRolesOptions } from "./props";

storiesOf("CompanyModal", module).add("default", () => (
  <CompanyModal
    isOpen={true}
    data={companyData}
    companyRolesOptions={companyRolesOptions}
  />
));
