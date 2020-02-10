import cn from "classnames";
import { Formik, Form } from "formik";
import _intersection from "lodash/intersection";
import _isEqual from "lodash/isEqual";
import PropTypes from "prop-types";
import React from "react";

import { COUNTRY_FIELDS } from "../../constants";
import CompanyModal from "../../containers/settings_company_modal";
import OfficeModal from "../../containers/settings_office_modal";
import AccountSettingsField from "../account_settings_field";
import { Tick, Upload } from "../../icons";
import { accountSettings as actions } from "../../redux_base/actions";
import { formatPhone } from "../../utils/formatters";
import Button from "../button";
import Input from "../input";
import MultiSelect from "../multi_select";
import Select from "../select";
import { MAX_AVATAR_SIZE, userSchema } from "./validators";

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
      company: PropTypes.PropTypes.object,
      company_roles: PropTypes.arrayOf(PropTypes.string),
      office_country: PropTypes.object,
      office_street: PropTypes.string,
      office_city: PropTypes.string,
      office_state: PropTypes.object,
      office_zip5: PropTypes.string,
      office_name: PropTypes.string,
      office_type: PropTypes.number
    }),
    company_roles: MultiSelect.optionsType,
    office_options: Select.optionsType,
    office_countries: Select.optionsType,
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
      company: undefined,
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
    },
    company_roles: [],
    office_options: [],
    office_countries: []
  };
  static fieldsSubmit = [
    "avatar",
    "first_name",
    "last_name",
    "title",
    "phone_country_code",
    "phone",
    "phone_ext"
  ];

  constructor(props) {
    super(props);
    this.state = {
      fieldsSubmitted: false,
      isCompanyOpen: false,
      isOfficeOpen: false
    };
    this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_isEqual(this.props.profile, prevProps.profile)) {
      this.formik.setValues(this.getProfileValues(this.props.profile));
    }
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
    this.setState({
      userMessage: null,
      companyMessage: null,
      officeMessage: null
    });
  }

  getProfileValues = profile => {
    let p = { ...profile };
    if (!Object.keys(p).length) {
      p = { ...Profile.defaultProps.profile };
    }
    if (p.company_roles) {
      p.company_roles = this.props.company_roles.filter(i =>
        p.company_roles.includes(i.value)
      );
    }
    p.office_type = this.props.office_options.filter(
      i => i.value === p.office_type
    )[0];
    if (!p.office_country) {
      p.office_country = {
        label: COUNTRY_FIELDS.USA.full_name,
        value: COUNTRY_FIELDS.USA.short_name
      };
    }

    return p;
  };

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

  getHelpTextClasses = (name, errors, touched) => {
    return cn("account-settings__help-text", {
      "account-settings__help-text--error": errors[name] && touched[name]
    });
  };

  loadCompany = (inputValue, callback) => {
    clearTimeout(this.loadCompanyTimeOut);
    this.loadCompanyTimeOut = setTimeout(() => {
      this.props.dispatch({
        type: "API_COMPANY_SEARCH",
        data: { company: inputValue },
        callback
      });
    }, 300);
  };

  loadAddress = (inputValue, callback) => {
    const data = { address: inputValue };
    const { profile } = this.props;
    const businessId = profile.company?.value;
    const businessName = profile.company?.label;
    if (businessId !== businessName) {
      data["business_id"] = businessId;
    }
    clearTimeout(this.loadAddressTimeOut);
    this.loadAddressTimeOut = setTimeout(() => {
      this.props.dispatch({
        type: "API_COMPANY_ADDRESS",
        data,
        callback
      });
    }, 300);
  };

  onChangeCompany = company => {
    this.props.dispatch({
      type: "API_COMPANY_ADDRESS",
      data: { address: "", business_id: company.label }
    });
  };

  getCompanyValues = () => {
    const p = this.getProfileValues(this.props.profile);
    return {
      company: p.company,
      company_roles: p.company_roles
    };
  };

  getOfficeValues = () => {
    const p = this.getProfileValues(this.props.profile);
    return {
      office_country: p.office_country,
      office_street: p.office_street,
      office_city: p.office_city,
      office_state: p.office_state,
      office_zip: p.office_zip,
      office_name: p.office_name,
      office_type: p.office_type
    };
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

  setUserDataSuccess = () => {
    this.formik.setSubmitting(false);
    this.setState({ userMessage: "General info has been saved." });
    this.props.dispatch(actions.requestSettings());
  };

  setCompanySuccess = () => {
    this.formik.setSubmitting(false);
    this.setState({
      companyMessage: "Company info has been saved.",
      isCompanyOpen: false
    });
    this.props.dispatch(actions.requestSettings());
  };

  setOfficeSuccess = () => {
    this.formik.setSubmitting(false);
    this.setState({
      officeMessage: "Office info has been saved.",
      isOfficeOpen: false
    });
    this.props.dispatch(actions.requestSettings());
  };

  showSuccessMessage = message => {
    if (!message) {
      return;
    }
    return (
      <div className="account-settings__success">
        <Tick className="account-settings__checked" />
        {message}
      </div>
    );
  };

  showUserMessage = (errors, touched) => {
    if (this.state.userMessage) {
      return this.showSuccessMessage(this.state.userMessage);
    } else if (Object.keys(errors).length) {
      return this.showErrorMessage(errors, touched);
    }
  };

  showCompanyMessage = () => this.showSuccessMessage(this.state.companyMessage);

  showOfficeMessage = () => this.showSuccessMessage(this.state.officeMessage);

  updateValues = values => {
    this.formik.setFieldValue("office_street", values.office_street);
    this.formik.setFieldValue("office_city", values.office_city);
    this.formik.setFieldValue("office_state", {
      label: values.full_state,
      value: values.full_state
    });
    this.formik.setFieldValue("office_zip", values.office_zip);
  };

  setErrorMessages = errors => {
    this.formik.setSubmitting(false);
    const formikErrors = {};
    for (let k of Object.keys(errors)) {
      formikErrors[k] = errors[k][0].message;
    }
    this.formik.setErrors(formikErrors);
  };

  onChange = v => {
    this.unsetMessage();
    this.formik.handleChange(v);
  };

  onBlur = v => {
    this.unsetMessage();
    this.formik.handleBlur(v);
  };

  openCompanyModal = () => {
    this.unsetMessage();
    this.setState({ isCompanyOpen: true });
  };

  closeCompanyModal = () => {
    this.setState({ isCompanyOpen: false });
  };

  openOfficeModal = () => {
    this.unsetMessage();
    this.setState({ isOfficeOpen: true });
  };

  closeOfficeModal = () => {
    this.setState({ isOfficeOpen: false });
  };

  onSaveUser = values => {
    this.unsetMessage();
    const dataValues = { ...values };
    const data = new FormData();
    for (const k of Object.keys(dataValues)) {
      if (Profile.fieldsSubmit.includes(k)) {
        if (
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
    this.props.dispatch({
      type: "API_ACCOUNT_PROFILE_USER",
      callback: this.setUserDataSuccess,
      onError: this.setErrorMessages,
      data
    });
  };

  render() {
    const { profile } = this.props;
    return (
      <div className="account-settings__tab">
        <Formik
          ref={this.setFormik}
          initialValues={this.getProfileValues(profile)}
          validationSchema={userSchema}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={this.onSaveUser}
        >
          {({ errors, touched, values }) => (
            <div className="account-settings__tab-content">
              <Form method="post" autoComplete="off">
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
                    <AccountSettingsField
                      label="First Name"
                      name="first_name"
                      errorKey="first_name"
                      {...{ errors, touched }}
                    >
                      <Input
                        className="account-settings-field__input"
                        name="first_name"
                        theme="gray"
                        value={values.first_name}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      label="Last Name"
                      name="last_name"
                      errorKey="last_name"
                      {...{ errors, touched }}
                    >
                      <Input
                        className="account-settings-field__input"
                        name="last_name"
                        theme="gray"
                        value={values.last_name}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      label="Title (Optional)"
                      name="title"
                      errorKey="title"
                      {...{ errors, touched }}
                    >
                      <Input
                        className="account-settings__input"
                        name="title"
                        theme="gray"
                        value={values.title}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                    <AccountSettingsField
                      label="Phone Number (Optional)"
                      name="phone"
                      errorKey="phone"
                      {...{ errors, touched }}
                    >
                      <>
                        <div className="account-settings__plus-tag">+</div>
                        <div className="account-settings__phone-input">
                          <Input
                            className="account-settings-field__country-code"
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
                            className="account-settings-field__input"
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
                      </>
                    </AccountSettingsField>
                    <AccountSettingsField
                      label="Phone Extension (Optional)"
                      name="phone_ext"
                      errorKey="phone_ext"
                      {...{ errors, touched }}
                    >
                      <Input
                        className="account-settings-field__input"
                        name="phone_ext"
                        theme="gray"
                        type="tel"
                        value={values.phone_ext}
                        onBlur={this.onBlur}
                        onChange={this.onChange}
                      />
                    </AccountSettingsField>
                  </div>
                </div>
                <div className="account-settings__controls account-settings__controls--noborder">
                  <Button
                    className="account-settings__button"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                  {this.showUserMessage(errors, touched)}
                </div>
              </Form>
              <div className="account-settings__tab-subsection">
                <div className="account-settings__tab-title">
                  Company Info
                  {this.showCompanyMessage()}
                  <Button
                    className="account-settings__edit-button"
                    color="secondary-gray"
                    onClick={this.openCompanyModal}
                  >
                    <div className="account-settings__edit-button-text">
                      Edit Company Info
                    </div>
                  </Button>
                  <CompanyModal
                    isOpen={this.state.isCompanyOpen}
                    data={this.getCompanyValues()}
                    companyRolesOptions={this.props.company_roles}
                    loadCompany={this.loadCompany}
                    onChangeCompany={this.onChangeCompany}
                    onClose={this.closeCompanyModal}
                    onSuccess={this.setCompanySuccess}
                  />
                </div>
                <div className="account-settings__field-grid account-settings__field-grid--col-3">
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">Company</div>
                    <div className="account-settings__value">
                      {values.company?.label}
                    </div>
                  </div>
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">Company Role</div>
                    <div className="account-settings__value">
                      {values.company_roles?.map(v => v.label).join(", ")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="account-settings__tab-subsection">
                <div className="account-settings__tab-title">
                  Office Info
                  {this.showOfficeMessage()}
                  <Button
                    className="account-settings__edit-button"
                    color="secondary-gray"
                    onClick={this.openOfficeModal}
                  >
                    <div className="account-settings__edit-button-text">
                      Edit Office Info
                    </div>
                  </Button>
                  <OfficeModal
                    isOpen={this.state.isOfficeOpen}
                    isConfirmModal={true}
                    data={this.getOfficeValues()}
                    office_options={this.props.office_options}
                    office_countries={this.props.office_countries}
                    us_state_list={this.props.us_state_list}
                    gb_county_list={this.props.gb_county_list}
                    loadAddress={this.loadAddress}
                    onClose={this.closeOfficeModal}
                    onSuccess={this.setOfficeSuccess}
                  />
                </div>
                <div className="account-settings__value-field">
                  <div className="account-settings__label">Country</div>
                  <div className="account-settings__value">
                    {COUNTRY_FIELDS[this.selectedCountry].full_name}
                  </div>
                </div>
                <div className="account-settings__value-field">
                  <div className="account-settings__label">Address</div>
                  <div className="account-settings__value">
                    {values.office_street}
                  </div>
                </div>
                <div className="account-settings__field-grid account-settings__field-grid--col-3">
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">
                      {COUNTRY_FIELDS[this.selectedCountry].address_fields.city}
                    </div>
                    <div className="account-settings__value">
                      {values.office_city}
                    </div>
                  </div>
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">
                      {
                        COUNTRY_FIELDS[this.selectedCountry].address_fields
                          .state
                      }
                    </div>
                    <div className="account-settings__value">
                      {values.office_state?.value}
                    </div>
                  </div>
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">
                      {COUNTRY_FIELDS[this.selectedCountry].address_fields.zip}
                    </div>
                    <div className="account-settings__value">
                      {values.office_zip}
                    </div>
                  </div>
                </div>
                <div className="account-settings__field-grid account-settings__field-grid--col-3">
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">Name</div>
                    <div className="account-settings__value">
                      {values.office_name}
                    </div>
                  </div>
                  <div className="account-settings__value-field">
                    <div className="account-settings__label">Type</div>
                    <div className="account-settings__value">
                      {values.office_type?.label}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
    );
  }
}
