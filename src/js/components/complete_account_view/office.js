import React from "react";

import { COUNTRY_FIELDS } from "../../constants";
import Button from "../button";

export const OfficeInfoEmpty = ({ onOpenOfficeModal }) => (
  <div>
    <div className="complete-account__section-label">Office Info</div>
    <Button
      className="complete-account__edit-button"
      color="secondary-gray"
      asDiv={true}
      onClick={onOpenOfficeModal}
      onKeyPress={onOpenOfficeModal}
      tabIndex="0"
    >
      Enter Office info
    </Button>
  </div>
);

export const OfficeInfo = ({ onOpenOfficeModal, data }) => (
  <div>
    <div className="complete-account__section-label">
      Office Info
      <Button
        className="complete-account__edit-button complete-account__edit-button--in-box"
        color="secondary-gray"
        asDiv={true}
        onClick={onOpenOfficeModal}
        onKeyPress={onOpenOfficeModal}
        tabIndex="0"
      >
        Edit Office Info
      </Button>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Country</div>
      <div className="complete-account__value">
        {COUNTRY_FIELDS[data.office_country.value].full_name}
      </div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Address</div>
      <div className="complete-account__value">{data.office_street}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">
        {COUNTRY_FIELDS[data.office_country.value].address_fields.city}
      </div>
      <div className="complete-account__value">{data.office_city}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">
        {COUNTRY_FIELDS[data.office_country.value].address_fields.state}
      </div>
      <div className="complete-account__value">{data.office_state.value}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">
        {COUNTRY_FIELDS[data.office_country.value].address_fields.zip}
      </div>
      <div className="complete-account__value">{data.office_zip}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Office Name</div>
      <div className="complete-account__value">{data.office_name}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Type</div>
      <div className="complete-account__value">{data.office_type.label}</div>
    </div>
  </div>
);
