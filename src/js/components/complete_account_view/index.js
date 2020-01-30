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
import { addressModal } from "../../redux_base/actions";
import GoogleAddress from "../google_address";
import LoaderContainer from "../../containers/loader";

import { propertySchema } from "./validators";
import "./complete_account_view.scss";
import { COUNTRY_FIELDS } from "../../constants";

export class CompleteAccountView extends React.PureComponent {
  static propTypes = {
    office_types: Select.optionsType.isRequired,
    company_roles: MultiSelect.optionsType.isRequired,
    office_address: PropTypes.string,
    office_countries: Select.optionsType
  };

  constructor(props) {
    super(props);
    this.formik = React.createRef();
    this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
  }

  initialValues = {
    first_name: "",
    last_name: "",
    title: "",
    company: undefined,
    company_role: [],
    office_country: {
      label: COUNTRY_FIELDS.USA.full_name,
      value: COUNTRY_FIELDS.USA.short_name
    },
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
      if (value.country == COUNTRY_FIELDS.GBR.short_name) {
        this.selectedCountry = COUNTRY_FIELDS.GBR.short_name;
        this.formik.current.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.GBR.full_name,
          value: COUNTRY_FIELDS.GBR.short_name
        });
      } else if (value.country == COUNTRY_FIELDS.USA.short_name) {
        this.selectedCountry = COUNTRY_FIELDS.USA.short_name;
        this.formik.current.setFieldValue("office_country", {
          label: COUNTRY_FIELDS.USA.full_name,
          value: COUNTRY_FIELDS.USA.short_name
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

  onCloseModal = () => {
    this.props.dispatch(addressModal.close);
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
          onClose={this.onCloseModal}
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
                  Company Info
                </div>
                <Button
                  className="complete-account__edit-button"
                  color="secondary-gray"
                >
                  Enter Company info
                </Button>
                <div className="complete-account__section-label">
                  Office Info
                </div>
                <Button
                  className="complete-account__edit-button"
                  color="secondary-gray"
                >
                  Enter Office info
                </Button>
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
