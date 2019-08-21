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
import { DropdownIndicator } from "../select/select_components";

class CompleteAccountView extends React.PureComponent {
  static propTypes = {
    office_types: Select.optionsType.isRequired,
    company_roles: MultiSelect.optionsType.isRequired,
    officeAddress: PropTypes.array
  };

  static defaultProps = {
    officeAddress: []
  };

  constructor(props) {
    super(props);
    this._router = router("/complete-account")(x =>
      props.dispatch({
        type: "API_COMPLETE_ACCOUNT"
      })
    );
  }

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

  loadAddress = (inputValue, callback) => {};
  loadCompany = (inputValue, callback) => {};

  render() {
    const { company_roles, office_types, officeAddress } = this.props;
    const classes = cn("complete-account__field-set", AccountForm.fieldClass);
    return (
      <PageAuth backLink="/">
        <AccountForm
          className="complete-account"
          steps={this.steps}
          title="Complete your account"
          subtitle="We need just a bit more information about you to complete your account."
        >
          <Formik validationSchema={propertySchema}>
            {({
              errors,
              touched,
              values,
              isValid,
              setFieldValue,
              setFieldTouched,
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
                  error={errors.company}
                >
                  <SelectSearch
                    name="company"
                    theme="highlight"
                    placeholder=""
                    components={this.selectSearchComponents}
                    styles={this.selectStyles}
                    loadOptions={this.loadCompany}
                    isCreatable={true}
                    value={values.company}
                    onChange={props => {
                      setFieldValue("company", props);
                    }}
                    onBlur={() => {
                      setFieldTouched("company");
                    }}
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
                    onChange={props => {
                      setFieldValue("company_role", props);
                    }}
                    onBlur={() => {
                      setFieldTouched("company_role");
                    }}
                  />
                </FormFiled>
                <FormFiled
                  className={AccountForm.fieldClass}
                  label="office address"
                  showError={touched.office_address}
                  showIcon={false}
                  error={errors.office_address}
                >
                  <GoogleAddress
                    name="office_address"
                    loadOptions={this.loadAddress}
                    companyAddresses={officeAddress}
                    value={values.office_address}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                  error={errors.office_type}
                >
                  <Select
                    name="office_type"
                    theme="highlight"
                    styles={this.selectStyles}
                    options={office_types}
                    value={values.office_type}
                    onChange={props => {
                      setFieldValue("office_type", props);
                    }}
                    onBlur={() => {
                      setFieldTouched("office_type");
                    }}
                  />
                </FormFiled>
                <div className="complete-account__terms">
                  <Checkbox
                    className="complete-account__checkbox"
                    isSelected={values.terms}
                    onClick={props => {
                      setFieldValue("terms", !values.terms);
                    }}
                    onBlur={() => console.log("onBlur")}
                  />
                  <input
                    type="checkbox"
                    name="terms"
                    hidden={true}
                    checked={values.terms}
                    onBlur={handleBlur}
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
