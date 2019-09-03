import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button";
import { Upload } from "../../icons";
import Input from "../input";
import MultiSelect from "../multi_select";
import Select from "../select";

export default class Profile extends React.PureComponent {
  static propTypes = {
    person: PropTypes.shape({
      avatar_url: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      title: PropTypes.string,
      phone: PropTypes.string,
      phone_ext: PropTypes.string,
      company_name: PropTypes.string,
      company_role: PropTypes.arrayOf(PropTypes.string),
      office_address: PropTypes.string,
      office_name: PropTypes.string,
      office_type: PropTypes.string
    })
  };
  static roleOptions = [
    { label: "Owner", value: "owner" },
    { label: "Developer", value: "developer" },
    { label: "Asset Manager", value: "asset" },
    { label: "Property Manager", value: "property" },
    { label: "JV / Investor", value: "jv" },
    { label: "Vendor / Consultant", value: "vendor" }
  ];
  static officeTypes = [
    { label: "Global", value: "global" },
    { label: "National", value: "national" },
    { label: "Regional", value: "regional" },
    { label: "Other", value: "other" }
  ];

  render() {
    return (
      <div className="account-settings__tab">
        <Formik initialValues={this.props.person}>
          {({ values, handleChange, handleBlur, setFieldValue }) => (
            <Form method="post" autoComplete="off">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-section">
                  <div className="account-settings__tab-title">
                    General Info
                  </div>
                  <div className="account-settings__photo-field">
                    <div className="account-settings__photo-info">
                      <div className="account-settings__photo">
                        <label className="account-settings__upload">
                          <Upload className="account-settings__upload-icon" />
                          <input name="logo" type="file" />
                        </label>
                      </div>
                      <div className="account-settings__photo-data">
                        <div className="account-settings__photo-text account-settings__photo-text--name">
                          {values.first_name} {values.last_name}
                        </div>
                        <div className="account-settings__photo-text">
                          Admin
                        </div>
                      </div>
                    </div>
                    <div className="account-settings__help-text">
                      3MB Size Limit. PNG or JPG only.
                    </div>
                  </div>
                  <div className="account-settings__field-grid">
                    <div className="account-settings__field">
                      <div className="account-settings__label">First Name</div>
                      <Input
                        className="account-settings__input"
                        name="first_name"
                        theme="gray"
                        value={values.first_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">Last Name</div>
                      <Input
                        className="account-settings__input"
                        name="last_name"
                        theme="gray"
                        value={values.last_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">
                        Title (Optional)
                      </div>
                      <Input
                        className="account-settings__input"
                        name="title"
                        theme="gray"
                        value={values.title}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        value={values.phone}
                        onBlur={handleBlur}
                        onChange={handleChange}
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
                        value={values.phone_ext}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="account-settings__tab-section">
                  <div className="account-settings__tab-title">
                    Business Info
                  </div>
                  <div className="account-settings__field-grid">
                    <div className="account-settings__field">
                      <div className="account-settings__label">Company</div>
                      <Input
                        className="account-settings__input"
                        name="company"
                        theme="gray"
                        value={values.company}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">
                        Company Role
                      </div>
                      <MultiSelect
                        className="account-settings__input"
                        name="company_role"
                        theme="gray"
                        isShowControls={false}
                        isShowAllOption={false}
                        options={Profile.roleOptions}
                        value={values.company_role}
                        label={values.company_role
                          ?.map(v => v.label)
                          .join(", ")}
                        onChange={values =>
                          setFieldValue("company_role", values)
                        }
                      />
                    </div>
                    <div className="account-settings__field account-settings__field--full-grid">
                      <div className="account-settings__label">
                        Office Address
                      </div>
                      <Input
                        className="account-settings__input"
                        name="office_address"
                        theme="gray"
                        value={values.office_address}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">Office Name</div>
                      <Input
                        className="account-settings__input"
                        name="office_name"
                        theme="gray"
                        value={values.office_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">Office Type</div>
                      <Select
                        className="account-settings__input"
                        name="office_type"
                        theme="gray"
                        options={Profile.officeTypes}
                        value={values.office_type}
                        onBlur={handleBlur}
                        onChange={value => setFieldValue("office_type", value)}
                      />
                    </div>
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
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
