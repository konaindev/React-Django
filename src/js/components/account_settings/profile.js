import { Formik, Form } from "formik";
import React from "react";

import Button from "../button";
import { Upload } from "../../icons";
import Input from "../input";
import MultiSelect from "../multi_select";

const initialValues = { company_role: [] };

export default class Profile extends React.PureComponent {
  static roleOptions = [
    { label: "Owner", value: "owner" },
    { label: "Developer", value: "developer" },
    { label: "Asset Manager", value: "asset" },
    { label: "Property Manager", value: "property" },
    { label: "JV / Investor", value: "jv" },
    { label: "Vendor / Consultant", value: "vendor" }
  ];

  render() {
    return (
      <div className="account-settings__tab">
        <Formik initialValues={initialValues}>
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
                          Phillip McPhillipson
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
                      <div className="account-settings__label">
                        Title (Optional)
                      </div>
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
                        value="Glacier Associates"
                      />
                    </div>
                    <div className="account-settings__field">
                      <div className="account-settings__label">
                        Company Role
                      </div>
                      <MultiSelect
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
