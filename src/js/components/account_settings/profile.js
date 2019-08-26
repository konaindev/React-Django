import React from "react";

import Button from "../button";
import Input from "../input";

export default class Profile extends React.Component {
  render() {
    return (
      <div className="account-settings__tab">
        <div className="account-settings__tab-content">
          <div className="account-settings__tab-title account-settings__tab-title--first">
            General Info
          </div>
          <div className="account-settings__field-grid">
            <div className="account-settings__field">
              <div className="account-settings__label">First Name</div>
              <Input
                className="account-settings__input"
                name="first_name"
                theme="gray"
                value="Phillip"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">Last Name</div>
              <Input
                className="account-settings__input"
                name="last_name"
                theme="gray"
                value="McPhillipson"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">Title (Optional)</div>
              <Input
                className="account-settings__input"
                name="title"
                theme="gray"
                value="Founder"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">
                Phone Number (Optional)
              </div>
              <Input
                className="account-settings__input"
                name="phone"
                theme="gray"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">
                Phone Extension (Optional)
              </div>
              <Input
                className="account-settings__input"
                name="phone_ext"
                theme="gray"
              />
            </div>
          </div>
          <div className="account-settings__tab-title">Business Info</div>
          <div className="account-settings__field-grid">
            <div className="account-settings__field">
              <div className="account-settings__label">Company</div>
              <Input
                className="account-settings__input"
                name="company"
                theme="gray"
                value="Glacier Associates"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">Company Role</div>
              <Input
                className="account-settings__input"
                name="company_role"
                theme="gray"
                value="Asset Manager, Property Manager"
              />
            </div>
            <div className="account-settings__field account-settings__field--full-grid">
              <div className="account-settings__label">Office Address</div>
              <Input
                className="account-settings__input"
                name="office_address"
                theme="gray"
                value="1730 Minor Avenue, Lansing, MI"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">Office Name</div>
              <Input
                className="account-settings__input"
                name="office_name"
                theme="gray"
                value="Michigan"
              />
            </div>
            <div className="account-settings__field">
              <div className="account-settings__label">Office Type</div>
              <Input
                className="account-settings__input"
                name="office_type"
                theme="gray"
                value="Regional"
              />
            </div>
          </div>
        </div>
        <div className="account-settings__buttons-field">
          <Button
            className="account-settings__button"
            color="primary"
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    );
  }
}
