import React from "react";

import { storiesOf } from "@storybook/react";

import { CompanyModal, OfficeModal } from "./index";
import { companyData, companyRolesOptions } from "./props";

storiesOf("AccountSettingsModals", module)
  .add("Company modal", () => (
    <CompanyModal
      isOpen={true}
      isAccountAdmin={true}
      data={companyData}
      companyRolesOptions={companyRolesOptions}
    />
  ))
  .add("Office modal", () => <OfficeModal isOpen={true} />);
