import cn from "classnames";
import { ErrorMessage, Formik, Form } from "formik";
import _intersection from "lodash/intersection";
import _isEqual from "lodash/isEqual";
import _pick from "lodash/pick";
import PropTypes from "prop-types";
import React from "react";
import AddressModal from "../address_modal";
import { COUNTRY_FIELDS } from "../../constants";

import { Tick, Upload } from "../../icons";
import {
  accountSettings as actions,
  addressModal
} from "../../redux_base/actions";
import { formatPhone } from "../../utils/formatters";
import { validateAddress } from "../../api/account_settings";
import Button from "../button";
import Input from "../input";
import MultiSelect from "../multi_select";
import Select, { SelectSearch } from "../select";
import GoogleAddress from "../google_address";
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
    if (this.state.message) {
      this.setState({ message: null });
    }
  }

  getProfileValues = profile => {
    let p = { ...profile };
    if (!Object.keys(p).length) {
      p = { ...Profile.defaultProps.profile };
    }
    p.company_roles = this.props.company_roles.filter(i =>
      p.company_roles.includes(i.value)
    );
    p.office_type = this.props.office_options.filter(
      i => i.value === p.office_type
    )[0];
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

  selectSearchComponents = {
    DropdownIndicator: () => null
  };

  onCreateCompany = value => {
    const option = { label: value, value };
    this.formik.setFieldValue("company", option);
  };

  loadAddress = (inputValue, callback) => {
    const data = { address: inputValue };
    const context = this.formik?.getFormikContext();
    const businessId = context?.values?.company?.value;
    const businessName = context?.values?.company?.label;
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

  onChangeOfficeAddress = value => {
    if (value.street) {
      this.formik.setFieldValue("office_street", value.street);
      this.formik.setFieldValue("office_city", value.city);
      this.formik.setFieldValue("office_state", {
        label: value.state,
        value: value.state
      });
      this.formik.setFieldValue("office_zip", value.zip);
      if (value.country == COUNTRY_FIELDS.GBR.short_name) {
        this.selectedCountry = COUNTRY_FIELDS.GBR.short_name;
        this.formik.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.GBR.full_name,
          value: COUNTRY_FIELDS.GBR.short_name
        });
      } else if (value.country == COUNTRY_FIELDS.USA.short_name) {
        this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
        this.formik.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.USA.full_name,
          value: COUNTRY_FIELDS.USA.short_name
        });
      }
    } else {
      this.formik.setFieldValue("office_street", value.value);
    }
  };

  onBlurOfficeAddress = () => {
    this.formik.setFieldTouched("office_street");
    const formikContext = this.formik.getFormikContext();
    if (formikContext.values.office_street) {
      this.formik.setFieldTouched("office_street");
    }
    if (formikContext.values.office_city) {
      this.formik.setFieldTouched("office_city");
    }
    if (formikContext.values.office_state) {
      this.formik.setFieldTouched("office_state");
    }
    if (formikContext.values.office_zip) {
      this.formik.setFieldTouched("office_zip");
    }
  };

  onChangeCompany = company => {
    this.formik.setFieldValue("company", company);
    this.props.dispatch({
      type: "API_COMPANY_ADDRESS",
      data: { address: "", business_id: company.label }
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
    this.props.dispatch(actions.requestSettings());
  };

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
        } else if (k === "company") {
          data.append("company", dataValues.company.label);
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
    const addressValues = _pick(values, [
      "office_country",
      "office_street",
      "office_city",
      "office_state",
      "office_zip"
    ]);
    validateAddress(addressValues).then(response => {
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
    const { companyAddresses, profile } = this.props;
    return (
      <div className="account-settings__tab">
        <Formik
          ref={this.setFormik}
          initialValues={this.getProfileValues(profile)}
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
              <AddressModal
                title="Confirm Office Address"
                callback={this.setSuccessMessage}
                onError={this.setErrorMessages}
                dispatch_type="API_ACCOUNT_PROFILE"
                updateValues={this.updateValues}
              />
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
                      <SelectSearch
                        name="company"
                        theme="default"
                        placeholder=""
                        components={this.selectSearchComponents}
                        className="account-settings__input"
                        loadOptions={this.loadCompany}
                        defaultOptions={[]}
                        isCreatable={true}
                        value={values.company}
                        onCreateOption={this.onCreateCompany}
                        onChange={this.onChangeCompany}
                        onBlur={this.onBlur}
                      />
                      <div className="account-settings__error">
                        <ErrorMessage name="company.value" />
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
                        Company Type
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
                      <GoogleAddress
                        name="office_street"
                        className="account-settings__input"
                        loadOptions={this.loadAddress}
                        cacheOptions={false}
                        companyAddresses={companyAddresses}
                        theme=""
                        labelCompany=""
                        labelGoogle=""
                        display="full"
                        value={values.office_street}
                        onChange={this.onChangeOfficeAddress}
                        onBlur={this.onBlurOfficeAddress}
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
