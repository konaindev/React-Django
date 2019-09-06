import cn from "classnames";
import { ErrorMessage, Formik, Form } from "formik";
import _intersection from "lodash/intersection";
import PropTypes from "prop-types";
import React from "react";

import { Tick, Upload } from "../../icons";
import { formatPhone } from "../../utils/formatters";
import Button from "../button";
import Input from "../input";
import MultiSelect from "../multi_select";
import Select from "../select";
import { profileSchema } from "./validators";

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
      company_role: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string
        })
      ),
      office_address: PropTypes.string,
      office_name: PropTypes.string,
      office_type: PropTypes.object
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

  state = { fieldsSubmitted: false };

  constructor(props) {
    super(props);
    this.formik = React.createRef();
  }

  onFileUpload = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = e => {
      this.formik.current.setFieldValue("avatar_url", e.target.result);
    };
    reader.readAsDataURL(file);
    this.formik.current.setFieldValue("avatar_size", file.size);
    this.formik.current.setFieldTouched("avatar_size", true);
  };

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings__field--${m}`);
    return cn("account-settings__field", classes, {
      "account-settings__field--error": errors[name] && touched[name]
    });
  };

  getHelpTextClasses = (name, errors, touched) => {
    return cn("account-settings__help-text", {
      "account-settings__help-text--error": errors[name] && touched[name]
    });
  };

  getErrorMessage = (errors, touched) => {
    const errorFields = Object.keys(errors);
    const touchedFields = Object.keys(touched);
    const fields = _intersection(errorFields, touchedFields);
    if (!fields.length) {
      return;
    }
    let message = "Please review highlighted fields above.";
    if (fields.includes("avatar_size")) {
      message = errors.avatar_size;
    }
    return <div className="account-settings__general-error">{message}</div>;
  };

  getSuccessMessage = () => {
    if (!this.state.fieldsSubmitted) {
      return;
    }
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        Your profile has been saved.
      </div>
    );
  };

  onSubmit = (values, actions) => {
    actions.setSubmitting(false);
    this.setState({ fieldsSubmitted: true });
    setTimeout(() => {
      this.setState({ fieldsSubmitted: false });
    }, 5000);
  };

  render() {
    return (
      <div className="account-settings__tab">
        <Formik
          ref={this.formik}
          initialValues={this.props.person}
          validationSchema={profileSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={this.onSubmit}
        >
          {({
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
            setFieldTouched,
            setFieldValue
          }) => (
            <Form method="post" autoComplete="off">
              <div className="account-settings__tab-content">
                <div className="account-settings__tab-section">
                  <div className="account-settings__tab-title">
                    General Info
                  </div>
                  <div className="account-settings__photo-field">
                    <div className="account-settings__photo-info">
                      <div className="account-settings__photo">
                        <img
                          className="account-settings__photo-img"
                          src={values.avatar_url}
                          alt="LOGO"
                        />
                        <label className="account-settings__upload">
                          <Upload className="account-settings__upload-icon" />
                          <input
                            name="logo"
                            type="file"
                            accept="image/jpeg, image/png"
                            onChange={this.onFileUpload}
                          />
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
                    <div
                      className={this.getHelpTextClasses(
                        "avatar_size",
                        errors,
                        touched
                      )}
                    >
                      3MB Size Limit. PNG or JPG only.
                    </div>
                  </div>
                  <div className="account-settings__field-grid">
                    <div
                      className={this.getFieldClasses(
                        "first_name",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">First Name</div>
                      <Input
                        className="account-settings__input"
                        name="first_name"
                        theme="gray"
                        value={values.first_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="first_name" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "last_name",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">Last Name</div>
                      <Input
                        className="account-settings__input"
                        name="last_name"
                        theme="gray"
                        value={values.last_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="last_name" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses("title", errors, touched)}
                    >
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
                      <div className="account-settings__error">
                        <ErrorMessage name="title" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses("phone", errors, touched)}
                    >
                      <div className="account-settings__label">
                        Phone Number (Optional)
                      </div>
                      <Input
                        className="account-settings__input"
                        name="phone"
                        theme="gray"
                        type="tel"
                        value={values.phone}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        valueFormatter={formatPhone}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="phone" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "phone_ext",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">
                        Phone Extension (Optional)
                      </div>
                      <Input
                        className="account-settings__input"
                        name="phone_ext"
                        theme="gray"
                        type="tel"
                        value={values.phone_ext}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        valueFormatter={formatPhone}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="phone_ext" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="account-settings__tab-section">
                  <div className="account-settings__tab-title">
                    Business Info
                  </div>
                  <div className="account-settings__field-grid">
                    <div
                      className={this.getFieldClasses(
                        "company_name",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">Company</div>
                      <Input
                        className="account-settings__input"
                        name="company_name"
                        theme="gray"
                        value={values.company_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="company_name" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "company_role",
                        errors,
                        touched
                      )}
                    >
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
                        onBlur={() => setFieldTouched("company_role", true)}
                        onChange={values =>
                          setFieldValue("company_role", values)
                        }
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="company_role" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_address",
                        errors,
                        touched,
                        ["full-grid"]
                      )}
                    >
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
                      <div className="account-settings__error">
                        <ErrorMessage name="office_address" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_name",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">Office Name</div>
                      <Input
                        className="account-settings__input"
                        name="office_name"
                        theme="gray"
                        value={values.office_name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_name" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_type",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">Office Type</div>
                      <Select
                        className="account-settings__input"
                        name="office_type"
                        theme="gray"
                        options={Profile.officeTypes}
                        value={values.office_type}
                        onBlur={() => setFieldTouched("office_type", true)}
                        onChange={value => setFieldValue("office_type", value)}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_type" />
                      </div>
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
                {this.getErrorMessage(errors, touched)}
                {this.getSuccessMessage()}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
