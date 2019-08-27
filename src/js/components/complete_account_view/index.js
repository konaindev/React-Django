import cn from "classnames";
import { Formik, Form } from "formik";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import AccountForm from "../account_form";
import FormFiled from "../form_field";
import PageAuth from "../page_auth";
import Input from "../input";
import Select, { SelectSearch } from "../select";
import Button from "../button";
import Checkbox from "../checkbox";
import MultiSelect from "../multi_select";
import GoogleAddress from "../google_address";
import router from "../../router";

import { propertySchema } from "./validators";
import "./complete_account_view.scss";

class CompleteAccountView extends React.PureComponent {
  static propTypes = {
    office_types: Select.optionsType.isRequired,
    company_roles: MultiSelect.optionsType.isRequired,
    office_address: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.formik = React.createRef();
    this._router = router("/complete-account")(() => {
      props.dispatch({
        type: "API_COMPLETE_ACCOUNT"
      });
    });
  }

  initialValues = {
    first_name: "",
    last_name: "",
    title: "",
    company: undefined,
    company_role: [],
    office_address: undefined,
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
        type: "API_COMPANY",
        data: { company: inputValue },
        callback
      });
    }, 300);
  };

  onSubmit = (values, actions) => {
    const data = { ...values };
    data.company = values.company.value;
    data.company_role = values.company_role.map(type => type.value);
    data.office_type = values.office_type.value;
    data.office_address = values.office_address.value;
    this.props.dispatch({
      type: "API_COMPLETE_ACCOUNT",
      data
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
    this.formik.current.setFieldValue("office_address", value);
  };

  onBlurOfficeAddress = () => {
    this.formik.current.setFieldTouched("office_address");
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

  render() {
    const { company_roles, office_types, companyAddresses } = this.props;
    const classes = cn("complete-account__field-set", AccountForm.fieldClass);
    return (
      <PageAuth backLink="/">
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
                <div className={classes}>
                  <FormFiled
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
                  </FormFiled>
                  <FormFiled
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
                  </FormFiled>
                </div>
                <FormFiled
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
                </FormFiled>
                <FormFiled
                  className={AccountForm.fieldClass}
                  label="company"
                  showError={touched.company}
                  showIcon={false}
                  error={errors?.company?.value}
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
                </FormFiled>
                <FormFiled
                  label="company role"
                  className={AccountForm.fieldClass}
                  showError={touched.company_role}
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
                </FormFiled>
                <FormFiled
                  className={AccountForm.fieldClass}
                  label="office address"
                  showError={touched.office_address}
                  showIcon={false}
                  error={errors?.office_address?.value}
                >
                  <GoogleAddress
                    name="office_address"
                    loadOptions={this.loadAddress}
                    cacheOptions={false}
                    companyAddresses={companyAddresses}
                    labelCompany=""
                    labelGoogle=""
                    value={values.office_address}
                    onChange={this.onChangeOfficeAddress}
                    onBlur={this.onBlurOfficeAddress}
                  />
                </FormFiled>
                <FormFiled
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
                </FormFiled>
                <FormFiled
                  className={AccountForm.fieldClass}
                  label="office type"
                  showError={touched.office_type}
                  showIcon={false}
                  error={errors?.office_type?.value}
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
                </FormFiled>
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
    ...state.completeAccount
  };
};

export default connect(mapState)(CompleteAccountView);
