import cn from "classnames";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import _intersection from "lodash/intersection";

import AccountForm from "../account_form";
import FormField from "../form_field";
import PageAuth from "../page_auth";
import Input from "../input";
import Select, { SelectSearch } from "../select";
import Button from "../button";
import Checkbox from "../checkbox";
import MultiSelect from "../multi_select";
import { validateAddress } from "../../api/account_settings";
import AddressModal from "../address_modal";
import { addressModal } from "../../state/actions";
import GoogleAddress from "../google_address";
import LoaderContainer from "../../containers/account_settings/loader";
import router from "../../router";

import { propertySchema } from "./validators";
import "./complete_account_view.scss";

const address_fields = {
  USA: {
    city: "City",
    state: "State",
    zip: "Zip Code"
  },
  GB: {
    city: "Postal Town",
    state: "County (optional)",
    zip: "Postcode"
  }
};

class CompleteAccountView extends React.PureComponent {
  static propTypes = {
    office_types: Select.optionsType.isRequired,
    company_roles: MultiSelect.optionsType.isRequired,
    office_address: PropTypes.string,
    office_countries: Select.optionsType
  };

  constructor(props) {
    super(props);
    this.formik = React.createRef();
    this._router = router("/complete-account")(() => {
      props.dispatch({
        type: "API_COMPLETE_ACCOUNT"
      });
    });
    this.selectedCountry = "USA";
  }

  initialValues = {
    first_name: "",
    last_name: "",
    title: "",
    company: undefined,
    company_role: [],
    office_country: { label: "United States of America", value: "USA" },
    // office_address: "",
    office_street: "",
    office_city: "",
    office_state: undefined,
    office_zip: "",
    office_name: "",
    office_type: undefined,
    terms: false
  };

  selectSearchComponents = {
    DropdownIndicator: () => null
  };

  selectStyles = {
    container: provided => ({ ...provided, width: "100%" }),
    valueContainer: provided => ({ ...provided, height: "18px" })
  };

  steps = [
    { name: "Set Password", isComplete: true },
    { name: "Complete Account", isActive: true }
  ];

  getButtonColor = isValid => {
    if (isValid) {
      return "primary";
    }
    return "disabled-light";
  };

  getSelectLabel = values => values?.map(v => v.label).join(", ");

  loadAddress = (inputValue, callback) => {
    const data = { address: inputValue };
    const context = this.formik?.current?.getFormikContext();
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

  setErrorMessages = errors => {
    this.formik.current.setSubmitting(false);
    const formikErrors = {};
    for (let k of Object.keys(errors)) {
      formikErrors[k] = errors[k][0]?.message;
    }
    this.formik.current.setErrors(formikErrors);
  };

  showMessage = (errors, touched) => {
    if (Object.keys(errors).length) {
      return this.showErrorMessage(errors, touched);
    }
  };

  showErrorMessage = (errors, touched) => {
    const errorFields = Object.keys(errors);
    const touchedFields = Object.keys(touched);
    const fields = _intersection(errorFields, touchedFields);
    if (!fields.length) {
      return;
    }
    let message = "Please review highlighted fields above.";
    if (this.state?.invalid_address) {
      message =
        "Unable to verify the address. Please try again with a valid address.";
    }
    return <div className="account-settings__general-error">{message}</div>;
  };

  onSubmit = (values, actions) => {
    const data = { ...values };
    data.company = values.company.value;
    data.company_role = values.company_role.map(type => type.value);
    data.office_type = values.office_type.value;
    data.office_state = values.office_state.value;
    validateAddress(values).then(response => {
      if (response.data.error) {
        this.setState({ invalid_address: true });
        this.formik.current.setErrors({
          office_street: "see below",
          office_city: "*",
          office_state: "*",
          office_zip: "*"
        });
      } else {
        this.setState({
          addresses: response.data,
          invalid_address: false
        });
        this.props.dispatch(addressModal.open(data, response.data));
      }
    });
  };

  onCreateCompany = value => {
    const option = { label: value, value };
    this.formik.current.setFieldValue("company", option);
  };

  onChangeCompany = company => {
    this.formik.current.setFieldValue("company", company);
    this.props.dispatch({
      type: "API_COMPANY_ADDRESS",
      data: { address: "", business_id: company.value }
    });
  };

  onBlurCompany = () => {
    this.formik.current.setFieldTouched("company");
  };

  onChangeCompanyRole = value => {
    this.formik.current.setFieldValue("company_role", value);
  };

  onBlurCompanyRole = () => {
    this.formik.current.setFieldTouched("company_role");
  };

  onChangeOfficeAddress = value => {
    if (value.street) {
      this.formik.current.setFieldValue("office_street", value.street);
      this.formik.current.setFieldValue("office_city", value.city);
      this.formik.current.setFieldValue("office_state", {
        label: value.state,
        value: value.state
      });
      this.formik.current.setFieldValue("office_zip", value.zip);
      if (value.country == "GB") {
        this.selectedCountry = "GB";
        this.formik.current.setFieldValue("office_country", {
          label: "United Kingdom",
          value: "GB"
        });
      } else if (value.country == "USA") {
        this.selectedCountry = "USA";
        this.formik.current.setFieldValue("office_country", {
          label: "United States of America",
          value: "USA"
        });
      }
    } else {
      this.formik.current.setFieldValue("office_street", value.value);
    }
  };

  onBlurOfficeAddress = () => {
    this.formik.current.setFieldTouched("office_street");
    const formikContext = this.formik.current.getFormikContext();
    if (formikContext.values.office_street) {
      this.formik.current.setFieldTouched("office_street");
    }
    if (formikContext.values.office_city) {
      this.formik.current.setFieldTouched("office_city");
    }
    if (formikContext.values.office_state) {
      this.formik.current.setFieldTouched("office_state");
    }
    if (formikContext.values.office_zip) {
      this.formik.current.setFieldTouched("office_zip");
    }
  };

  onChangeOfficeType = value => {
    this.formik.current.setFieldValue("office_type", value);
  };

  onBlurOfficeType = () => {
    this.formik.current.setFieldTouched("office_type");
  };

  onChangeTerms = () => {
    const context = this.formik.current.getFormikContext();
    const value = context?.values?.terms;
    this.formik.current.setFieldValue("terms", !value);
  };

  onChangeCountry = value => {
    this.selectedCountry = value.value;
    this.formik.current.setFieldValue("office_country", value);
    const context = this.formik.current.getFormikContext();
    if (context.values.office_state) {
      this.formik.current.setFieldValue("office_state", undefined);
    }
  };

  onChangeOfficeState = value => {
    this.formik.current.setFieldValue("office_state", value);
  };

  onBlurOfficeState = () => {
    this.formik.current.setFieldTouched("office_state");
  };

  render() {
    const {
      company_roles,
      office_types,
      companyAddresses,
      office_countries
    } = this.props;
    const classes = cn("complete-account__field-set", AccountForm.fieldClass);
    return (
      <PageAuth backLink="/">
        <AddressModal
          title="Confirm Office Address"
          onClose={this.props.dispatch(addressModal.close)}
          theme="light"
          onError={this.setErrorMessages}
          dispatch_type="API_COMPLETE_ACCOUNT"
        />
        <LoaderContainer />
        <AccountForm
          className="complete-account"
          steps={this.steps}
          title="Complete your account"
          subtitle="We need just a bit more information about you to complete your account."
        >
          <Formik
            validationSchema={propertySchema}
            onSubmit={this.onSubmit}
            initialValues={this.initialValues}
            ref={this.formik}
          >
            {({
              errors,
              touched,
              values,
              isValid,
              handleChange,
              handleBlur
            }) => (
              <Form>
                <div className="complete-account__section-label complete-account__section-label--first">
                  General Info
                </div>
                <div className={classes}>
                  <FormField
                    className="complete-account__field"
                    label="first name"
                    showError={touched.first_name}
                    showIcon={false}
                    error={errors.first_name}
                  >
                    <Input
                      type="text"
                      name="first_name"
                      theme="highlight"
                      value={values.first_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormField>
                  <FormField
                    className="complete-account__field"
                    label="Last name"
                    showError={touched.last_name}
                    showIcon={false}
                    error={errors.last_name}
                  >
                    <Input
                      type="text"
                      name="last_name"
                      theme="highlight"
                      value={values.last_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </FormField>
                </div>
                <FormField
                  className={AccountForm.fieldClass}
                  label="title (Optional)"
                  showError={touched.title}
                  showIcon={false}
                  error={errors.title}
                >
                  <Input
                    type="text"
                    name="title"
                    theme="highlight"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
                <div className="complete-account__section-label">
                  Business Info
                </div>
                <FormField
                  className={AccountForm.fieldClass}
                  label="company"
                  showError={!!touched.company}
                  showIcon={false}
                  error={errors.company?.value}
                >
                  <SelectSearch
                    name="company"
                    theme="highlight"
                    placeholder=""
                    components={this.selectSearchComponents}
                    styles={this.selectStyles}
                    loadOptions={this.loadCompany}
                    defaultOptions={[]}
                    isCreatable={true}
                    value={values.company}
                    onCreateOption={this.onCreateCompany}
                    onChange={this.onChangeCompany}
                    onBlur={this.onBlurCompany}
                  />
                </FormField>
                <FormField
                  label="company role"
                  className={AccountForm.fieldClass}
                  showError={!!touched.company_role}
                  showIcon={false}
                  error={errors.company_role}
                >
                  <MultiSelect
                    name="company_role"
                    theme="highlight"
                    styles={this.selectStyles}
                    options={company_roles}
                    isShowControls={false}
                    isShowAllOption={false}
                    label={this.getSelectLabel(values.company_role)}
                    placeholder="Select role..."
                    value={values.company_role}
                    onChange={this.onChangeCompanyRole}
                    onBlur={this.onBlurCompanyRole}
                  />
                </FormField>
                <div className="complete-account__section-label">
                  Office Info
                </div>
                <FormField
                  className={AccountForm.fieldClass}
                  label="country"
                  showError={!!touched.office_country}
                  showIcon={false}
                  error={errors.office_country}
                >
                  <Select
                    name="office_country"
                    theme="highlight"
                    styles={this.selectStyles}
                    options={office_countries}
                    value={values.office_country}
                    onChange={this.onChangeCountry}
                    onBlur={handleBlur}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label="address"
                  showError={touched.office_street}
                  showIcon={false}
                  error={errors.office_street}
                >
                  <GoogleAddress
                    name="office_street"
                    loadOptions={this.loadAddress}
                    cacheOptions={false}
                    companyAddresses={companyAddresses}
                    labelCompany=""
                    labelGoogle=""
                    display="partial"
                    value={values.office_street?.value}
                    onChange={this.onChangeOfficeAddress}
                    onBlur={this.onBlurOfficeAddress}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label={address_fields[this.selectedCountry].city}
                  showError={touched.office_city}
                  showIcon={false}
                  error={errors.office_city}
                >
                  <Input
                    type="text"
                    name="office_city"
                    theme="highlight"
                    value={values.office_city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label={address_fields[this.selectedCountry].state}
                  showError={!!touched.office_state}
                  showIcon={false}
                  error={errors.office_state}
                >
                  <Select
                    className="account-settings__input"
                    name="office_state"
                    theme="highlight"
                    styles={this.selectStyles}
                    isSearchable={true}
                    options={
                      this.selectedCountry == "USA"
                        ? this.props.us_state_list
                        : this.props.gb_county_list
                    }
                    value={values.office_state}
                    onBlur={this.onBlurOfficeState}
                    onChange={this.onChangeOfficeState}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label={address_fields[this.selectedCountry].zip}
                  showError={touched.office_zip}
                  showIcon={false}
                  error={errors.office_zip}
                >
                  <Input
                    type="text"
                    name="office_zip"
                    theme="highlight"
                    value={values.office_zip}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label="Office name"
                  showError={touched.office_name}
                  showIcon={false}
                  error={errors.office_name}
                >
                  <Input
                    type="text"
                    name="office_name"
                    theme="highlight"
                    value={values.office_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </FormField>
                <FormField
                  className={AccountForm.fieldClass}
                  label="office type"
                  showError={!!touched.office_type}
                  showIcon={false}
                  error={errors.office_type}
                >
                  <Select
                    name="office_type"
                    theme="highlight"
                    styles={this.selectStyles}
                    options={office_types}
                    value={values.office_type}
                    onChange={this.onChangeOfficeType}
                    onBlur={this.onBlurOfficeType}
                  />
                </FormField>
                <div className="complete-account__terms">
                  <Checkbox
                    className="complete-account__checkbox"
                    isSelected={values.terms}
                    onClick={this.onChangeTerms}
                  />
                  <input
                    type="checkbox"
                    name="terms"
                    hidden={true}
                    checked={values.terms}
                    readOnly={true}
                  />
                  Accept&nbsp;
                  <a
                    className="complete-account__link"
                    href="https://www.remarkably.io/terms"
                    target="_blank"
                  >
                    Terms and Conditions
                  </a>
                </div>
                <Button
                  className="complete-account__button"
                  type="submit"
                  color={this.getButtonColor(isValid)}
                  fullWidth={true}
                  uppercase={true}
                >
                  complete account
                </Button>
                {this.showMessage(errors, touched)}
              </Form>
            )}
          </Formik>
        </AccountForm>
      </PageAuth>
    );
  }
}

const mapState = state => {
  return {
    ...state.network,
    ...state.completeAccount
  };
};

export default connect(mapState)(CompleteAccountView);
