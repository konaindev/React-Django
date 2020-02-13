import cn from "classnames";
import { Formik, Form } from "formik";
import _intersection from "lodash/intersection";
import _pick from "lodash/pick";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import AccountForm from "../account_form";
import CompanyModal from "../company_modal";
import FormField from "../form_field";
import PageAuth from "../page_auth";
import Input from "../input";
import Select from "../select";
import Button from "../button";
import Checkbox from "../checkbox";
import MultiSelect from "../multi_select";
import OfficeModal from "../office_modal";
import { validateAddress } from "../../api/account_settings";
import AddressModal from "../address_modal";
import { COUNTRY_FIELDS } from "../../constants";
import LoaderContainer from "../../containers/loader";
import { addressModal, completeAccount } from "../../redux_base/actions";
import { isTrueValues } from "../../utils/misc";

import { propertySchema } from "./validators";
import "./complete_account_view.scss";

const CompanyInfoEmpty = ({ onOpenCompanyModal, showErrorMessage }) => (
  <div>
    <div className="complete-account__section-label">
      Company Info {showErrorMessage()}
    </div>
    <Button
      className="complete-account__edit-button"
      color="secondary-gray"
      asDiv={true}
      onClick={onOpenCompanyModal}
      onKeyPress={onOpenCompanyModal}
      tabIndex="0"
    >
      Enter Company info
    </Button>
  </div>
);

const CompanyInfo = ({ data, onOpenCompanyModal, showErrorMessage }) => (
  <div>
    <div className="complete-account__section-label">
      Company Info
      {showErrorMessage()}
      <Button
        className="complete-account__edit-button complete-account__edit-button--in-box"
        color="secondary-gray"
        asDiv={true}
        onClick={onOpenCompanyModal}
        onKeyPress={onOpenCompanyModal}
        tabIndex="0"
      >
        Enter Company info
      </Button>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Company</div>
      <div className="complete-account__value">{data.company.label}</div>
    </div>
    <div className="complete-account__field-value">
      <div className="complete-account__field-label">Company Role</div>
      <div className="complete-account__value">
        {data.company_roles.map(r => r.label).join(", ")}
      </div>
    </div>
  </div>
);

const OfficeInfoEmpty = ({ onOpenOfficeModal }) => (
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

const OfficeInfo = ({ onOpenOfficeModal, data }) => (
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

export class CompleteAccountView extends React.PureComponent {
  static propTypes = {
    office_types: Select.optionsType.isRequired,
    company_roles: MultiSelect.optionsType.isRequired,
    office_address: PropTypes.string,
    office_countries: Select.optionsType,
    is_completed: PropTypes.bool,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    dispatch() {}
  };

  constructor(props) {
    super(props);
    this.formik = React.createRef();
    this.state = {
      isCompanyOpen: false,
      isOfficeOpen: false
    };
  }

  initialValues = {
    first_name: "",
    last_name: "",
    title: "",
    company: undefined,
    company_roles: [],
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

  componentDidMount() {
    this.props.dispatch(completeAccount.fetch());
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.is_completed) {
      this.props.dispatch(completeAccount.redirect("/"));
    }
  }

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

  showCompanyError = () => {
    const state = this.formik.current?.state || { errors: {}, touched: {} };
    const { errors, touched } = state;
    if (errors.company && touched.company) {
      return (
        <div className="account-settings__general-error">is required.</div>
      );
    }
  };

  onChangeCompany = company => {
    this.props.dispatch({
      type: "API_COMPANY_ADDRESS",
      data: { address: "", business_id: company.value }
    });
  };

  onChangeTerms = () => {
    const context = this.formik.current.getFormikContext();
    const value = context?.values?.terms;
    this.formik.current.setFieldValue("terms", !value);
  };

  onCloseModal = () => {
    this.props.dispatch(addressModal.close);
  };

  onOpenCompanyModal = () => {
    this.setState({ isCompanyOpen: true });
  };

  onCloseCompanyModal = () => {
    this.setState({ isCompanyOpen: false });
  };

  onOpenOfficeModal = () => {
    this.setState({ isOfficeOpen: true });
  };

  onCloseOfficeModal = () => {
    this.setState({ isOfficeOpen: false });
  };

  getCompanyValues = () => {
    const initialValues = _pick(this.initialValues, [
      "company",
      "company_roles"
    ]);
    const values = this.formik.current?.state.values || initialValues;
    return {
      company: values.company,
      company_roles: values.company_roles
    };
  };

  getOfficeValues = () => {
    const initialValues = _pick(this.initialValues, [
      "office_country",
      "office_street",
      "office_city",
      "office_state",
      "office_zip",
      "office_name",
      "office_type"
    ]);
    const values = this.formik.current?.state.values || initialValues;
    return {
      office_country: values.office_country,
      office_street: values.office_street,
      office_city: values.office_city,
      office_state: values.office_state,
      office_zip: values.office_zip,
      office_name: values.office_name,
      office_type: values.office_type
    };
  };

  putCompanyValues = () => values => {
    const data = { ...this.formik.current.state.values, ...values };
    this.formik.current.setValues(data);
    this.onCloseCompanyModal();
  };

  putOfficeValues = () => values => {
    const data = { ...this.formik.current.state.values, ...values };
    this.formik.current.setValues(data);
    this.onCloseOfficeModal();
  };

  onSubmit = values => {
    const data = { ...values };
    data.company = values.company.value;
    data.company_roles = values.company_roles.map(type => type.value);
    const office = this.getOfficeValues();
    if (isTrueValues(office)) {
      data.office_type = values.office_type.value;
      data.office_state = values.office_state.value;
      validateAddress(office).then(response => {
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
    } else {
      this.props.dispatch(completeAccount.post(data, this.setErrorMessages));
    }
  };

  render() {
    const classes = cn("complete-account__field-set", AccountForm.fieldClass);
    const company = this.getCompanyValues();
    const office = this.getOfficeValues();
    return (
      <PageAuth backLink="/">
        <AddressModal
          title="Confirm Office Address"
          onClose={this.onCloseModal}
          theme="highlight"
          onError={this.setErrorMessages}
          dispatch_type="API_COMPLETE_ACCOUNT"
        />
        <CompanyModal
          theme="highlight"
          isOpen={this.state.isCompanyOpen}
          data={company}
          companyRolesOptions={this.props.company_roles}
          loadCompany={this.loadCompany}
          onChangeCompany={this.onChangeCompany}
          onClose={this.onCloseCompanyModal}
          onSave={this.putCompanyValues}
        />
        <OfficeModal
          theme="highlight"
          isOpen={this.state.isOfficeOpen}
          data={office}
          office_options={this.props.office_types}
          office_countries={this.props.office_countries}
          us_state_list={this.props.us_state_list}
          gb_county_list={this.props.gb_county_list}
          loadAddress={this.loadAddress}
          onClose={this.onCloseOfficeModal}
          onSuccess={this.setOfficeSuccess}
          onSave={this.putOfficeValues}
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
                {isTrueValues(company) ? (
                  <CompanyInfo
                    data={company}
                    onOpenCompanyModal={this.onOpenCompanyModal}
                    showErrorMessage={this.showCompanyError}
                  />
                ) : (
                  <CompanyInfoEmpty
                    onOpenCompanyModal={this.onOpenCompanyModal}
                    showErrorMessage={this.showCompanyError}
                  />
                )}
                {isTrueValues(office) ? (
                  <OfficeInfo
                    data={office}
                    onOpenOfficeModal={this.onOpenOfficeModal}
                  />
                ) : (
                  <OfficeInfoEmpty onOpenOfficeModal={this.onOpenOfficeModal} />
                )}
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
