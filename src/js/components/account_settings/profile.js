import cn from "classnames";
import { ErrorMessage, Formik, Form } from "formik";
import _intersection from "lodash/intersection";
import PropTypes from "prop-types";
import React from "react";
import AddressModal from "../address_modal";
import { COUNTRY_FIELDS, COUNTRY_CODE_REGEX } from "../../constants";

import { Tick, Upload } from "../../icons";
import { formatPhone } from "../../utils/formatters";
import { validateAddress } from "../../api/account_settings";
import Button from "../button";
import Input from "../input";
import MultiSelect from "../multi_select";
import Select from "../select";
import { addressModal } from "../../state/actions";
import { MAX_AVATAR_SIZE, profileSchema } from "./validators";

export default class Profile extends React.PureComponent {
  static propTypes = {
    profile: PropTypes.shape({
      avatar_url: PropTypes.string,
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      title: PropTypes.string,
      phone_country_code: PropTypes.string,
      phone: PropTypes.string,
      phone_ext: PropTypes.string,
      company: PropTypes.string,
      company_roles: PropTypes.arrayOf(PropTypes.string),
      office_country: PropTypes.object,
      office_street: PropTypes.string,
      office_city: PropTypes.string,
      office_state: PropTypes.object,
      office_zip5: PropTypes.string,
      office_name: PropTypes.string,
      office_type: PropTypes.number
    }),
    company_roles: MultiSelect.optionsType.isRequired,
    office_options: Select.optionsType.isRequired,
    office_countries: Select.optionsType.isRequired,
    us_state_list: Select.optionsType,
    gb_county_list: Select.optionsType
  };
  static defaultProps = {
    profile: {
      avatar_url: "",
      first_name: "",
      last_name: "",
      title: "",
      phone_country_code: "",
      phone: "",
      phone_ext: "",
      company: "",
      company_roles: [],
      office_country: {
        label: COUNTRY_FIELDS.USA.full_name,
        value: COUNTRY_FIELDS.USA.short_name
      },
      office_street: "",
      office_city: "",
      office_state: { label: "", value: "" },
      office_zip: "",
      office_name: "",
      office_type: null
    }
  };
  static fieldsSubmit = [
    "avatar",
    "first_name",
    "last_name",
    "title",
    "phone_country_code",
    "phone",
    "phone_ext",
    "company",
    "company_roles",
    "office_country",
    "office_street",
    "office_city",
    "office_state",
    "office_zip",
    "office_name",
    "office_type"
  ];

  constructor(props) {
    super(props);
    this.state = {
      fieldsSubmitted: false
    };
    this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
  }

  get initialValues() {
    let profile = { ...this.props.profile };
    if (!Object.keys(profile).length) {
      profile = { ...Profile.defaultProps.profile };
    }
    profile.company_roles = this.props.company_roles.filter(i =>
      profile.company_roles.includes(i.value)
    );
    profile.office_type = this.props.office_options.filter(
      i => i.value === profile.office_type
    )[0];
    return profile;
  }

  getAvatarImage(values) {
    let img = (
      <div className="account-settings__photo-img account-settings__photo-img--default" />
    );
    if (values.avatar_url) {
      img = (
        <img
          className="account-settings__photo-img"
          src={values.avatar_url}
          alt="LOGO"
        />
      );
    }
    return img;
  }

  unsetMessage() {
    if (this.state.message) {
      this.setState({ message: null });
    }
  }

  setFormik = formik => {
    this.formik = formik;
  };

  onFileUpload = e => {
    this.unsetMessage();
    const file = e.target.files[0];
    this.formik.setFieldValue("avatar", file);
    this.formik.setFieldTouched("avatar", true);
    if (file.size <= MAX_AVATAR_SIZE) {
      const reader = new FileReader();
      reader.onload = e => {
        this.formik.setFieldValue("avatar_url", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  getFieldClasses = (name, errors, touched, modifiers = []) => {
    const classes = modifiers.map(m => `account-settings__field--${m}`);
    let error_dict = {
      "account-settings__field--error": errors[name] && touched[name]
    };
    if (name == "phone") {
      error_dict["account-settings__field--error-country-code"] =
        errors["phone_country_code"] && touched["phone_country_code"];
    }
    return cn("account-settings__field", classes, error_dict);
  };

  getHelpTextClasses = (name, errors, touched) => {
    return cn("account-settings__help-text", {
      "account-settings__help-text--error": errors[name] && touched[name]
    });
  };

  showErrorMessage = (errors, touched) => {
    const errorFields = Object.keys(errors);
    const touchedFields = Object.keys(touched);
    const fields = _intersection(errorFields, touchedFields);
    if (!fields.length) {
      return;
    }
    let message = "Please review highlighted fields above.";
    if (fields.includes("avatar")) {
      message = errors.avatar;
    }
    return <div className="account-settings__general-error">{message}</div>;
  };

  showSuccessMessage = () => {
    if (!this.state.message) {
      return;
    }
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        {this.state.message}
      </div>
    );
  };

  showMessage = (errors, touched) => {
    if (this.state.message) {
      return this.showSuccessMessage();
    } else if (Object.keys(errors).length) {
      return this.showErrorMessage(errors, touched);
    }
  };

  setSuccessMessage = () => {
    this.formik.setSubmitting(false);
    const message = "Your profile has been saved.";
    this.setState({ message });
  };

  setErrorMessages = errors => {
    this.formik.setSubmitting(false);
    const formikErrors = {};
    for (let k of Object.keys(errors)) {
      formikErrors[k] = errors[k][0].message;
    }
    this.formik.setErrors(formikErrors);
  };

  onSubmit = values => {
    this.unsetMessage();
    const dataValues = { ...values };
    const data = new FormData();
    for (const k of Object.keys(dataValues)) {
      if (Profile.fieldsSubmit.includes(k)) {
        if (k === "company_roles") {
          for (const i of dataValues.company_roles) {
            data.append("company_roles[]", i.value);
          }
        } else if (k === "office_type") {
          data.append("office_type", dataValues.office_type.value);
        } else if (k === "office_country") {
          data.append("office_country", dataValues.office_country.value);
        } else if (k === "office_state") {
          data.append("office_state", dataValues.office_state.value);
        } else if (
          k === "phone_country_code" &&
          dataValues["phone"] &&
          !dataValues["phone_country_code"]
        ) {
          data.append(
            "phone_country_code",
            COUNTRY_FIELDS[this.selectedCountry].phone_code
          );
        } else {
          data.append(k, dataValues[k]);
        }
      }
    }
    validateAddress(values).then(response => {
      if (response.data.error) {
        this.setState({ invalid_address: true });
        this.formik.setErrors({
          office_street:
            "Unable to verify address. Please provide a valid address.",
          office_city: "*",
          office_state: "*",
          office_zip: "*"
        });
      } else {
        this.setState({ addresses: response.data, invalid_address: false });
        this.props.dispatch(addressModal.open(data, response.data));
      }
    });
  };

  onChange = v => {
    this.unsetMessage();
    this.formik.handleChange(v);
  };

  onBlur = v => {
    this.unsetMessage();
    this.formik.handleBlur(v);
  };

  onChangeCountry = value => {
    this.selectedCountry = value.value;
    this.formik.setFieldValue("office_country", value);
    this.formik.setFieldValue("office_state", {
      label: "",
      value: ""
    });
    this.formik.setFieldTouched("office_state");
  };

  render() {
    return (
      <div className="account-settings__tab">
        <AddressModal
          title="Confirm Office Address"
          onClose={this.props.dispatch(addressModal.close)}
          callback={this.setSuccessMessage}
          onError={this.setErrorMessages}
          dispatch_type="API_ACCOUNT_PROFILE"
        />
        <Formik
          ref={this.setFormik}
          initialValues={this.initialValues}
          validationSchema={profileSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={this.onSubmit}
        >
          {({
            errors,
            touched,
            values,
            isValid,
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
                        {this.getAvatarImage(values)}
                        <label className="account-settings__upload">
                          <Upload className="account-settings__upload-icon" />
                          <input
                            name="avatar"
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
                          {values.title}
                        </div>
                      </div>
                    </div>
                    <div
                      className={this.getHelpTextClasses(
                        "avatar",
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
                        onBlur={this.onBlur}
                        onChange={this.onChange}
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
                        onBlur={this.onBlur}
                        onChange={this.onChange}
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
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="title" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_country",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                    >
                      <div className="account-settings__label">
                        Office Country
                      </div>
                      <Select
                        className="account-settings__input"
                        name="office_country"
                        theme="gray"
                        isShowControls={false}
                        isShowAllOption={false}
                        value={values.office_country}
                        options={this.props.office_countries}
                        onBlur={() => {
                          this.unsetMessage();
                          setFieldTouched("office_country", true);
                        }}
                        onChange={this.onChangeCountry}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_country" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses("phone", errors, touched)}
                    >
                      <div className="account-settings__label">
                        Phone Number (Optional)
                      </div>
                      <div className="account-settings__plus-tag">+</div>
                      <div className="account-settings__phone-input">
                        <Input
                          className="account-settings__country-code"
                          name="phone_country_code"
                          theme="gray"
                          type="tel"
                          placeholder={
                            COUNTRY_FIELDS[this.selectedCountry].phone_code
                          }
                          value={values.phone_country_code}
                          onBlur={this.onBlur}
                          onChange={this.onChange}
                        />
                        <Input
                          className="account-settings__input"
                          name="phone"
                          theme="gray"
                          type="tel"
                          value={values.phone}
                          onBlur={this.onBlur}
                          onChange={this.onChange}
                          valueFormatter={
                            values.phone_country_code == "1" ||
                            (this.selectedCountry == "USA" &&
                              !values.phone_country_code)
                              ? formatPhone
                              : undefined
                          }
                        />
                      </div>
                      {errors["phone_country_code"] && (
                        <div className="account-settings__error">
                          <ErrorMessage name="phone_country_code" />
                        </div>
                      )}
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
                        onBlur={this.onBlur}
                        onChange={this.onChange}
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
                        "company",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">Company</div>
                      <Input
                        className="account-settings__input"
                        name="company"
                        theme="gray"
                        value={values.company}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="company" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "company_roles",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                    >
                      <div className="account-settings__label">
                        Company Role
                      </div>
                      <MultiSelect
                        className="account-settings__input"
                        name="company_roles"
                        theme="gray"
                        isShowControls={false}
                        isShowAllOption={false}
                        options={this.props.company_roles}
                        value={values.company_roles}
                        label={values.company_roles
                          ?.map(v => v.label)
                          .join(", ")}
                        onBlur={() => {
                          this.unsetMessage();
                          setFieldTouched("company_roles", true);
                        }}
                        onChange={values => {
                          this.unsetMessage();
                          setFieldValue("company_roles", values);
                        }}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="company_roles" />
                      </div>
                    </div>
                  </div>
                  <div className="account-settings__tab-title">
                    Company Info
                  </div>
                  <div className="account-settings__field-grid">
                    <div
                      className={this.getFieldClasses(
                        "office_street",
                        errors,
                        touched,
                        ["full-grid"]
                      )}
                    >
                      <div className="account-settings__label">Address</div>
                      <Input
                        className="account-settings__input"
                        name="office_street"
                        theme="gray"
                        value={values.office_street}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_street" />
                      </div>
                    </div>
                  </div>
                  <div className="account-settings__field-grid account-settings__field-grid--col-3">
                    <div
                      className={this.getFieldClasses(
                        "office_city",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                    >
                      <div className="account-settings__label">
                        {
                          COUNTRY_FIELDS[this.selectedCountry].address_fields
                            .city
                        }
                      </div>
                      <Input
                        className="account-settings__input"
                        name="office_city"
                        theme="gray"
                        value={values.office_city}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_city" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_state",
                        errors,
                        touched
                      )}
                    >
                      <div className="account-settings__label">
                        {
                          COUNTRY_FIELDS[this.selectedCountry].address_fields
                            .state
                        }
                      </div>
                      <Select
                        className="account-settings__input"
                        name="office_state"
                        theme="gray"
                        isSearchable={true}
                        options={
                          this.selectedCountry == COUNTRY_FIELDS.USA.short_name
                            ? this.props.us_state_list
                            : this.props.gb_county_list
                        }
                        value={values.office_state}
                        onBlur={() => {
                          this.unsetMessage();
                          setFieldTouched("office_state", true);
                        }}
                        onChange={value => {
                          this.unsetMessage();
                          setFieldValue("office_state", value);
                        }}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_state" />
                      </div>
                    </div>
                    <div
                      className={this.getFieldClasses(
                        "office_zip",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                    >
                      <div className="account-settings__label">
                        {
                          COUNTRY_FIELDS[this.selectedCountry].address_fields
                            .zip
                        }
                      </div>
                      <Input
                        className="account-settings__input"
                        name="office_zip"
                        theme="gray"
                        value={values.office_zip}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      ></Input>
                      <div className="account-settings__error">
                        <ErrorMessage name="office_zip" />
                      </div>
                    </div>
                  </div>
                  <div className="account-settings__field-grid">
                    <div
                      className={this.getFieldClasses(
                        "office_name",
                        errors,
                        touched,
                        ["max-width"]
                      )}
                    >
                      <div className="account-settings__label">Office Name</div>
                      <Input
                        className="account-settings__input"
                        name="office_name"
                        theme="gray"
                        value={values.office_name}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
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
                        options={this.props.office_options}
                        value={values.office_type}
                        onBlur={() => {
                          this.unsetMessage();
                          setFieldTouched("office_type", true);
                        }}
                        onChange={value => {
                          this.unsetMessage();
                          setFieldValue("office_type", value);
                        }}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="office_type" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="account-settings__controls">
                <Button
                  className="account-settings__button"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
                {this.showMessage(errors, touched)}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
