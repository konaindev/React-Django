import React from "react";

import Button from "../button";

export const CompanyInfoEmpty = ({ onOpenCompanyModal, showErrorMessage }) => (
  <div>
    <div className="complete-account__section-label">
      Company Info {showErrorMessage()}
    </div>
    <Button
      className="complete-account__edit-button"
      color="secondary-gray"
      asDiv={true}
      onClick={onOpenCompanyModal}
      onKeyPress={onOpenCompanyModal}
      tabIndex="0"
    >
      Enter Company info
    </Button>
  </div>
);
export const CompanyInfo = ({ data, onOpenCompanyModal, showErrorMessage }) => (
  <div>
    <div className="complete-account__section-label">
      Company Info
      {showErrorMessage()}
      <Button
        className="complete-account__edit-button complete-account__edit-button--in-box"
        color="secondary-gray"
        asDiv={true}
        onClick={onOpenCompanyModal}
        onKeyPress={onOpenCompanyModal}
        tabIndex="0"
      >
        Enter Company info
      </Button>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Company</div>
      <div className="complete-account__value">{data.company.label}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Company Role</div>
      <div className="complete-account__value">
        {data.company_roles.map(r => r.label).join(", ")}
      </div>
    </div>
  </div>
);
